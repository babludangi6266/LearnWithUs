const Phase = require('../models/Phase');
const Question = require('../models/Question');

const INITIAL_PHASES_DATA = [
  {
    name: 'Phase 1: Java Core & Object-Oriented Architecture',
    passingScore: 70,
    questions: [
      {
        question: 'What is the fundamental difference between JVM, JRE, and JDK in Java 21?',
        options: [
          'JDK is for HTML, JRE is for CSS, JVM is for JS',
          'JDK includes development tools + JRE; JRE provides runtime libraries + JVM; JVM executes bytecode',
          'JVM is a database engine; JDK is a web browser',
          'They are identical terms with no structural difference'
        ],
        correctOption: 1
      },
      {
        question: 'How does pass-by-value work for object references in Java?',
        options: [
          'Java passes objects by reference directly',
          'Java passes a copy of the reference address by value',
          'Java converts all objects into primitives before passing',
          'Java uses C++ pointers under the hood'
        ],
        correctOption: 1
      },
      {
        question: 'Which interface in java.util.concurrent provides thread-safe map operations without locking the entire table?',
        options: ['Hashtable', 'HashMap', 'ConcurrentHashMap', 'TreeMap'],
        correctOption: 2
      }
    ]
  },
  {
    name: 'Phase 2: JVM Memory Model & Garbage Collection Mechanics',
    passingScore: 70,
    questions: [
      {
        question: 'Where is Class Metadata stored starting from Java 8 onwards?',
        options: ['PermGen', 'Metaspace (Off-Heap Native Memory)', 'Stack Frame', 'Eden Space'],
        correctOption: 1
      },
      {
        question: 'Which Garbage Collector is engineered for ultra-low latency pauses (<1ms) on multi-terabyte heaps?',
        options: ['Parallel GC', 'Serial GC', 'ZGC (Z Garbage Collector)', 'CMS Collector'],
        correctOption: 2
      },
      {
        question: 'What happens during a Minor GC cycle in HotSpot JVM?',
        options: ['All Metaspace classes are unloaded', 'Unreferenced objects in Young Generation (Eden/Survivor) are collected', 'Old Generation is compacted', 'JVM shuts down'],
        correctOption: 1
      }
    ]
  },
  {
    name: 'Phase 3: JavaScript Core, Event Loop & Async Architecture',
    passingScore: 70,
    questions: [
      {
        question: 'How does the JavaScript V8 Engine handle Microtasks vs Macrotasks in the Event Loop?',
        options: [
          'Macrotasks run before every Microtask',
          'The Microtask queue (Promises, queueMicrotask) is exhausted completely before picking the next Macrotask (setTimeout)',
          'Microtasks and Macrotasks run in parallel worker threads',
          'V8 does not use queues'
        ],
        correctOption: 1
      },
      {
        question: 'What is a JavaScript Closure and how does it affect memory retention?',
        options: [
          'A closure is a closed function that accepts no parameters',
          'A function bound together with references to its surrounding lexical environment, keeping outer scope variables alive',
          'A tool to close browser windows automatically',
          'An HTML element tag'
        ],
        correctOption: 1
      },
      {
        question: 'What is the purpose of Object.freeze() vs Object.seal() in ES6+?',
        options: [
          'freeze() prevents modifications & additions; seal() allows modifying existing properties but prevents additions/deletions',
          'seal() makes objects immutable; freeze() does nothing',
          'They both convert JS objects into JSON strings',
          'There is no difference'
        ],
        correctOption: 0
      }
    ]
  },
  {
    name: 'Phase 4: Modern Frontend Frameworks (React 18 & Next.js 14)',
    passingScore: 70,
    questions: [
      {
        question: 'What is the primary benefit of React 18 Concurrent Rendering & useTransition hook?',
        options: [
          'It compiles React code into WebAssembly',
          'It allows marking non-urgent state updates as transitions so high-priority user inputs remain responsive without UI freeze',
          'It replaces CSS flexbox with Grid',
          'It eliminates the need for useState'
        ],
        correctOption: 1
      },
      {
        question: 'In Next.js 14 App Router, what is the difference between Server Components and Client Components?',
        options: [
          'Server Components render on the server with zero client bundle impact; Client Components run interactive hooks (useState, useEffect)',
          'Client Components run on Node.js; Server Components run in the browser',
          'Server Components only support CSS',
          'They are identical'
        ],
        correctOption: 0
      },
      {
        question: 'Why should key props in React lists be unique stable identifiers instead of array index?',
        options: [
          'Array index keys break state persistence during dynamic insertion or sorting of list items',
          'React throws a hard crash if key is a number',
          'Array keys decrease internet connection speed',
          'To satisfy TypeScript types'
        ],
        correctOption: 0
      }
    ]
  },
  {
    name: 'Phase 5: Spring Boot Microservices & Data JPA Architecture',
    passingScore: 70,
    questions: [
      {
        question: 'How do you prevent the N+1 SELECT query problem in Spring Data JPA?',
        options: [
          'Use @EntityGraph, JOIN FETCH in JPQL, or DTO projections',
          'Add Thread.sleep() inside the repository',
          'Use @Autowired on every field',
          'Convert database tables into static arrays'
        ],
        correctOption: 0
      },
      {
        question: 'What is the role of @Transactional(readOnly = true) in Spring Data JPA?',
        options: [
          'It speeds up database write queries',
          'It disables Hibernate dirty checking and optimizes transaction isolation for read queries',
          'It deletes the database table after execution',
          'It locks the database table exclusively'
        ],
        correctOption: 1
      },
      {
        question: 'Which Spring Boot starter provides automated health checks, metrics endpoints, and application monitoring?',
        options: ['spring-boot-starter-web', 'spring-boot-starter-actuator', 'spring-boot-starter-test', 'spring-boot-starter-security'],
        correctOption: 1
      }
    ]
  },
  {
    name: 'Phase 6: Artificial Intelligence, LLMs & RAG Vector Search',
    passingScore: 70,
    questions: [
      {
        question: 'What is the core architectural innovation of the Transformer model (Attention Is All You Need)?',
        options: [
          'Convolutional filters',
          'Self-Attention Mechanism compute parallelized token representations across sequence positions',
          'Recurrent hidden state loops',
          'Rule-based IF/ELSE trees'
        ],
        correctOption: 1
      },
      {
        question: 'In Retrieval-Augmented Generation (RAG), what is the role of Vector Embeddings & Cosine Similarity?',
        options: [
          'Embeddings map text into dense floating-point vector space; Cosine Similarity measures semantic relevance to retrieve context for LLMs',
          'They convert Python scripts into executable EXE files',
          'They hash user passwords securely',
          'They generate HTML layouts automatically'
        ],
        correctOption: 0
      },
      {
        question: 'What is the difference between Prompt Engineering, RAG, and Fine-Tuning a Large Language Model?',
        options: [
          'Prompting designs instructions; RAG injects external dynamic knowledge; Fine-Tuning updates model weights on specialized datasets',
          'Fine-tuning is cheaper than prompt engineering',
          'RAG replaces the neural network with SQL database',
          'There is no structural difference'
        ],
        correctOption: 0
      }
    ]
  },
  {
    name: 'Phase 7: Data Structures & Algorithms (DSA - Trees, DP & Graphs)',
    passingScore: 70,
    questions: [
      {
        question: 'What is the average and worst-case time complexity of HashMap lookup vs Red-Black Tree (TreeMap)?',
        options: [
          'HashMap: O(1) avg / O(n) worst; TreeMap: O(log n) guaranteed for lookup, insertion, and deletion',
          'HashMap: O(n^2); TreeMap: O(1)',
          'HashMap: O(log n); TreeMap: O(n!)',
          'Both are always O(1)'
        ],
        correctOption: 0
      },
      {
        question: 'Which traversal algorithm guarantees finding the shortest path in an unweighted Graph?',
        options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'In-Order Tree Traversal', 'Pre-Order Traversal'],
        correctOption: 1
      },
      {
        question: 'What is the key principle of Dynamic Programming (Memoization vs Tabulation)?',
        options: [
          'Breaking problems into overlapping subproblems and storing subproblem results to avoid redundant calculations',
          'Sorting elements using quicksort',
          'Using random guesses until correct',
          'Executing algorithms in parallel threads'
        ],
        correctOption: 0
      }
    ]
  },
  {
    name: 'Phase 8: System Design, Scalability & High-Throughput Architecture',
    passingScore: 70,
    questions: [
      {
        question: 'According to the CAP Theorem, which 2 guarantees can a Distributed Database choose during a Network Partition (P)?',
        options: [
          'Consistency (C) OR Availability (A)',
          'Consistency AND Availability AND Performance simultaneously',
          'Only Storage and RAM',
          'CAP Theorem does not apply to distributed databases'
        ],
        correctOption: 0
      },
      {
        question: 'Why is Consistent Hashing used in distributed caching clusters (e.g. Redis Cluster / Memcached)?',
        options: [
          'To minimize key remapping when cache servers are added or removed from the cluster',
          'To encrypt user credit card numbers',
          'To format JSON API responses',
          'To compress images before upload'
        ],
        correctOption: 0
      },
      {
        question: 'What is the role of a Message Queue (Apache Kafka / RabbitMQ) in Microservices architecture?',
        options: [
          'To decouple services asynchronously, handle traffic surges (buffer spikes), and ensure event durability',
          'To style web frontend buttons',
          'To store CSS stylesheets',
          'To compile Java code'
        ],
        correctOption: 0
      }
    ]
  }
];

// Add a new phase
exports.addPhase = async (req, res) => {
  try {
    const newPhase = new Phase({ name: req.body.name });
    await newPhase.save();
    res.status(201).json(newPhase);
  } catch (error) {
    res.status(500).json({ message: 'Error creating phase' });
  }
};

// Get all phases (auto re-seeds if empty or old phases detected)
exports.getPhases = async (req, res) => {
  try {
    let phases = await Phase.find();
    const hasOldPhases = !phases || phases.length === 0 || phases.some(p => p.name === "Hello World" || p.name === "GK" || p.name.includes("Python") || p.name === "Java OOP's");
    if (hasOldPhases || req.query.seed === 'true') {
      return exports.seedPhases(req, res);
    }
    res.json(phases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching phases' });
  }
};

// Update a phase
exports.updatePhase = async (req, res) => {
  try {
    const updatedPhase = await Phase.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    res.json(updatedPhase);
  } catch (error) {
    res.status(500).json({ message: 'Error updating phase' });
  }
};

// Delete a phase
exports.deletePhase = async (req, res) => {
  try {
    await Phase.findByIdAndDelete(req.params.id);
    await Question.deleteMany({ phase: req.params.id });
    res.json({ message: 'Phase and its questions deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting phase' });
  }
};

// Clear all phases and seed Java, JS, AI, and DSA curriculum
exports.seedPhases = async (req, res) => {
  try {
    await Phase.deleteMany({});
    await Question.deleteMany({});

    const createdPhases = [];
    for (const phaseData of INITIAL_PHASES_DATA) {
      const phase = new Phase({
        name: phaseData.name,
        passingScore: phaseData.passingScore || 70,
      });
      await phase.save();

      for (const q of phaseData.questions) {
        const question = new Question({
          phase: phase._id,
          question: q.question,
          options: q.options,
          correctOption: q.correctOption,
        });
        await question.save();
      }

      createdPhases.push(phase);
    }

    res.json({
      message: 'All old phases cleared. Seeded 8 curriculum phases (Java, JavaScript, AI, DSA) with questions!',
      count: createdPhases.length,
      phases: createdPhases
    });
  } catch (error) {
    console.error('Error seeding phases:', error);
    res.status(500).json({ message: 'Error seeding phases', error });
  }
};
