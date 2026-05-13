// @ts-reference types="../types/global"
import { useStore } from '../store/useStore';
import { Smartphone, Layers, AlertTriangle, ExternalLink } from 'lucide-react';

export default function SettingsTab() {
  const { isFloatingMode, setFloatingMode } = useStore();

  return (
    <div className="p-6 flex flex-col h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-8 text-[#E0E0E0] uppercase tracking-wider border-b border-[#262626] pb-4">Settings</h2>

      <div className="space-y-8">
        {/* Device Simulation Info */}
        <section>
          <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-3 px-1">Device Connected</h3>
          <div className="bg-[#151517] border border-[#262626] rounded-xl overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-[#262626]">
              <div className="w-10 h-10 rounded-lg bg-[#1A1A1C] border border-[#333] flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-[#A0A0A0]" />
              </div>
              <div>
                <div className="font-bold text-[#E0E0E0] text-sm">iQOO Neo 10 Pro+</div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]"></div>
                  <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider font-bold">Status: Online</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#0D0D0F] flex gap-6 text-[10px] font-mono text-[#666666] uppercase tracking-widest">
               <div>ADB: <span className="text-[#A0A0A0]">OK</span></div>
               <div>ROOT: <span className="text-[#A0A0A0]">GRANTED</span></div>
               <div>LAT: 12ms</div>
            </div>
          </div>
        </section>

        {/* Display Settings */}
        <section>
           <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-3 px-1">Display</h3>
           <div className="bg-[#151517] border border-[#262626] rounded-xl divide-y divide-[#262626]">
             <div className="p-4 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <Layers className="w-5 h-5 text-[#A0A0A0]" />
                  <div>
                    <div className="font-bold text-[#E0E0E0] text-xs uppercase tracking-wider">Floating Pad</div>
                    <div className="text-[10px] text-[#666666] mt-0.5 font-mono">Control tools over other apps</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                     setFloatingMode(true);
                     if (window.AndroidNative) {
                        window.AndroidNative.showFloatingWindow();
                     }
                  }}
                  className="px-3 py-1.5 rounded bg-[#1A1A1C] hover:bg-[#262626] border border-[#333] text-[#3B82F6] text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  Enable
                </button>
             </div>
           </div>
           <p className="text-[10px] text-[#666666] px-2 mt-2 font-mono">
             Requires "Display over other apps" permission. 
           </p>
        </section>

        {/* Disclaimer */}
        <div className="mt-4 p-4 bg-[#151517] border border-[#262626] rounded-xl flex gap-3 text-xs text-[#A0A0A0] leading-relaxed">
           <AlertTriangle className="w-4 h-4 shrink-0 text-[#666666] mt-0.5" />
           <p>This web dashboard controls the iMock Background Service. For simulated touch and mock location to apply system-wide, the companion APK must be running on your device.</p>
        </div>
      </div>
    </div>
  );
}
