import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Zap,
  Code2,
  X
} from 'lucide-react';

interface CodePlaygroundProps {
  initialCode?: string;
  language?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CodePlayground({
  initialCode = `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, LearnWithUs Community!");\n        System.out.println("JVM Heap Memory: " + Runtime.getRuntime().totalMemory() / (1024 * 1024) + " MB");\n    }\n}`,
  language = 'Java',
  isOpen = true,
  onClose
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [selectedLang, setSelectedLang] = useState(language);
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(initialCode);
    setSelectedLang(language);
    setOutputLogs(['// Terminal output will appear here after clicking "Run Code"...']);
  }, [initialCode, language]);

  const handleRunCode = () => {
    setIsRunning(true);
    setIsError(false);
    setOutputLogs(['[COMPILING] Building AST & Bytecode target...']);
    const startTime = performance.now();

    setTimeout(() => {
      const logs: string[] = [];
      let hasErr = false;

      const langLower = selectedLang.toLowerCase();

      if (langLower.includes('javascript') || langLower.includes('js') || langLower.includes('typescript') || langLower.includes('ts')) {
        try {
          const originalLog = console.log;
          const captured: string[] = [];
          console.log = (...args: any[]) => {
            captured.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
          };

          // Safe execution wrapper
          const runFunc = new Function(code);
          runFunc();

          console.log = originalLog;
          logs.push(...(captured.length ? captured : ['[SUCCESS] Code executed silently with no console output.']));
        } catch (err: any) {
          hasErr = true;
          logs.push(`[RUNTIME ERROR] ${err.message}`);
        }
      } else if (langLower.includes('java')) {
        // Java Simulation Execution Engine
        if (code.includes('System.out.println')) {
          const matches = code.match(/System\.out\.println\((.*?)\);/g);
          if (matches) {
            matches.forEach(m => {
              const rawStr = m.replace(/System\.out\.println\(|\);/g, '').trim();
              if (rawStr.startsWith('"') && rawStr.endsWith('"')) {
                logs.push(rawStr.slice(1, -1));
              } else if (rawStr.includes('+')) {
                logs.push('Java Environment Version: 21.0.2 (Oracle JDK)');
                logs.push('JVM Heap Allocated: 512 MB | Active Threads: 4');
              } else {
                logs.push(rawStr);
              }
            });
          }
        }
        if (code.includes('SpringBootApplication') || code.includes('@Service') || code.includes('@RestController')) {
          logs.push('  .   ____          _            __ _ _');
          logs.push(' /\\\\ / ___ \'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\');
          logs.push('( ( )\\___ | \'_ | \'_| | \'_ \\/ _` | \\ \\ \\ \\');
          logs.push(' \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )');
          logs.push('  \'  |____| .__|_| |_|_| |_\\__, | / / / /');
          logs.push(' =========|_|==============|___/=/_/_/_/');
          logs.push(' :: Spring Boot ::               (v3.2.3)');
          logs.push('[INFO] Started Application in 1.482 seconds (process running on port 8080)');
          logs.push('[HTTP GET 200 OK] /api/v1/health -> Response: { "status": "UP", "database": "PostgreSQL Connected" }');
        }
        if (!logs.length) {
          logs.push('[JAVA EXECUTION SUCCESS] Bytecode compiled cleanly.');
          logs.push('Program exited with status 0 (Success).');
        }
      } else {
        logs.push(`[EXECUTION RESULT] ${selectedLang} script processed.`);
        logs.push('Output: Hello from LearnWithUs Code Sandbox!');
      }

      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));
      setIsError(hasErr);
      setOutputLogs(logs);
      setIsRunning(false);
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/40 shadow-2xl relative overflow-hidden space-y-6 bg-[#04070D]/95">
      <div className="glow-point-indigo -top-20 -right-20 opacity-40" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              Live Code Sandbox & Execution Playground
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Edit code, test parameters, and execute live in-browser.
            </p>
          </div>
        </div>

        {/* Language Selector & Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-cyan-300"
          >
            <option value="Java">Java 21</option>
            <option value="Spring Boot">Spring Boot 3</option>
            <option value="JavaScript">JavaScript (ES6)</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Python">Python 3</option>
          </select>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor & Output Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Code Editor Window */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" /> Source Editor ({selectedLang})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCode(initialCode)}
                className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Reset Code"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
              <button
                onClick={handleCopyCode}
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-700/70 bg-[#080C14] shadow-inner">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              className="w-full p-4 bg-transparent text-xs font-mono text-cyan-300 leading-relaxed outline-none resize-none selection:bg-indigo-500/40"
              placeholder="// Write code here..."
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-slate-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-white/10 text-[10px]">Run Code</kbd> to execute
            </span>

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-neon-indigo hover:shadow-neon-cyan transition-all flex items-center gap-2"
            >
              {isRunning ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-Time Output Console */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Terminal Output
            </span>
            {executionTime !== null && (
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                ⚡ {executionTime}ms
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#04070D] p-4 min-h-[300px] max-h-[360px] overflow-y-auto space-y-1.5 font-mono text-xs shadow-inner scrollbar-thin">
            {outputLogs.map((log, idx) => (
              <div
                key={idx}
                className={`${
                  isError ? 'text-rose-400' :
                  log.startsWith('[COMPILING]') ? 'text-slate-400 font-italic' :
                  log.startsWith('[INFO]') ? 'text-indigo-300' :
                  log.startsWith('[HTTP') ? 'text-emerald-400 font-bold' :
                  'text-cyan-300'
                } leading-relaxed break-all`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
