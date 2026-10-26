import React from 'react';

interface StatusBarProps {
  statusMessage: string;
  wireActionPrompt: string;
  selectedTerminal: string | null;
  selectedWireId: number | null;
  onCancelWire: () => void;
  onDeleteSelectedWire: () => void;
  wireCount: number;
  icCount: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  statusMessage,
  wireActionPrompt,
  selectedTerminal,
  selectedWireId,
  onCancelWire,
  onDeleteSelectedWire,
  wireCount,
  icCount,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 px-5 py-2 border-t border-slate-800 flex items-center justify-between text-xs z-40 flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <span className="text-amber-400">⚡</span>
        <span className="text-slate-200">{statusMessage}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-semibold text-sky-300">{wireActionPrompt}</span>
        {selectedTerminal && (
          <button
            onClick={onCancelWire}
            className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
          >
            Cancel Wire (Esc)
          </button>
        )}
        {selectedWireId !== null && (
          <button
            onClick={onDeleteSelectedWire}
            className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          >
            Delete Wire (Del)
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-400">
        <span>{wireCount} Wires</span>
        <span className="text-slate-600">|</span>
        <span>{icCount} ICs Seated</span>
      </div>
    </footer>
  );
};
