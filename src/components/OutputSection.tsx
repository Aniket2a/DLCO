import React from 'react';
import { LogicLevel } from '../types';

interface OutputSectionProps {
  ledOutputs: Record<number, LogicLevel>;
  selectedTerminal: string | null;
  onTerminalClick: (tid: string) => void;
  connectedTerminals: Set<string>;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  ledOutputs,
  selectedTerminal,
  onTerminalClick,
  connectedTerminals,
}) => {
  // L16 on far left down to L1 on far right, identical to the physical trainer kit
  const leds = [];
  for (let i = 16; i >= 1; i--) {
    leds.push(i);
  }

  return (
    <div className="bg-slate-50 border border-slate-300 rounded p-2 shadow-sm flex flex-col justify-between">
      <div className="text-[11px] font-extrabold tracking-wider text-red-700 text-center uppercase border-b border-slate-200 pb-1 mb-1.5">
        OUTPUT SECTION
      </div>

      <div className="grid grid-cols-16 gap-1 w-full">
        {leds.map(i => {
          const tid = `out:${i}`;
          const val = ledOutputs[i];
          const isSelected = selectedTerminal === tid;
          const isConnected = connectedTerminals.has(tid);

          let lampClass = 'lamp';
          if (val === 1) {
            lampClass += ' on';
          } else if (val === 'CONFLICT') {
            lampClass += ' on conflict';
          }

          let jackClass = 'terminal-jack';
          if (isSelected) jackClass += ' selected';
          if (isConnected) jackClass += ' connected';

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold text-slate-600">L{i}</span>
              <div className={lampClass} title={`Output LED L${i}: State = ${val !== undefined ? val : 'Z'}`} />
              <div
                className={jackClass}
                data-tid={tid}
                onClick={() => onTerminalClick(tid)}
                title={`Output LED L${i} Terminal (OP${i})`}
              />
              <span className="text-[9px] font-extrabold text-slate-800">OP{i}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
