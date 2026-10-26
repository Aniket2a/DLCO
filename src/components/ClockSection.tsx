import React from 'react';

interface ClockSectionProps {
  clockRunning: boolean;
  clockFreq: number;
  clockState: 0 | 1;
  pulseCount: number;
  pulserActive: boolean;
  onToggleClock: () => void;
  onSetFreq: (freq: number) => void;
  onManualPulse: () => void;
  onResetPulseCount: () => void;
  selectedTerminal: string | null;
  onTerminalClick: (tid: string) => void;
  connectedTerminals: Set<string>;
}

export const ClockSection: React.FC<ClockSectionProps> = ({
  clockRunning,
  clockFreq,
  clockState,
  pulseCount,
  pulserActive,
  onToggleClock,
  onSetFreq,
  onManualPulse,
  onResetPulseCount,
  selectedTerminal,
  onTerminalClick,
  connectedTerminals,
}) => {
  const renderJack = (tid: string, label: string, customClass: string) => {
    let jackClass = `terminal-jack ${customClass}`;
    if (selectedTerminal === tid) jackClass += ' selected';
    if (connectedTerminals.has(tid)) jackClass += ' connected';

    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[9px] font-black text-slate-700">{label}</span>
        <div
          className={jackClass}
          data-tid={tid}
          onClick={() => onTerminalClick(tid)}
          title={`Clock Output Terminal [${label}]`}
        />
      </div>
    );
  };

  const freqPresets = [0.1, 1.0, 10.0, 100.0];

  return (
    <div className="bg-slate-50 border border-slate-300 rounded p-2 shadow-sm flex flex-col justify-between">
      <div className="grid grid-cols-2 gap-2 h-full">
        {/* Continuous Clock Generator */}
        <div className="bg-slate-100 border border-slate-300 rounded p-1.5 flex flex-col justify-between">
          <div className="text-[10px] font-black tracking-wider text-amber-700 uppercase border-b border-slate-200 pb-0.5">
            CLOCK GENERATOR
          </div>

          <div className="flex items-center justify-between gap-1 my-1">
            <div className="flex items-center gap-1.5">
              <div
                className={`lamp lamp-amber ${clockRunning && clockState === 1 ? 'on' : ''}`}
                title="Continuous Clock State"
              />
              <span className="text-[9px] font-mono font-bold text-slate-700">
                {clockRunning ? `${clockFreq.toFixed(1)} Hz` : 'STOPPED'}
              </span>
            </div>

            <button
              onClick={onToggleClock}
              className={`text-[9px] font-black px-2.5 py-1 rounded text-white cursor-pointer shadow-xs transition-colors ${
                clockRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              title="Start or Stop continuous clock"
            >
              {clockRunning ? 'STOP' : 'RUN'}
            </button>
          </div>

          {/* Preset Frequency Buttons (0.1 Hz, 1 Hz, 10 Hz, 100 Hz per prompt requirement) */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[8px] font-bold text-slate-500">Presets:</span>
            <div className="flex gap-1">
              {freqPresets.map(f => (
                <button
                  key={f}
                  onClick={() => onSetFreq(f)}
                  className={`text-[8px] font-bold px-1 py-0.5 rounded cursor-pointer border transition-colors ${
                    clockFreq === f
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {f >= 1 ? `${f}Hz` : `${f}Hz`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-around border-t border-slate-200 pt-1 mt-1">
            {renderJack('clk:main', 'CLK', 'jack-clk')}
            {renderJack('clk:bar', 'CLK̅', 'jack-clk-bar')}
          </div>
        </div>

        {/* Manual Pulser */}
        <div className="bg-slate-100 border border-slate-300 rounded p-1.5 flex flex-col justify-between">
          <div className="text-[10px] font-black tracking-wider text-sky-700 uppercase border-b border-slate-200 pb-0.5">
            MANUAL PULSER
          </div>

          <div className="flex items-center justify-between gap-1 my-1">
            <div className="flex items-center gap-1.5">
              <div
                className={`lamp ${pulserActive ? 'on' : ''}`}
                title="Single Pulse Active Indicator"
              />
              <span className="text-[9px] font-bold text-slate-600">1-PULSE</span>
            </div>

            <button
              onClick={onManualPulse}
              className="w-8 h-8 rounded-full bg-gradient-to-b from-sky-500 to-sky-700 hover:from-sky-400 hover:to-sky-600 active:scale-95 text-white text-[8px] font-black border-2 border-slate-900 shadow-md cursor-pointer flex items-center justify-center tracking-tighter"
              title="Press for single clean clock pulse (Falling edge: 1 -> 0 -> 1)"
            >
              PUSH
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-1 mt-1">
            <div className="flex items-center gap-1 bg-black text-sky-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono text-[9px]">
              <span className="text-[8px] text-slate-400">CNT:</span>
              <span className="font-bold">{String(pulseCount).padStart(2, '0')}</span>
              <button
                onClick={onResetPulseCount}
                className="text-[7px] font-bold bg-slate-700 hover:bg-slate-600 text-white px-1 py-0.2 rounded cursor-pointer ml-0.5"
                title="Reset Pulse Counter"
              >
                CLR
              </button>
            </div>

            {renderJack('clk:pulse', 'PULSE', 'jack-pulser')}
          </div>
        </div>
      </div>
    </div>
  );
};
