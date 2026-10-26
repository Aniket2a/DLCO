import React from 'react';

interface InputSectionProps {
  switches: Record<number, 0 | 1>;
  onToggleSwitch: (swId: number) => void;
  selectedTerminal: string | null;
  onTerminalClick: (tid: string) => void;
  connectedTerminals: Set<string>;
}

export const InputSection: React.FC<InputSectionProps> = ({
  switches,
  onToggleSwitch,
  selectedTerminal,
  onTerminalClick,
  connectedTerminals,
}) => {
  // S16 on far left down to S1 on far right, identical to the physical trainer kit
  const swIds = [];
  for (let i = 16; i >= 1; i--) {
    swIds.push(i);
  }

  return (
    <div className="bg-slate-50 border border-slate-300 rounded p-2 shadow-sm flex flex-col justify-between">
      <div className="flex items-baseline justify-between border-b border-slate-200 pb-1 mb-1.5">
        <span className="text-[11px] font-extrabold tracking-wider text-slate-800 uppercase">
          INPUT LOGIC SWITCHES
        </span>
        <span className="text-[9px] text-slate-500">
          Switch UP = HIGH (1), DOWN = LOW (0). Connect terminals IP16..IP1 to IC inputs.
        </span>
      </div>

      <div className="grid grid-cols-16 gap-1 w-full">
        {swIds.map(i => {
          const tid = `in:${i}`;
          const isHigh = switches[i] === 1;
          const isSelected = selectedTerminal === tid;
          const isConnected = connectedTerminals.has(tid);

          let jackClass = 'terminal-jack';
          if (isSelected) jackClass += ' selected';
          if (isConnected) jackClass += ' connected';

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-extrabold text-slate-800">S{i}</span>
              <div
                className={jackClass}
                data-tid={tid}
                onClick={() => onTerminalClick(tid)}
                title={`Input Switch S${i} Terminal (IP${i})`}
              />
              <div className={`lamp ${isHigh ? 'on' : ''}`} title={`Switch S${i} Status Indicator`} />
              <div
                onClick={() => onToggleSwitch(i)}
                className={`toggle-switch-hardware ${isHigh ? 'up' : 'down'}`}
                title={`Toggle Switch S${i} (${isHigh ? 'HIGH' : 'LOW'})`}
              >
                <div className="switch-lever" />
              </div>
              <span className={`text-[9px] font-extrabold ${isHigh ? 'text-red-600' : 'text-slate-500'}`}>
                {isHigh ? '1' : '0'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
