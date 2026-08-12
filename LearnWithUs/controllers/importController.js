const XLSX = require('xlsx');
const Phase = require('../models/Phase');
const Question = require('../models/Question');
const Note = require('../models/Note');

// 1. Bulk Import Phases & Questions from Excel (.xlsx, .csv) or JSON/Txt
exports.importPhasesAndQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an Excel (.xlsx, .csv) or text file' });
    }

    let rows = [];
    const filename = req.file.originalname.toLowerCase();

    if (filename.endsWith('.xlsx') || filename.endsWith('.csv') || filename.endsWith('.xls')) {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json(worksheet);
    } else {
      // Text or JSON parsing
      const fileContent = req.file.buffer.toString('utf-8');
      try {
        rows = JSON.parse(fileContent);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid file format. Please upload valid Excel or JSON template.' });
      }
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'File is empty or contains no valid rows' });
    }

    // Group rows by PhaseName
    const phasesMap = new Map();

    rows.forEach(row => {
      const phaseName = row.PhaseName || row.phaseName || row.Phase || row.phase;
      const questionText = row.Question || row.question;
      const option1 = row.Option1 || row.option1 || row.A;
      const option2 = row.Option2 || row.option2 || row.B;
      const option3 = row.Option3 || row.option3 || row.C;
      const option4 = row.Option4 || row.option4 || row.D;
      let correctOption = parseInt(row.CorrectOptionIndex || row.correctOption || row.Answer || 0, 10);

      if (isNaN(correctOption) || correctOption < 0 || correctOption > 3) {
        correctOption = 0;
      }

      if (phaseName && questionText && option1 && option2) {
        if (!phasesMap.has(phaseName)) {
          phasesMap.set(phaseName, []);
        }
        phasesMap.get(phaseName).push({
          question: questionText,
          options: [option1, option2, option3 || 'Option 3', option4 || 'Option 4'],
          correctOption
        });
      }
    });

    let importedPhasesCount = 0;
    let importedQuestionsCount = 0;

    for (const [phaseName, questions] of phasesMap.entries()) {
      let phase = await Phase.findOne({ name: phaseName });
      if (!phase) {
        phase = new Phase({ name: phaseName, passingScore: 70 });
        await phase.save();
        importedPhasesCount++;
      }

      for (const q of questions) {
        const question = new Question({
          phase: phase._id,
          question: q.question,
          options: q.options,
          correctOption: q.correctOption
        });
        await question.save();
        importedQuestionsCount++;
      }
    }

    res.json({
      message: `Successfully imported ${importedPhasesCount} new Phases and ${importedQuestionsCount} Assessment Questions!`,
      phasesImported: importedPhasesCount,
      questionsImported: importedQuestionsCount
    });

  } catch (error) {
    console.error('Import Error:', error);
    res.status(500).json({ message: 'Error processing uploaded file', error: error.message });
  }
};

// 2. Bulk Import Notes from Excel (.xlsx, .csv) or JSON
exports.importNotes = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an Excel (.xlsx, .csv) or text file' });
    }

    let rows = [];
    const filename = req.file.originalname.toLowerCase();

    if (filename.endsWith('.xlsx') || filename.endsWith('.csv') || filename.endsWith('.xls')) {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json(worksheet);
    } else {
      const fileContent = req.file.buffer.toString('utf-8');
      try {
        rows = JSON.parse(fileContent);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid file format. Please upload valid Excel or JSON template.' });
      }
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'File is empty' });
    }

    let importedNotesCount = 0;

    for (const row of rows) {
      const language = row.Language || row.language || 'General';
      const title = row.Title || row.title;
      const content = row.Content || row.content;

      if (title && content) {
        const note = new Note({ language, title, content });
        await note.save();
        importedNotesCount++;
      }
    }

    res.json({
      message: `Successfully imported ${importedNotesCount} Documentation Notes!`,
      notesImported: importedNotesCount
    });

  } catch (error) {
    console.error('Import Notes Error:', error);
    res.status(500).json({ message: 'Error processing notes file', error: error.message });
  }
};

// 3. Download Sample Templates
exports.downloadExcelTemplate = (req, res) => {
  const sampleData = [
    {
      PhaseName: 'Phase 1: Java Core & OOP Architecture',
      Question: 'What is the JVM Execution Engine in Java?',
      Option1: 'Compiles bytecode into machine instructions',
      Option2: 'Stores HTML files',
      Option3: 'Styles web UI buttons',
      Option4: 'Executes SQL statements',
      CorrectOptionIndex: 0
    },
    {
      PhaseName: 'Phase 1: Java Core & OOP Architecture',
      Question: 'Which memory area holds class metadata since Java 8?',
      Option1: 'PermGen',
      Option2: 'Metaspace',
      Option3: 'Stack Memory',
      Option4: 'Heap Space',
      CorrectOptionIndex: 1
    },
    {
      PhaseName: 'Phase 2: React 18 & Next.js Architecture',
      Question: 'What is the main benefit of React 18 Concurrent Mode?',
      Option1: 'Allows interrupting rendering for priority UI updates',
      Option2: 'Compiles code to C++',
      Option3: 'Replaces HTML elements',
      Option4: 'Removes JS bundles',
      CorrectOptionIndex: 0
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Phases_Questions_Template');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="Phases_Questions_Template.xlsx"');
  res.send(buffer);
};

exports.downloadNotesTemplate = (req, res) => {
  const sampleNotes = [
    {
      Language: 'Java',
      Title: '1. Fundamentals of Java & JVM Architecture',
      Content: '### Java Runtime Architecture\n\nJDK = JRE + Development Tools\nJRE = JVM + Class Libraries'
    },
    {
      Language: 'JavaScript',
      Title: '1. Event Loop & Microtask Queue Mechanics',
      Content: '### Event Loop Execution\n\nMicrotasks (Promises) execute before Macrotasks (setTimeout).'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleNotes);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Notes_Template');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="Notes_Template.xlsx"');
  res.send(buffer);
};
