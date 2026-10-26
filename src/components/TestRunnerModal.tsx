import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Play, RotateCcw } from 'lucide-react';
import { runAllAutomatedTests, FullTestReport } from '../engine/testRunner';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose }) => {
  const [report, setReport] = useState<FullTestReport | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (isOpen && !report) {
      executeTests();
    }
  }, [isOpen]);

  const executeTests = () => {
    setRunning(true);
    setTimeout(() => {
      const rep = runAllAutomatedTests();
      setReport(rep);
      setRunning(false);
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-slate-300">
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold">Automated Circuit &amp; Practical Verification Suite</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Header Controls & Metrics */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Total Verified Tests</span>
              <span className="text-xl font-black text-slate-800">
                {report ? `${report.passed} / ${report.total}` : 'Running...'}
              </span>
            </div>

            {report && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Pass Rate</span>
                  <span className="text-base font-black text-emerald-600">
                    {((report.passed / report.total) * 100).toFixed(1)}%
                  </span>
                </div>
                <button
                  onClick={executeTests}
                  disabled={running}
                  className="px-3 py-1.5 text-xs font-bold rounded bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-Run All</span>
                </button>
              </div>
            )}
          </div>

          {/* Test Groups and Items */}
          {report && (
            <div className="space-y-3">
              {Object.entries(
                report.results.reduce((acc, curr) => {
                  if (!acc[curr.group]) acc[curr.group] = [];
                  acc[curr.group].push(curr);
                  return acc;
                }, {} as Record<string, typeof report.results>)
              ).map(([groupName, items]) => (
                <div key={groupName} className="border border-slate-200 rounded overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-800 border-b border-slate-200 flex justify-between">
                    <span>{groupName}</span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {items.filter(i => i.passed).length}/{items.length} Passed
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 bg-white">
                    {items.map((item, idx) => (
                      <div key={idx} className="p-2.5 flex items-start gap-2.5 text-xs hover:bg-slate-50/50">
                        {item.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <span className={`font-semibold ${item.passed ? 'text-slate-800' : 'text-red-700'}`}>
                            {item.name}
                          </span>
                          {item.message && (
                            <span className="block text-[10px] text-slate-500 mt-0.5 font-mono">
                              ↳ {item.message}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
