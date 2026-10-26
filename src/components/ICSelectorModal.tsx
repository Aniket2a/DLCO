import React from 'react';
import { X, Cpu } from 'lucide-react';
import { IC_DEFINITIONS } from '../engine/icLibrary';

interface ICSelectorModalProps {
  socketId: string;
  onSelectIc: (icCode: string) => void;
  onClose: () => void;
}

export const ICSelectorModal: React.FC<ICSelectorModalProps> = ({
  socketId,
  onSelectIc,
  onClose,
}) => {
  const icList = Object.keys(IC_DEFINITIONS);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-300">
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold">Insert IC into Socket {socketId}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          <p className="text-xs text-slate-600 mb-4">
            Select a TTL 74-Series digital logic IC to insert into this socket. Pin terminals and power rails will be configured according to manufacturer specifications:
          </p>

          <div className="grid grid-cols-2 gap-3">
            {icList.map(icCode => {
              const def = IC_DEFINITIONS[icCode];
              return (
                <div
                  key={icCode}
                  onClick={() => onSelectIc(icCode)}
                  className="bg-slate-50 border border-slate-300 rounded-md p-3 cursor-pointer hover:border-blue-600 hover:bg-blue-50/50 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      {icCode}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">{def.package}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mb-1">{def.name}</div>
                  <div className="text-[10px] text-slate-600 leading-normal mb-1.5">
                    VCC: Pin {def.vccPin}, GND: Pin {def.gndPin}.
                  </div>
                  <div className="text-[9px] font-mono text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                    Pins: {Object.values(def.pinout).slice(0, 4).map(p => p.name).join(', ')}...
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
