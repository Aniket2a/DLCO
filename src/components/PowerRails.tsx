import React from 'react';

interface PowerRailsProps {
  type: 'vcc' | 'gnd';
  selectedTerminal: string | null;
  onTerminalClick: (tid: string) => void;
  connectedTerminals: Set<string>;
}

export const PowerRail: React.FC<PowerRailsProps> = ({
  type,
  selectedTerminal,
  onTerminalClick,
  connectedTerminals,
}) => {
  const isVcc = type === 'vcc';

  // 10 terminals in 5 pairs matching the 5 socket columns
  const pairs = [
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
    [9, 10],
  ];

  return (
    <div
      className={`rounded px-3.5 py-1.5 flex items-center justify-between border shadow-sm ${
        isVcc
          ? 'border-red-200 border-l-[6px] border-l-red-600 bg-gradient-to-r from-red-100 via-red-50 to-slate-50'
          : 'border-emerald-200 border-l-[6px] border-l-emerald-600 bg-gradient-to-r from-emerald-100 via-emerald-50 to-slate-50'
      }`}
    >
      <div className="flex flex-col">
        <span className={`text-[11px] font-black tracking-wider ${isVcc ? 'text-red-700' : 'text-emerald-700'}`}>
          {isVcc ? 'VCC (+5V RAIL)' : 'GROUND (0V RAIL)'}
        </span>
        <span className="text-[9px] text-slate-500">
          {isVcc
            ? 'All VCC terminals share the common +5V supply line. Connect IC VCC pins here.'
            : 'All GROUND terminals share the common 0V reference. Connect IC GND pins here.'}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {pairs.map(([t1, t2], pIdx) => {
          const tid1 = `${type}:${t1}`;
          const tid2 = `${type}:${t2}`;

          let jClass1 = isVcc ? 'terminal-jack jack-vcc' : 'terminal-jack jack-gnd';
          if (selectedTerminal === tid1) jClass1 += ' selected';
          if (connectedTerminals.has(tid1)) jClass1 += ' connected';

          let jClass2 = isVcc ? 'terminal-jack jack-vcc' : 'terminal-jack jack-gnd';
          if (selectedTerminal === tid2) jClass2 += ' selected';
          if (connectedTerminals.has(tid2)) jClass2 += ' connected';

          return (
            <div key={pIdx} className="flex items-center gap-1.5 bg-white/70 px-2 py-0.5 rounded border border-black/5 shadow-xs">
              <span className="text-[9px] font-black text-slate-700">{isVcc ? 'VCC' : 'GND'}</span>
              <div
                className={jClass1}
                data-tid={tid1}
                onClick={() => onTerminalClick(tid1)}
                title={`${isVcc ? 'VCC (+5V)' : 'GROUND (0V)'} Terminal #${t1}`}
              />
              <div
                className={jClass2}
                data-tid={tid2}
                onClick={() => onTerminalClick(tid2)}
                title={`${isVcc ? 'VCC (+5V)' : 'GROUND (0V)'} Terminal #${t2}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
