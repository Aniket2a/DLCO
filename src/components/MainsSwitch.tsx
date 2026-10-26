import React from 'react';

interface MainsSwitchProps {
  mainsPower: boolean;
  onTogglePower: () => void;
}

export const MainsSwitch: React.FC<MainsSwitchProps> = ({ mainsPower, onTogglePower }) => {
  return (
    <div className="bg-slate-50 border border-slate-300 rounded p-2 shadow-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-md border-2 border-slate-700 text-white shadow-inner">
        <div className="flex justify-between w-12 text-[9px] font-extrabold">
          <span className={mainsPower ? 'text-red-500' : 'text-slate-500'}>ON</span>
          <span className={!mainsPower ? 'text-slate-300' : 'text-slate-600'}>OFF</span>
        </div>

        <div
          onClick={onTogglePower}
          className={`rocker-switch ${mainsPower ? 'on' : 'off'}`}
          title="Toggle Main Trainer Power (Mains Switch)"
        >
          <div className="rocker-handle" />
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <div className={`lamp lamp-power ${mainsPower ? 'on' : ''}`} />
          <span className="text-[9px] font-extrabold tracking-wider">POWER</span>
        </div>
      </div>
    </div>
  );
};
