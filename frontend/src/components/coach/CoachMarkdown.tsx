"use client";

import React from "react";

interface CoachMarkdownProps {
  content: string;
}

export function CoachMarkdown({ content }: CoachMarkdownProps) {
  const lines = content.split("\n");

  const parseInline = (text: string): React.ReactNode[] => {
    // Basic inline parser for bold **text**, inline `code`, and links
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={match.index} className="font-bold text-foreground">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code
            key={match.index}
            className="font-mono text-[11px] bg-[#0F172A] text-primary px-1.5 py-0.5 rounded border border-primary/20"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2); // Skip separator

      const parseCols = (row: string) =>
        row
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c.length > 0);

      const headers = parseCols(headerRow);

      elements.push(
        <div key={`table_${elements.length}`} className="my-3 overflow-x-auto">
          <table className="w-full text-left text-xs border border-border rounded-lg overflow-hidden">
            <thead className="bg-[#0F172A] border-b border-border text-muted-foreground font-mono">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 font-semibold">
                    {parseInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {dataRows.map((row, rIdx) => {
                const cells = parseCols(row);
                return (
                  <tr key={rIdx} className="hover:bg-card-hover transition-colors">
                    {cells.map((c, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-foreground font-sans">
                        {parseInline(c)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("|") && line.endsWith("|")) {
      inTable = true;
      tableRows.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          className="font-heading text-base sm:text-lg font-bold text-foreground mt-3 mb-1.5 flex items-center gap-2"
        >
          {parseInline(line.replace("### ", ""))}
        </h3>
      );
    } else if (line.startsWith("#### ")) {
      elements.push(
        <h4
          key={i}
          className="font-heading text-xs sm:text-sm font-bold text-primary uppercase tracking-wider mt-3 mb-1"
        >
          {parseInline(line.replace("#### ", ""))}
        </h4>
      );
    } else if (line.startsWith("> ")) {
      const quoteText = line.replace("> ", "");
      const isActionOrTip =
        quoteText.toLowerCase().includes("recommended") ||
        quoteText.toLowerCase().includes("next step") ||
        quoteText.toLowerCase().includes("action") ||
        quoteText.toLowerCase().includes("focus");

      elements.push(
        <div
          key={i}
          className={`my-2.5 p-3 sm:p-3.5 rounded-xl border-l-2 text-xs sm:text-sm leading-relaxed font-sans ${
            isActionOrTip
              ? "bg-primary/10 border-primary text-foreground"
              : "bg-primary/5 border-primary/60 text-foreground/90"
          }`}
        >
          {isActionOrTip && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary mb-1 block">
              Key Action / Advice
            </span>
          )}
          {parseInline(quoteText)}
        </div>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 text-xs sm:text-sm text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
          <div className="leading-relaxed">{parseInline(line.replace("- ", ""))}</div>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.*)/);
      if (match) {
        elements.push(
          <div key={i} className="flex items-start gap-2.5 my-1.5 text-xs sm:text-sm text-foreground">
            <span className="h-5 w-5 rounded-md bg-primary/15 border border-primary/25 text-primary text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
              {match[1]}
            </span>
            <div className="leading-relaxed">{parseInline(match[2])}</div>
          </div>
        );
      }
    } else if (line.trim().length === 0) {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-xs sm:text-sm text-foreground/95 leading-relaxed my-1 font-sans">
          {parseInline(line)}
        </p>
      );
    }
  }

  if (inTable) {
    flushTable();
  }

  return <div className="space-y-1">{elements}</div>;
}
