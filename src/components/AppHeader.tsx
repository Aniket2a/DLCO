import React from 'react';
import { BookOpen, Stethoscope, PlayCircle, RotateCcw, Undo2, Redo2, Trash2, ZoomIn, ZoomOut, Cpu } from 'lucide-react';

interface AppHeaderProps {
  wireColor: string;
  setWireColor: (color: string) => void;
  zoom: number;
  setZoom: (fn: (prev: number) => number) => void;
  resetZoom: () => void;
  onOpenExpDrawer: () => void;
  onOpenPinDiagrams: () => void;
  onOpenDiagnostics: () => void;
  onOpenTests: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClearWire: () => void;
  onClearBoard: () => void;
  onResetBoard: () => void;
  hasSelectedWire: boolean;
  hasWires: boolean;
  diagStatus: 'HEALTHY' | 'CHECK' | 'ERROR';
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  wireColor,
  setWireColor,
  zoom,
  setZoom,
  resetZoom,
  onOpenExpDrawer,
  onOpenPinDiagrams,
  onOpenDiagnostics,
  onOpenTests,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClearWire,
  onClearBoard,
  onResetBoard,
  hasSelectedWire,
  hasWires,
  diagStatus,
}) => {
  return (
    <header className="bg-slate-900 text-slate-100 border-b-2 border-slate-700 px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap z-50">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black bg-red-700 text-white px-2 py-0.5 rounded tracking-wider uppercase">
            Hardware Lab Instrument
          </span>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
            11 Exam Practicals Verified
          </span>
        </div>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2 mt-0.5">
          DLCO Pin-to-Pin Virtual Trainer Kit
        </h1>
        <p className="text-xs text-slate-400">
          Digital Logic & Computer Organization • Physical Pin Wiring & Circuit Simulation
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onOpenExpDrawer}
          className="px-3 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          title="Open DLCO Exam Practicals, Wiring Guides & Viva Questions"
        >
          <BookOpen className="w-4 h-4" />
          <span>Lab Practicals (11 Exam + Labs)</span>
        </button>

        <button
          onClick={onOpenPinDiagrams}
          className="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-600 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          title="Open Reference IC Pin Diagrams (8 Reference Pages covering 7408, 7400, 7432, 7486, 74266, 7404, 7483, 74153, 74138, 7476, 7490)"
        >
          <Cpu className="w-4 h-4" />
          <span>IC Pin Diagrams (8 Ref Pages)</span>
        </button>

        <button
          onClick={onOpenTests}
          className="px-3 py-1.5 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          title="Run Automated Verification Tests (28 Verified Circuit Tests)"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Automated Tests</span>
        </button>

        <button
          onClick={onOpenDiagnostics}
          className="px-2.5 py-1.5 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Open Electrical Health & Signal Diagnostics"
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Diagnostics</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              diagStatus === 'HEALTHY'
                ? 'bg-emerald-600 text-white'
                : diagStatus === 'CHECK'
                ? 'bg-amber-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {diagStatus}
          </span>
        </button>

        {/* Wire Color Picker */}
        <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs text-slate-300">
          <label htmlFor="wireColor">Wire:</label>
          <select
            id="wireColor"
            value={wireColor}
            onChange={e => setWireColor(e.target.value)}
            className="bg-slate-900 text-white border border-slate-600 rounded px-1.5 py-0.5 text-xs cursor-pointer focus:outline-none"
          >
            <option value="auto">Auto (VCC:Red, GND:Green, Signal:Blue)</option>
            <option value="#2563eb">Blue (Signal)</option>
            <option value="#dc2626">Red (VCC / High)</option>
            <option value="#16a34a">Green (GND / Low)</option>
            <option value="#d97706">Amber (Clock / Data)</option>
            <option value="#9333ea">Purple</option>
            <option value="#0d9488">Cyan</option>
            <option value="#111827">Black</option>
            <option value="#f8fafc">White</option>
          </select>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs text-slate-300">
          <button
            onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
            className="p-0.5 hover:text-white cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-9 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(1.4, z + 0.1))}
            className="p-0.5 hover:text-white cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetZoom}
            className="p-0.5 hover:text-white cursor-pointer text-slate-400"
            title="Reset Zoom to 100%"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-1.5 text-xs font-semibold rounded border flex items-center gap-1 transition-colors ${
            canUndo
              ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600 cursor-pointer'
              : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
          }`}
          title="Undo Wire Action (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-1.5 text-xs font-semibold rounded border flex items-center gap-1 transition-colors ${
            canRedo
              ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600 cursor-pointer'
              : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
          }`}
          title="Redo Wire Action (Ctrl+Y)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        {/* Clear Wire (selected wire) */}
        <button
          onClick={onClearWire}
          className={`px-2.5 py-1.5 text-xs font-semibold rounded border flex items-center gap-1.5 transition-colors cursor-pointer ${
            hasSelectedWire
              ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 shadow-sm animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
          }`}
          title={
            hasSelectedWire
              ? 'Remove the selected wire (Delete / Backspace)'
              : 'Select a wire on the board, then click here to remove it'
          }
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Wire</span>
        </button>

        {/* Clear Board (clears all wires, ICs, and placed components) */}
        <button
          onClick={onClearBoard}
          className="px-2.5 py-1.5 text-xs font-semibold rounded bg-amber-600 hover:bg-amber-700 text-white border border-amber-500 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Clear the entire board (removes all wires, unseats all ICs from sockets, and resets switches)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Board</span>
        </button>

        {/* Reset Board (complete reset) */}
        <button
          onClick={onResetBoard}
          className="px-2.5 py-1.5 text-xs font-semibold rounded bg-red-700 hover:bg-red-800 text-white border border-red-600 transition-colors cursor-pointer"
          title="Reset entire trainer kit (clears all wires, unseats ICs, stops clock)"
        >
          Reset Board
        </button>
      </div>
    </header>
  );
};
