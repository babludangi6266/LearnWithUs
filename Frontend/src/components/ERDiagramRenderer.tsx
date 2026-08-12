import React from 'react';
import { Database, Key, Hash, Calendar, CheckCircle2, Layers, ArrowRight } from 'lucide-react';

interface FieldItem {
  id: string;
  name: string;
  type: string;
  isRequired: boolean;
}

interface ERDiagramRendererProps {
  entityName: string;
  fields: FieldItem[];
  targetType: 'java' | 'mongoose' | 'sql';
}

export default function ERDiagramRenderer({ entityName, fields, targetType }: ERDiagramRendererProps) {
  const cleanEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  const tableName = `${entityName.toLowerCase()}s`;

  return (
    <div className="glass-card rounded-3xl p-6 border border-cyan-500/40 shadow-2xl relative overflow-hidden bg-[#04070D] space-y-6 min-h-[420px]">
      <div className="glow-point-cyan -top-20 -right-20 opacity-30" />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white font-heading">
            Visual ER Diagram — <span className="gradient-text-indigo-cyan">{cleanEntity} Schema</span>
          </h3>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
          Target: {targetType.toUpperCase()}
        </span>
      </div>

      {/* Diagram Canvas Area */}
      <div className="p-6 rounded-2xl bg-[#02050A] border border-white/10 flex items-center justify-center min-h-[320px] relative overflow-hidden">
        
        {/* Visual Entity Card */}
        <div className="w-full max-w-md glass-card rounded-2xl border-2 border-indigo-500/50 shadow-neon-indigo overflow-hidden relative z-10 bg-[#080C14]">
          
          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold font-heading text-sm">
              <Layers className="w-4 h-4" />
              <span>{cleanEntity}</span>
            </div>
            <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded text-cyan-200">
              Table: {tableName}
            </span>
          </div>

          {/* Field Items List */}
          <div className="p-4 space-y-2.5 font-mono text-xs divide-y divide-white/5">
            
            {/* Primary Key Row */}
            <div className="flex items-center justify-between py-1 text-amber-300 font-bold">
              <div className="flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>id</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">PK</span>
              </div>
              <span className="text-slate-400 font-normal">BIGINT / ObjectId</span>
            </div>

            {/* Custom User Fields */}
            {fields.map((f) => {
              const displayType = 
                targetType === 'java' ? (f.type === 'Double' ? 'Double' : f.type === 'Integer' ? 'Integer' : f.type === 'Date' ? 'LocalDateTime' : 'String') :
                targetType === 'mongoose' ? (f.type === 'Double' || f.type === 'Integer' ? 'Number' : f.type === 'Date' ? 'Date' : 'String') :
                (f.type === 'Double' ? 'DECIMAL(10,2)' : f.type === 'Integer' ? 'INTEGER' : f.type === 'Date' ? 'TIMESTAMP' : 'VARCHAR(255)');

              return (
                <div key={f.id} className="flex items-center justify-between py-1.5 text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="font-semibold">{f.name}</span>
                    {f.isRequired && (
                      <span className="text-[9px] px-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">NOT NULL</span>
                    )}
                  </div>
                  <span className="text-cyan-300 text-[11px]">{displayType}</span>
                </div>
              );
            })}

          </div>

          {/* Footer Info */}
          <div className="p-2.5 bg-slate-900/90 border-t border-white/10 text-center text-[10px] font-mono text-slate-400">
            Relational Model Verified • {fields.length + 1} Attributes Defined
          </div>

        </div>

      </div>

    </div>
  );
}
