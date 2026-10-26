import React from 'react';
import { LogicLevel } from '../types';

interface DisplaySectionProps {
  segA: string;
  segB: string;
  probe: LogicLevel;
  selectedTerminal: string | null;
  onTerminalClick: (tid: string) => void;
  connectedTerminals: Set<string>;
}

export const DisplaySection: React.FC<DisplaySectionProps> = ({
  segA,
  segB,
  probe,
  selectedTerminal,
  onTerminalClick,
  connectedTerminals,
}) => {
  const renderJack = (tid: string, label: string) => {
    let jackClass = 'terminal-jack';
    if (selectedTerminal === tid) jackClass += ' selected';
    if (connectedTerminals.has(tid)) jackClass += ' connected';

    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[8px] font-bold text-slate-300">{label}</span>
        <div
          className={jackClass}
          data-tid={tid}
          onClick={() => onTerminalClick(tid)}
          title={`7-Segment Input ${label}`}
        />
      </div>
    );
  };

  let probeLampH = 'lamp';
  let probeLampL = 'lamp';
  if (probe === 1) probeLampH += ' on';
  if (probe === 0) probeLampL += ' lamp-green on';

  let probeJackClass = 'terminal-jack jack-probe';
  if (selectedTerminal === 'probe') probeJackClass += ' selected';
  if (connectedTerminals.has('probe')) probeJackClass += ' connected';

  return (
    <div className="bg-slate-50 border border-slate-300 rounded p-2 shadow-sm flex flex-col justify-between">
      <div className="text-[11px] font-extrabold tracking-wider text-slate-800 text-center uppercase border-b border-slate-200 pb-1 mb-1">
        7 SEGMENT DISPLAY & PROBE
      </div>

      <div className="flex items-center justify-around gap-2">
        {/* Display A */}
        <div className="flex flex-col items-center bg-slate-900 p-1.5 rounded border border-slate-700">
          <div className="font-mono text-2xl font-black text-red-500 bg-black px-2 py-0.5 rounded mb-1.5 shadow-[0_0_8px_rgba(239,68,68,0.8)] min-w-[28px] text-center leading-none">
            {segA}
          </div>
          <div className="flex gap-1.5">
            {renderJack('seg:a3', 'A3')}
            {renderJack('seg:a2', 'A2')}
            {renderJack('seg:a1', 'A1')}
            {renderJack('seg:a0', 'A0')}
          </div>
        </div>

        {/* Display B */}
        <div className="flex flex-col items-center bg-slate-900 p-1.5 rounded border border-slate-700">
          <div className="font-mono text-2xl font-black text-red-500 bg-black px-2 py-0.5 rounded mb-1.5 shadow-[0_0_8px_rgba(239,68,68,0.8)] min-w-[28px] text-center leading-none">
            {segB}
          </div>
          <div className="flex gap-1.5">
            {renderJack('seg:b3', 'B3')}
            {renderJack('seg:b2', 'B2')}
            {renderJack('seg:b1', 'B1')}
            {renderJack('seg:b0', 'B0')}
          </div>
        </div>

        {/* Logic Probe */}
        <div className="flex flex-col items-center gap-1 p-1 bg-slate-200 rounded border border-slate-300">
          <div className="text-[8px] font-extrabold text-slate-800 text-center leading-tight">
            LOGIC<br />PROBE
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="flex flex-col items-center">
              <div className={probeLampH} title="Logic HIGH (+5V)" />
              <span className="text-[8px] font-extrabold">H</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={probeLampL} title="Logic LOW (0V)" />
              <span className="text-[8px] font-extrabold">L</span>
            </div>
          </div>
          <div
            className={probeJackClass}
            data-tid="probe"
            onClick={() => onTerminalClick('probe')}
            title="Logic Probe Input Terminal"
          />
        </div>
      </div>
    </div>
  );
};
