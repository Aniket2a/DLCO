import React from 'react';
import { SocketState } from '../types';
import { IC_DEFINITIONS } from '../engine/icLibrary';

interface SocketGridProps {
  sockets: Record<string, SocketState>;
  socketPower: Record<string, boolean>;
  selectedTerminal: string | null;
  onTerminalClick: (tid: string) => void;
  connectedTerminals: Set<string>;
  onOpenIcSelector: (sockId: string) => void;
  onEjectIc: (sockId: string) => void;
}

export const SocketGrid: React.FC<SocketGridProps> = ({
  sockets,
  socketPower,
  selectedTerminal,
  onTerminalClick,
  connectedTerminals,
  onOpenIcSelector,
  onEjectIc,
}) => {
  const socketIds = ['U1', 'U2', 'U3', 'U4', 'U5', 'U6'];

  const getPinFnClass = (type: string) => {
    switch (type) {
      case 'in':
        return 'bg-blue-100 text-blue-800';
      case 'out':
        return 'bg-amber-100 text-amber-900 font-black';
      case 'vcc':
        return 'bg-red-100 text-red-800 font-black';
      case 'gnd':
        return 'bg-emerald-100 text-emerald-800 font-black';
      case 'clk':
        return 'bg-yellow-100 text-yellow-900 font-black';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-slate-200 border border-slate-300 rounded-md p-3 shadow-inner">
      <div className="grid grid-cols-6 gap-2.5">
        {socketIds.map(sockId => {
          const sock = sockets[sockId];
          const icCode = sock?.ic;
          const icDef = icCode ? IC_DEFINITIONS[icCode] : null;
          const maxPins = icDef ? icDef.pins : sockId === 'U6' ? 24 : 16;
          const half = maxPins / 2;
          const isPowered = socketPower[sockId] || false;

          const leftPins: number[] = [];
          for (let p = 1; p <= half; p++) leftPins.push(p);

          const rightPins: number[] = [];
          for (let p = maxPins; p > half; p--) rightPins.push(p);

          return (
            <div
              key={sockId}
              className="bg-slate-50 border border-slate-400 rounded-md p-2 flex flex-col items-center shadow-xs"
            >
              {/* Socket Header */}
              <div className="w-full flex items-center justify-between border-b border-slate-300 pb-1 mb-1.5">
                <span className="text-[11px] font-black text-slate-800">{sockId}</span>
                {icCode ? (
                  <div className="flex items-center gap-1">
                    {sock?.ic === '7476' && (sock?.icState?.ff1?.unstable || sock?.icState?.ff2?.unstable) && (
                      <span
                        className="text-[7.5px] font-black px-1 py-0.5 rounded bg-amber-400 text-amber-950 animate-pulse border border-amber-600 shadow-xs"
                        title="Unstable State: PRE=0 and CLR=0 are both active-LOW (0) simultaneously"
                      >
                        ⚠ UNSTABLE
                      </span>
                    )}
                    <span
                      className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                        isPowered ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isPowered ? '⚡ POWERED' : '⚠ NO POWER'}
                    </span>
                  </div>
                ) : (
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-500">
                    EMPTY
                  </span>
                )}
              </div>

              {/* Socket Body with Pin Columns and Center ZIF */}
              <div className="w-full flex items-stretch justify-between gap-1">
                {/* Left Pin Column (Pins 1 to half) */}
                <div className="flex flex-col justify-between gap-1">
                  {leftPins.map(p => {
                    const tid = `${sockId}:p${p}`;
                    const pinInfo = icDef?.pinout[p];
                    const fnName = pinInfo?.name || '—';
                    const fnType = pinInfo?.type || 'nc';
                    const isSelected = selectedTerminal === tid;
                    const isConnected = connectedTerminals.has(tid);

                    let jackClass = 'terminal-jack';
                    if (isSelected) jackClass += ' selected';
                    if (isConnected) jackClass += ' connected';

                    return (
                      <div key={p} className="flex items-center gap-1 h-[19px]">
                        <span className="text-[8px] font-bold text-slate-500 w-3 text-center">{p}</span>
                        <div
                          className={jackClass}
                          data-tid={tid}
                          onClick={() => onTerminalClick(tid)}
                          title={`${sockId} Pin ${p}: ${fnName} ${pinInfo?.desc ? `(${pinInfo.desc})` : ''}`}
                        />
                        <span
                          className={`text-[7.5px] px-1 rounded min-w-[22px] text-center font-bold tracking-tight whitespace-nowrap ${getPinFnClass(
                            fnType
                          )}`}
                        >
                          {fnName}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Center ZIF Socket Body */}
                <div
                  className={`flex-1 rounded border-2 border-emerald-950 relative flex flex-col items-center justify-center min-h-[225px] shadow-inner transition-colors ${
                    icCode ? 'bg-emerald-800 cursor-default' : 'bg-emerald-700 hover:border-amber-500 cursor-pointer'
                  }`}
                  onClick={() => !icCode && onOpenIcSelector(sockId)}
                >
                  {/* Socket Notch when empty */}
                  <div className="absolute top-0 w-3.5 h-1.5 bg-emerald-950/80 border-b border-x border-emerald-950 rounded-b-full pointer-events-none" />
                  <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-emerald-950/60 pointer-events-none" title="Pin 1 Index Position" />

                  {/* ZIF Lever */}
                  <div
                    className={`absolute top-1 -left-1.5 w-1 h-7 rounded shadow transition-transform ${
                      icCode ? 'bg-slate-300 rotate-0' : 'bg-slate-400 -rotate-12'
                    }`}
                  >
                    <div className="absolute -top-1 -left-0.5 w-2 h-2 rounded-full bg-slate-700 border border-slate-400" />
                  </div>

                  {icCode ? (
                    <div className="w-[88%] h-[88%] bg-slate-900 border border-black rounded flex flex-col items-center justify-center relative shadow-lg p-1.5 text-center">
                      {/* Standard DIP IC Top Notch */}
                      <div className="absolute -top-1 w-3 h-1.5 bg-emerald-800 border-b border-x border-black rounded-b-full shadow-xs" />
                      {/* Standard DIP Pin-1 Index Dot (top-left beside Pin 1) */}
                      <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-600 border border-slate-500 shadow-inner" title="Pin 1 Index Dot" />
                      <span className="text-[11px] font-black text-slate-100 tracking-wider mt-1">{icCode}</span>
                      <span className="text-[8px] font-bold text-slate-400 leading-tight mt-0.5">
                        {icDef?.name.split(' ')[1] || 'IC'}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onEjectIc(sockId);
                        }}
                        className="mt-2.5 text-[8px] font-black px-1.5 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white border border-red-500 cursor-pointer shadow-xs"
                        title="Remove this IC and disconnect its wires"
                      >
                        Eject
                      </button>
                    </div>
                  ) : (
                    <div className="text-[9px] font-bold text-emerald-100 text-center p-2 leading-tight">
                      <span className="text-base block mb-0.5">＋</span>
                      Click to Insert IC
                    </div>
                  )}
                </div>

                {/* Right Pin Column (Pins max down to half+1) */}
                <div className="flex flex-col justify-between gap-1">
                  {rightPins.map(p => {
                    const tid = `${sockId}:p${p}`;
                    const pinInfo = icDef?.pinout[p];
                    const fnName = pinInfo?.name || '—';
                    const fnType = pinInfo?.type || 'nc';
                    const isSelected = selectedTerminal === tid;
                    const isConnected = connectedTerminals.has(tid);

                    let jackClass = 'terminal-jack';
                    if (isSelected) jackClass += ' selected';
                    if (isConnected) jackClass += ' connected';

                    return (
                      <div key={p} className="flex flex-row-reverse items-center gap-1 h-[19px]">
                        <span className="text-[8px] font-bold text-slate-500 w-3 text-center">{p}</span>
                        <div
                          className={jackClass}
                          data-tid={tid}
                          onClick={() => onTerminalClick(tid)}
                          title={`${sockId} Pin ${p}: ${fnName} ${pinInfo?.desc ? `(${pinInfo.desc})` : ''}`}
                        />
                        <span
                          className={`text-[7.5px] px-1 rounded min-w-[22px] text-center font-bold tracking-tight whitespace-nowrap ${getPinFnClass(
                            fnType
                          )}`}
                        >
                          {fnName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
