import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockLines: string[] = [];
  let blockKey = 0;

  const renderInlineText = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            className="px-2 py-0.5 mx-1 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-mono text-[11px] font-medium"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-extrabold text-slate-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Toggle Code Block
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        elements.push(
          <div key={blockKey++} className="my-5 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-[#04070D]">
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-indigo-400">
                {codeBlockLang || 'Code'}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              </div>
            </div>
            <pre className="p-5 overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed font-normal">
              {codeBlockLines.join('\n')}
            </pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        // Open code block
        inCodeBlock = true;
        codeBlockLang = line.trim().replace('```', '');
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={blockKey++} className="h-2" />);
      continue;
    }

    // Headers with Space Grotesk font family styling
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={blockKey++} className="font-heading text-sm font-bold text-indigo-300 mt-5 mb-2 flex items-center gap-2 tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          {renderInlineText(trimmed.replace('#### ', ''))}
        </h4>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={blockKey++} className="font-heading text-lg font-bold text-slate-100 mt-7 mb-3 border-b border-slate-800 pb-2 tracking-tight">
          {renderInlineText(trimmed.replace('### ', ''))}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={blockKey++} className="font-heading text-xl font-extrabold gradient-text-indigo-cyan mt-8 mb-4 tracking-tight">
          {renderInlineText(trimmed.replace('## ', ''))}
        </h2>
      );
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={blockKey++} className="font-heading text-2xl font-extrabold text-slate-100 mt-8 mb-4 tracking-tight">
          {renderInlineText(trimmed.replace('# ', ''))}
        </h1>
      );
    }
    // Bullet Lists
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={blockKey++} className="flex items-start gap-2.5 my-2 pl-2 text-xs text-slate-300 font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
          <span className="leading-relaxed">{renderInlineText(trimmed.replace(/^[-*]\s+/, ''))}</span>
        </div>
      );
    }
    // Regular Paragraphs
    else {
      elements.push(
        <p key={blockKey++} className="text-xs text-slate-300 font-sans leading-relaxed my-2">
          {renderInlineText(trimmed)}
        </p>
      );
    }
  }

  return <div className="space-y-1">{elements}</div>;
}

// Utility to strip raw markdown formatting from preview snippets
export function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, '')     // Remove code blocks
    .replace(/`([^`]+)`/g, '$1')         // Remove inline code backticks
    .replace(/#{1,6}\s*/g, '')          // Remove headers ###
    .replace(/\*\*([^*]+)\*\*/g, '$1')     // Remove bold **
    .replace(/\*([^*]+)\*/g, '$1')       // Remove italic *
    .replace(/^[\s-*\+]+/gm, '')        // Remove bullet points
    .replace(/\s+/g, ' ')               // Collapse whitespace
    .trim();
}
