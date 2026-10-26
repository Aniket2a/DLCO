import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { EXPERIMENTS } from '../engine/experiments';

interface ExperimentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedExpKey: string;
  onSelectExp: (key: string) => void;
  onSetupIcs: (expKey: string) => void;
  onAutoWire: (expKey: string) => void;
  onVerifyCircuit: (expKey: string) => void;
  verificationResult: { pass: boolean; msg: string } | null;
}

export const ExperimentDrawer: React.FC<ExperimentDrawerProps> = ({
  isOpen,
  onClose,
  selectedExpKey,
  onSelectExp,
  onSetupIcs,
  onAutoWire,
  onVerifyCircuit,
  verificationResult,
}) => {
  const [practiceMode, setPracticeMode] = useState<'guided' | 'free'>('guided');

  if (!isOpen) return null;

  const currentExp = EXPERIMENTS[selectedExpKey] || EXPERIMENTS['exam1'];

  const examExpKeys = Object.keys(EXPERIMENTS).filter(k => EXPERIMENTS[k].category === 'exam');
  const additionalExpKeys = Object.keys(EXPERIMENTS).filter(k => EXPERIMENTS[k].category === 'additional');

  return (
    <div className="fixed inset-y-0 right-0 w-[580px] bg-white shadow-2xl z-50 flex flex-col border-l-2 border-slate-700 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-700">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            DLCO Practical Examination & Viva Guide
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Curriculum practicals, wiring schematics, truth tables, and viva questions
          </p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Practice Mode Selector */}
        <div className="bg-slate-100 border border-slate-300 rounded-md p-2.5 mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800">Practice Mode:</span>
            <span className="text-[10px] text-slate-500">
              {practiceMode === 'guided'
                ? 'Showing full wiring instructions & auto-wire reference.'
                : 'Free wiring mode: complete answer hidden for independent exam practice.'}
            </span>
          </div>
          <div className="flex bg-slate-200 p-0.5 rounded border border-slate-300">
            <button
              onClick={() => setPracticeMode('guided')}
              className={`text-xs font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                practiceMode === 'guided' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              🎓 Guided
            </button>
            <button
              onClick={() => setPracticeMode('free')}
              className={`text-xs font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                practiceMode === 'free' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              🛠️ Free Practice
            </button>
          </div>
        </div>

        {/* Practical Dropdown */}
        <div className="bg-slate-50 border border-slate-300 rounded-md p-3 mb-4">
          <label htmlFor="expSelect" className="block text-xs font-bold text-slate-800 mb-1.5">
            Select Practical / Experiment:
          </label>
          <select
            id="expSelect"
            value={selectedExpKey}
            onChange={e => onSelectExp(e.target.value)}
            className="w-full text-xs font-semibold p-2 border border-slate-400 rounded bg-white text-slate-900 mb-2.5 focus:outline-none"
          >
            <optgroup label="🌟 11 Official DLCO Exam Practicals">
              {examExpKeys.map(k => (
                <option key={k} value={k}>
                  {EXPERIMENTS[k].title}
                </option>
              ))}
            </optgroup>
            <optgroup label="📖 Additional Curriculum Practicals">
              {additionalExpKeys.map(k => (
                <option key={k} value={k}>
                  {EXPERIMENTS[k].title}
                </option>
              ))}
            </optgroup>
          </select>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSetupIcs(selectedExpKey)}
              className="text-xs font-bold px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Insert required ICs into sockets for this practical"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Setup ICs For This Lab</span>
            </button>

            {practiceMode === 'guided' && (
              <button
                onClick={() => onAutoWire(selectedExpKey)}
                className="text-xs font-bold px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-800 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Load complete verified reference wiring onto the board"
              >
                <span>🔌 Auto-Wire Reference Circuit</span>
              </button>
            )}

            <button
              onClick={() => onVerifyCircuit(selectedExpKey)}
              className="text-xs font-bold px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Verify current circuit wiring and truth table"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Check My Wiring & Truth Table</span>
            </button>
          </div>
        </div>

        {/* Verification Result Banner */}
        {verificationResult && (
          <div
            className={`p-3 rounded-md mb-4 text-xs font-medium border flex items-start gap-2 ${
              verificationResult.pass
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-red-50 text-red-800 border-red-300'
            }`}
          >
            {verificationResult.pass ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="block mb-0.5">
                {verificationResult.pass ? '✓ TEST PASSED' : '⚠ VERIFICATION FAILED'}
              </strong>
              {verificationResult.msg}
            </div>
          </div>
        )}

        {/* Experiment Documentation */}
        <div className="space-y-4">
          {/* Aim */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-200 pb-1 mb-1.5">
              1. Aim
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">{currentExp.aim}</p>
          </div>

          {/* Required Components */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-200 pb-1 mb-1.5">
              2. Components &amp; ICs Required
            </h3>
            <div className="text-xs text-slate-700 space-y-1">
              <p>
                <strong>Required ICs:</strong> {currentExp.requiredIcs.join(', ')}
              </p>
              <p>
                <strong>Inputs:</strong> {currentExp.inputsDesc}
              </p>
              <p>
                <strong>Outputs:</strong> {currentExp.outputsDesc}
              </p>
            </div>
          </div>

          {/* Wiring Guide (Visible in Guided Mode, summarized in Free Mode) */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-200 pb-1 mb-1.5">
              3. Circuit Connection Guide
            </h3>
            {practiceMode === 'guided' ? (
              <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1.5">
                {currentExp.instructions.map((inst, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {inst}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded text-xs leading-relaxed">
                <strong>Free Practice Mode:</strong> Step-by-step pin connections are hidden so you can test your knowledge independently. Refer to your lab schematic or switch to Guided Mode to review the full wiring guide.
              </div>
            )}
          </div>

          {/* Expected Truth Table / State Sequence */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-200 pb-1 mb-1.5">
              4. Expected Truth Table / State Sequence
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    {Object.keys(currentExp.truthTable[0] || {}).map(header => (
                      <th key={header} className="p-1.5 font-bold text-slate-800 border-r border-slate-200 last:border-r-0">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentExp.truthTable.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="p-1.5 text-slate-700 border-r border-slate-200 last:border-r-0 font-mono">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lab Viva Voce Questions & Answers */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-200 pb-1 mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>5. Lab Exam Viva Voce Questions &amp; Answers</span>
            </h3>
            <div className="space-y-2">
              {currentExp.viva.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border-l-4 border-blue-600 p-2.5 rounded-r text-xs">
                  <div className="font-bold text-slate-900 mb-1">Q: {item.q}</div>
                  <div className="text-slate-700 leading-relaxed">A: {item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
