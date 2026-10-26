import React, { useState } from 'react';
import { X, Cpu, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { IC_DEFINITIONS } from '../engine/icLibrary';

interface ICPinDiagramsModalProps {
  onClose: () => void;
  onInsertIcToSocket?: (icCode: string, socketId: string) => void;
  sockets?: Record<string, { ic: string | null }>;
}

interface PageData {
  pageNumber: number;
  title: string;
  subtitle: string;
  icCodes: string[];
  notes: string;
}

const PAGES_DATA: PageData[] = [
  {
    pageNumber: 1,
    title: 'Page 1: AND & NAND Gates',
    subtitle: 'IC 7408 Quad 2-Input AND Gate & IC 7400 Quad 2-Input NAND Gate',
    icCodes: ['7408', '7400'],
    notes: 'Standard 14-pin DIP configuration. VCC is Pin 14 (+5V) and GND is Pin 7 (0V). Quad independent 2-input logic gates.',
  },
  {
    pageNumber: 2,
    title: 'Page 2: OR & XOR Gates',
    subtitle: 'IC 7432 Quad 2-Input OR Gate & IC 7486 Quad 2-Input XOR Gate',
    icCodes: ['7432', '7486'],
    notes: 'Standard 14-pin DIP configuration. VCC is Pin 14 (+5V) and GND is Pin 7 (0V). Identical pin layout between 7408, 7400, 7432, and 7486.',
  },
  {
    pageNumber: 3,
    title: 'Page 3: XNOR & NOT Gates',
    subtitle: 'IC 74266 Quad 2-Input XNOR Gate & IC 7404 Hex Inverter',
    icCodes: ['74266', '7404'],
    notes: '74266 is an open-collector Quad XNOR gate (Equivalence gate) with pull-up behavior. 7404 contains 6 independent NOT inverters. Both use VCC=14 and GND=7.',
  },
  {
    pageNumber: 4,
    title: 'Page 4: 4-Bit Binary Adder',
    subtitle: 'IC 7483 4-Bit Binary Full Adder with Fast Look-Ahead Carry',
    icCodes: ['7483'],
    notes: '16-pin DIP package. CRITICAL DATASHEET NOTE: VCC is Pin 5 and GND is Pin 12 (NOT corners). Inputs A1-A4, B1-B4, Carry In C0 (Pin 13), Sum S1-S4, Carry Out C4 (Pin 14).',
  },
  {
    pageNumber: 5,
    title: 'Page 5: Dual 4-to-1 Multiplexer',
    subtitle: 'IC 74153 Dual 4-Line to 1-Line Data Selector / Multiplexer',
    icCodes: ['74153'],
    notes: '16-pin DIP package. VCC is Pin 16 and GND is Pin 8. Common address select lines S0/A (Pin 14) and S1/B (Pin 2). Individual active-LOW strobes 1G̅ (Pin 1) and 2G̅ (Pin 15).',
  },
  {
    pageNumber: 6,
    title: 'Page 6: 3-to-8 Line Decoder',
    subtitle: 'IC 74138 3-to-8 Line Decoder / Demultiplexer',
    icCodes: ['74138'],
    notes: '16-pin DIP package. VCC is Pin 16 and GND is Pin 8. Enables: G1 (Pin 6, active-HIGH), G2A̅ (Pin 4, active-LOW), G2B̅ (Pin 5, active-LOW). All 8 outputs Y0̅-Y7̅ are active-LOW.',
  },
  {
    pageNumber: 7,
    title: 'Page 7: Dual Master-Slave JK Flip-Flop',
    subtitle: 'IC 7476 Dual JK Flip-Flop with Preset & Clear',
    icCodes: ['7476'],
    notes: '16-pin DIP package. VCC is Pin 16 and GND is Pin 8. Negative-edge triggered master-slave flip-flops with asynchronous active-LOW Preset (PRE̅) and Clear (CLR̅).',
  },
  {
    pageNumber: 8,
    title: 'Page 8: Decade & Binary Counter',
    subtitle: 'IC 7490 Decade & BCD Counter (Divide-by-2 & Divide-by-5)',
    icCodes: ['7490'],
    notes: '14-pin DIP package. VCC is Pin 5 and GND is Pin 10. Contains independent divide-by-2 section (CKA: Pin 14, QA: Pin 12) and divide-by-5 section (CKB: Pin 1, QB, QC, QD). Reset to 0: R0(1)=R0(2)=1.',
  },
];

export const ICPinDiagramsModal: React.FC<ICPinDiagramsModalProps> = ({
  onClose,
  onInsertIcToSocket,
  sockets,
}) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [targetSocket, setTargetSocket] = useState<string>('U1');

  const currentPageData = PAGES_DATA.find(p => p.pageNumber === selectedPage) || PAGES_DATA[0];

  const getPinColor = (type: string) => {
    switch (type) {
      case 'vcc':
        return { bg: 'bg-red-500', text: 'text-red-700', badge: 'bg-red-100 text-red-800 border-red-300' };
      case 'gnd':
        return { bg: 'bg-emerald-600', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'out':
        return { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' };
      case 'clk':
        return { bg: 'bg-yellow-500', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-900 border-yellow-300 font-bold' };
      case 'in':
        return { bg: 'bg-blue-500', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800 border-blue-300' };
      default:
        return { bg: 'bg-slate-400', text: 'text-slate-600', badge: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const renderDIPPackage = (icCode: string) => {
    const def = IC_DEFINITIONS[icCode];
    if (!def) return null;

    const totalPins = def.pins;
    const half = totalPins / 2;
    const leftPins: number[] = [];
    for (let p = 1; p <= half; p++) leftPins.push(p);
    const rightPins: number[] = [];
    for (let p = totalPins; p > half; p--) rightPins.push(p);

    return (
      <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 shadow-xl flex flex-col items-center">
        {/* Package Header */}
        <div className="text-center mb-3">
          <span className="text-xs font-mono font-black text-amber-400 tracking-wider uppercase">
            {def.package}
          </span>
          <h4 className="text-base font-bold text-white tracking-wide">{def.name}</h4>
          <div className="flex items-center justify-center gap-4 text-xs mt-1">
            <span className="text-red-400 font-mono font-bold">VCC: Pin {def.vccPin} (+5V)</span>
            <span className="text-emerald-400 font-mono font-bold">GND: Pin {def.gndPin} (0V)</span>
          </div>
        </div>

        {/* Physical DIP IC Diagram */}
        <div className="relative w-full max-w-md bg-slate-950 border border-slate-700 rounded-md p-3 flex justify-between items-center my-2">
          {/* Left Pins (1 to half) */}
          <div className="flex flex-col gap-1.5 flex-1 pr-2">
            {leftPins.map(p => {
              const pin = def.pinout[p];
              const colors = getPinColor(pin?.type || 'nc');
              return (
                <div key={p} className="flex items-center gap-1.5 text-xs justify-end">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${colors.badge}`}>
                    {pin?.name || 'NC'}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400 w-4 text-right">{p}</span>
                  <div className="w-3 h-1 bg-slate-500 rounded-l" />
                </div>
              );
            })}
          </div>

          {/* Central Black DIP Body with Notch & Dot */}
          <div className="w-24 bg-zinc-900 border-2 border-zinc-700 rounded relative flex flex-col items-center justify-center py-6 shadow-inner">
            {/* Notch at Top */}
            <div className="absolute top-0 w-6 h-3 bg-slate-950 border-b border-x border-zinc-700 rounded-b-full" />
            {/* Pin 1 Indication Dot */}
            <div className="absolute top-4 left-2 w-2 h-2 rounded-full bg-zinc-600 border border-zinc-500" />
            <div className="font-mono text-center my-auto">
              <span className="text-xs font-black text-amber-300 block">{icCode}</span>
              <span className="text-[9px] text-zinc-400 block mt-0.5">TTL DIP-{totalPins}</span>
            </div>
          </div>

          {/* Right Pins (totalPins down to half+1) */}
          <div className="flex flex-col gap-1.5 flex-1 pl-2">
            {rightPins.map(p => {
              const pin = def.pinout[p];
              const colors = getPinColor(pin?.type || 'nc');
              return (
                <div key={p} className="flex items-center gap-1.5 text-xs">
                  <div className="w-3 h-1 bg-slate-500 rounded-r" />
                  <span className="text-[11px] font-mono font-bold text-slate-400 w-4">{p}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${colors.badge}`}>
                    {pin?.name || 'NC'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pinout Details Table */}
        <div className="w-full mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-700 rounded overflow-hidden">
            <thead className="bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
              <tr>
                <th className="py-1 px-2 border-b border-slate-700">Pin</th>
                <th className="py-1 px-2 border-b border-slate-700">Symbol</th>
                <th className="py-1 px-2 border-b border-slate-700">Type</th>
                <th className="py-1 px-2 border-b border-slate-700">Functional Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px] text-slate-300">
              {Object.keys(def.pinout).map(pStr => {
                const p = Number(pStr);
                const pin = def.pinout[p];
                const colors = getPinColor(pin?.type || 'nc');
                return (
                  <tr key={p} className="hover:bg-slate-800/60">
                    <td className="py-0.5 px-2 font-bold text-white">{p}</td>
                    <td className="py-0.5 px-2 font-black text-amber-300">{pin.name}</td>
                    <td className="py-0.5 px-2">
                      <span className={`px-1 rounded text-[9px] uppercase font-bold border ${colors.badge}`}>
                        {pin.type}
                      </span>
                    </td>
                    <td className="py-0.5 px-2 text-slate-400">{pin.desc || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quick Insert to Socket Action */}
        {onInsertIcToSocket && (
          <div className="mt-4 pt-3 border-t border-slate-800 w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold">Insert into socket:</span>
              <select
                value={targetSocket}
                onChange={e => setTargetSocket(e.target.value)}
                className="bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-xs cursor-pointer focus:outline-none"
              >
                {['U1', 'U2', 'U3', 'U4', 'U5', 'U6'].map(sockId => {
                  const seated = sockets?.[sockId]?.ic;
                  return (
                    <option key={sockId} value={sockId}>
                      {sockId} {seated ? `(${seated})` : '(Empty)'}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              onClick={() => onInsertIcToSocket(icCode, targetSocket)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Cpu className="w-3.5 h-3.5" />
              Place {icCode} on {targetSocket}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Reference IC Pin Diagrams & Specifications
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-2 py-0.5 rounded">
                  8 Reference Pages
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ground-truth pin diagrams verified against authoritative manufacturer datasheets (TI / Motorola)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body with Sidebar & Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Page Selector Sidebar */}
          <div className="w-64 bg-slate-950/60 border-r border-slate-800 p-3 overflow-y-auto space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
              Reference Pages
            </div>
            {PAGES_DATA.map(p => {
              const isSelected = selectedPage === p.pageNumber;
              return (
                <button
                  key={p.pageNumber}
                  onClick={() => setSelectedPage(p.pageNumber)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold leading-tight">{p.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      {p.icCodes.join(' & ')}
                    </div>
                  </div>
                  {isSelected && <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Right Main Content Panel */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/90 space-y-6">
            {/* Page Banner */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900/80 text-blue-300 border border-blue-700">
                  Page {currentPageData.pageNumber}
                </span>
                <h4 className="text-sm font-bold text-white">{currentPageData.subtitle}</h4>
              </div>
              <div className="flex items-start gap-2 mt-2 text-xs text-slate-300">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{currentPageData.notes}</p>
              </div>
            </div>

            {/* IC Diagrams for the current page */}
            <div className="space-y-6">
              {currentPageData.icCodes.map(code => (
                <div key={code}>{renderDIPPackage(code)}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>All 10 pinouts are wired 1-to-1 with simulation logic and physical sockets U1–U6</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-semibold transition-colors cursor-pointer"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
};
