import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { DiagnosticsReport } from '../types';

interface DiagnosticsModalProps {
  report: DiagnosticsReport;
  onClose: () => void;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({ report, onClose }) => {
  const renderItem = (item: { type: 'ok' | 'warn' | 'err' | 'info'; msg: string }, idx: number) => {
    let icon = <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />;
    let borderClass = 'border-l-emerald-600 bg-emerald-50/50';

    if (item.type === 'warn') {
      icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />;
      borderClass = 'border-l-amber-600 bg-amber-50/50';
    } else if (item.type === 'err') {
      icon = <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />;
      borderClass = 'border-l-red-600 bg-red-50/50';
    } else if (item.type === 'info') {
      icon = <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />;
      borderClass = 'border-l-slate-400 bg-slate-50';
    }

    return (
      <div
        key={idx}
        className={`p-2 rounded text-xs text-slate-700 border-l-3 border border-slate-200 flex items-start gap-2 ${borderClass}`}
      >
        {icon}
        <span className="leading-snug">{item.msg}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-300">
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center gap-2">
            🔍 Live Electrical Diagnostics &amp; Net Audit
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Summary Banner */}
          <div
            className={`p-3 rounded-md text-xs font-semibold border flex items-center gap-2 ${
              report.status === 'HEALTHY'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : report.status === 'CHECK'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-red-50 text-red-800 border-red-300'
            }`}
          >
            {report.status === 'HEALTHY' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : report.status === 'CHECK' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{report.summary}</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Power & Ground */}
            <div className="border border-slate-200 rounded p-3 bg-slate-50 flex flex-col">
              <h4 className="text-xs font-black text-slate-800 uppercase border-b border-slate-200 pb-1 mb-2">
                Power &amp; Ground Health
              </h4>
              <div className="space-y-1.5 flex-1 overflow-y-auto max-h-60 pr-1">
                {report.power.map((p, idx) => renderItem(p, idx))}
              </div>
            </div>

            {/* Signal Integrity */}
            <div className="border border-slate-200 rounded p-3 bg-slate-50 flex flex-col">
              <h4 className="text-xs font-black text-slate-800 uppercase border-b border-slate-200 pb-1 mb-2">
                Signal &amp; Pin Integrity
              </h4>
              <div className="space-y-1.5 flex-1 overflow-y-auto max-h-60 pr-1">
                {report.signal.map((s, idx) => renderItem(s, idx))}
              </div>
            </div>

            {/* Active Nets */}
            <div className="border border-slate-200 rounded p-3 bg-slate-50 flex flex-col">
              <h4 className="text-xs font-black text-slate-800 uppercase border-b border-slate-200 pb-1 mb-2">
                Active Nets &amp; Drivers
              </h4>
              <div className="space-y-1.5 flex-1 overflow-y-auto max-h-60 pr-1 font-mono text-[10px]">
                {report.nets.map((n, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-white border border-slate-200 text-slate-700">
                    {n.msg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
