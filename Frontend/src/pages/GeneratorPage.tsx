import React, { useState } from 'react';
import ERDiagramRenderer from '@/components/ERDiagramRenderer';
import { 
  Code2, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Terminal, 
  Zap, 
  Layers, 
  Database,
  Layout,
  CheckCircle2
} from 'lucide-react';

interface FieldItem {
  id: string;
  name: string;
  type: string;
  isRequired: boolean;
}

export default function GeneratorPage() {
  const [targetType, setTargetType] = useState<'java' | 'mongoose' | 'sql'>('java');
  const [entityName, setEntityName] = useState('Product');
  const [viewMode, setViewMode] = useState<'code' | 'diagram'>('code');
  const [fields, setFields] = useState<FieldItem[]>([
    { id: '1', name: 'title', type: 'String', isRequired: true },
    { id: '2', name: 'price', type: 'Double', isRequired: true },
    { id: '3', name: 'createdAt', type: 'Date', isRequired: false },
  ]);
  const [copied, setCopied] = useState(false);

  const addField = () => {
    setFields(prev => [
      ...prev,
      { id: Date.now().toString(), name: `field${prev.length + 1}`, type: 'String', isRequired: false }
    ]);
  };

  const removeField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const updateField = (id: string, key: keyof FieldItem, value: any) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  // Generate Code Output
  const generateCode = () => {
    const cleanEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    
    if (targetType === 'java') {
      let code = `import jakarta.persistence.*;\nimport java.time.LocalDateTime;\n\n@Entity\n@Table(name = "${entityName.toLowerCase()}s")\npublic class ${cleanEntity} {\n\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n`;
      fields.forEach(f => {
        const javaType = f.type === 'Double' ? 'Double' : f.type === 'Integer' ? 'Integer' : f.type === 'Boolean' ? 'Boolean' : f.type === 'Date' ? 'LocalDateTime' : 'String';
        code += `    @Column(nullable = ${!f.isRequired})\n    private ${javaType} ${f.name};\n\n`;
      });
      code += `    public ${cleanEntity}() {}\n\n`;
      code += `    public Long getId() { return id; }\n    public void setId(Long id) { this.id = id; }\n}`;
      return code;
    } else if (targetType === 'mongoose') {
      let code = `const mongoose = require('mongoose');\n\nconst ${cleanEntity}Schema = new mongoose.Schema({\n`;
      fields.forEach(f => {
        const mType = f.type === 'Double' || f.type === 'Integer' ? 'Number' : f.type === 'Boolean' ? 'Boolean' : f.type === 'Date' ? 'Date' : 'String';
        code += `  ${f.name}: { type: ${mType}, required: ${f.isRequired} },\n`;
      });
      code += `}, { timestamps: true });\n\nmodule.exports = mongoose.model('${cleanEntity}', ${cleanEntity}Schema);`;
      return code;
    } else {
      let code = `CREATE TABLE ${entityName.toLowerCase()}s (\n  id SERIAL PRIMARY KEY,\n`;
      fields.forEach((f, idx) => {
        const sqlType = f.type === 'Double' ? 'DECIMAL(10,2)' : f.type === 'Integer' ? 'INTEGER' : f.type === 'Boolean' ? 'BOOLEAN' : f.type === 'Date' ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 'VARCHAR(255)';
        const comma = idx === fields.length - 1 ? '' : ',';
        code += `  ${f.name} ${sqlType} ${f.isRequired ? 'NOT NULL' : ''}${comma}\n`;
      });
      code += `);`;
      return code;
    }
  };

  const generatedCode = generateCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>Boilerplate Schema & Entity Generator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
          Entity & <span className="gradient-text-indigo-cyan">Schema Generator</span>
        </h1>
        <p className="text-sm text-slate-400 font-light leading-relaxed">
          Define entity attributes visually and instantly export production-ready Java Spring Boot Entities, Mongoose Schemas, or visual ER diagrams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visual Field Builder */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Target Type */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Target Framework / Database
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'java', label: '☕ Java Spring Boot' },
                { id: 'mongoose', label: '🍃 Express Mongoose' },
                { id: 'sql', label: '🐘 PostgreSQL DDL' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTargetType(t.id as any)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                    targetType === t.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-neon-indigo'
                      : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Entity Name */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Entity / Model Class Name
            </label>
            <input
              type="text"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="e.g. Product, Customer, Invoice"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
            />
          </div>

          {/* Fields Builder */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Field Definitions ({fields.length})
              </h3>
              <button
                onClick={addField}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Field
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center gap-3">
                  <input
                    type="text"
                    value={f.name}
                    onChange={(e) => updateField(f.id, 'name', e.target.value)}
                    placeholder="Field name"
                    className="flex-1 px-3 py-1.5 rounded-xl glass-input text-xs font-mono"
                  />
                  <select
                    value={f.type}
                    onChange={(e) => updateField(f.id, 'type', e.target.value)}
                    className="px-3 py-1.5 rounded-xl glass-input text-xs bg-slate-900 font-mono"
                  >
                    <option value="String">String</option>
                    <option value="Double">Double / Number</option>
                    <option value="Integer">Integer</option>
                    <option value="Boolean">Boolean</option>
                    <option value="Date">Date / DateTime</option>
                  </select>

                  <button
                    onClick={() => removeField(f.id)}
                    className="p-2 rounded-xl hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Code & Interactive ER Diagram Output */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* View Mode Switcher */}
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setViewMode('code')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'code'
                  ? 'bg-indigo-600 text-white shadow-neon-indigo'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>💻 Source Code View</span>
            </button>

            <button
              onClick={() => setViewMode('diagram')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'diagram'
                  ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-neon-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5 text-cyan-400" />
              <span>📐 Visual ER Diagram</span>
            </button>
          </div>

          {viewMode === 'code' ? (
            <div className="glass-card rounded-3xl border border-indigo-500/40 shadow-2xl relative overflow-hidden bg-[#04070D]">
              <div className="p-4 bg-slate-900 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" /> Output Generator ({targetType.toUpperCase()})
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-white/10 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-6 overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed min-h-[400px]">
                {generatedCode}
              </pre>
            </div>
          ) : (
            <ERDiagramRenderer
              entityName={entityName}
              fields={fields}
              targetType={targetType}
            />
          )}

        </div>

      </div>

    </div>
  );
}
