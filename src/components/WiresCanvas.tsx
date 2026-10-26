import React, { useEffect, useState, useCallback } from 'react';
import { Wire } from '../types';

interface WiresCanvasProps {
  wires: Wire[];
  selectedWireId: number | null;
  onSelectWire: (wireId: number) => void;
  boardRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
}

interface WirePathData {
  id: number;
  d: string;
  color: string;
}

export const WiresCanvas: React.FC<WiresCanvasProps> = ({
  wires,
  selectedWireId,
  onSelectWire,
  boardRef,
  zoom,
}) => {
  const [wirePaths, setWirePaths] = useState<WirePathData[]>([]);

  const computePaths = useCallback(() => {
    if (!boardRef.current) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const currentZoom = zoom || 1.0;

    const paths: WirePathData[] = [];

    wires.forEach(w => {
      const elA = document.querySelector(`[data-tid="${w.from}"]`);
      const elB = document.querySelector(`[data-tid="${w.to}"]`);

      if (!elA || !elB) return;

      const rectA = elA.getBoundingClientRect();
      const rectB = elB.getBoundingClientRect();

      const x1 = (rectA.left + rectA.width / 2 - boardRect.left) / currentZoom;
      const y1 = (rectA.top + rectA.height / 2 - boardRect.top) / currentZoom;

      const x2 = (rectB.left + rectB.width / 2 - boardRect.left) / currentZoom;
      const y2 = (rectB.top + rectB.height / 2 - boardRect.top) / currentZoom;

      // Natural catenary bezier curve
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const sag = Math.min(80, Math.max(30, dist * 0.15));
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2 + sag;

      const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;

      paths.push({
        id: w.id,
        d,
        color: w.color || '#2563eb',
      });
    });

    setWirePaths(paths);
  }, [wires, zoom, boardRef]);

  useEffect(() => {
    computePaths();

    // Recompute on window resize
    window.addEventListener('resize', computePaths);

    // Recompute on board resize using ResizeObserver
    let resizeObserver: ResizeObserver | null = null;
    if (boardRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        computePaths();
      });
      resizeObserver.observe(boardRef.current);
    }

    return () => {
      window.removeEventListener('resize', computePaths);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [computePaths, boardRef]);

  return (
    <svg className="wires-canvas" style={{ pointerEvents: 'none' }}>
      {wirePaths.map(w => {
        const isSelected = w.id === selectedWireId;

        const handleSelect = (e: React.MouseEvent | React.TouchEvent) => {
          e.stopPropagation();
          onSelectWire(w.id);
        };

        return (
          <g key={w.id} className="wire-group">
            {/* Transparent wide hit-testing path (24px) for effortless, accurate clicking/tapping */}
            <path
              d={w.d}
              stroke="transparent"
              strokeWidth={24}
              fill="none"
              style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
              onClick={handleSelect}
              onTouchEnd={handleSelect}
            />

            {/* Glowing selection halo when selected */}
            {isSelected && (
              <path
                d={w.d}
                stroke="#facc15"
                strokeWidth={9}
                strokeOpacity={0.65}
                fill="none"
                style={{ pointerEvents: 'none' }}
                filter="drop-shadow(0 0 6px #facc15)"
              />
            )}

            {/* Visible wire path */}
            <path
              d={w.d}
              stroke={isSelected ? '#facc15' : w.color}
              strokeWidth={isSelected ? 6 : 4}
              strokeDasharray={isSelected ? '6 3' : 'none'}
              fill="none"
              className={`wire-path ${isSelected ? 'selected' : ''}`}
              style={{ pointerEvents: 'none' }}
            />
          </g>
        );
      })}
    </svg>
  );
};
