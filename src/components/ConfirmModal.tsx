import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export type ConfirmType = 'clearBoard' | 'resetBoard';

interface ConfirmModalProps {
  type: ConfirmType;
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  type,
  isOpen,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold">
              {type === 'clearBoard' ? 'Clear Entire Board?' : 'Reset Entire Trainer Kit?'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
            title="Cancel (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          <div className="text-xs text-slate-700 leading-relaxed mb-4">
            <p className="mb-2 font-semibold text-slate-900">
              This will remove all user-created elements and clear the board:
            </p>
            <ul className="space-y-1 text-slate-600 mb-3 ml-1">
              <li className="flex items-center gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>All connected patch wires</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>All placed ICs and logic gates from sockets U1 to U6</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>All input switches reset to 0 (LOW)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Clock generator stopped and pulse counter reset</span>
              </li>
            </ul>
            <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
              <strong>Tip:</strong> Built-in experiment guides and library definitions are preserved. You can also restore your circuit using <strong>Undo (Ctrl+Z)</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-3.5 py-1.5 text-xs font-bold rounded text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors bg-red-600 hover:bg-red-700 border border-red-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Entire Board</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
