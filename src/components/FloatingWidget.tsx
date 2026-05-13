import { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Send, Square, PlaySquare, LocateFixed, Expand, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function FloatingWidget() {
  const { activeLocationId, activeMacroId, locations, macros, setFloatingMode, addTask } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const activeLocation = locations.find(l => l.id === activeLocationId);
  const activeMacro = macros.find(m => m.id === activeMacroId);

  const toggleMock = () => {
    setIsPlaying(!isPlaying);
  };

  if (!expanded) {
    return (
      <div className="w-screen h-screen bg-transparent pointer-events-none fixed inset-0 z-[9999]">
        <motion.div 
          drag 
          dragMomentum={false}
          className="pointer-events-auto absolute top-20 right-4 flex"
        >
          <button 
            onClick={() => setExpanded(true)}
            className="w-14 h-14 bg-[#151517]/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.8)] border border-[#262626] active:scale-95 transition-transform group hover:border-[#333]"
          >
            {isPlaying ? (
              <div className="w-5 h-5 rounded-sm bg-[#3B82F6] animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
            ) : (
              <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png" className="w-6 opacity-60 group-hover:opacity-100 transition-opacity filter hue-rotate-180 brightness-150 grayscale-[0.5]" />
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-transparent pointer-events-none fixed inset-0 z-[9999]">
      <motion.div 
        drag 
        dragMomentum={false}
        className="pointer-events-auto absolute top-20 right-4 w-64 bg-[#0D0D0F]/95 backdrop-blur-xl border border-[#262626] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-5 flex flex-col gap-5"
      >
        <div className="flex justify-between items-center bg-[#151517] -mx-5 -mt-5 px-5 py-3 rounded-t-2xl border-b border-[#262626]">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <span className="text-[10px] font-bold text-[#E0E0E0] tracking-widest uppercase">GEOFLOW PRO</span>
           </div>
           <div className="flex gap-2">
              <button onClick={() => setFloatingMode(false)} className="w-6 h-6 rounded bg-[#1A1A1C] border border-[#333] text-[#A0A0A0] flex items-center justify-center hover:bg-[#262626]">
                 <Expand className="w-3 h-3" />
              </button>
              <button onClick={() => setExpanded(false)} className="w-6 h-6 rounded bg-[#1A1A1C] border border-[#333] text-[#A0A0A0] flex items-center justify-center hover:bg-[#262626] hover:text-[#EF4444] transition-colors">
                 <X className="w-3.5 h-3.5" />
              </button>
           </div>
        </div>

        <div className="space-y-3">
           <div className="bg-[#151517] rounded-xl border border-[#262626] p-3 flex gap-3 items-center hover:border-[#333] transition-colors">
             <LocateFixed className="w-4 h-4 text-[#3B82F6] shrink-0" />
             <div className="flex-1 min-w-0">
               <div className="text-[10px] uppercase font-bold tracking-wider text-[#666666]">Location</div>
               <div className="text-xs text-[#E0E0E0] font-medium truncate mt-0.5">{activeLocation?.name || 'Not set'}</div>
             </div>
           </div>

           <div className="bg-[#151517] rounded-xl border border-[#262626] p-3 flex gap-3 items-center hover:border-[#333] transition-colors">
             <PlaySquare className="w-4 h-4 text-[#A0A0A0] shrink-0" />
             <div className="flex-1 min-w-0">
               <div className="text-[10px] uppercase font-bold tracking-wider text-[#666666]">Macro</div>
               <div className="text-xs text-[#E0E0E0] font-medium truncate mt-0.5">{activeMacro?.name || 'Not set'}</div>
             </div>
           </div>
        </div>

        <button 
          onClick={toggleMock}
          className={cn(
            "w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all uppercase tracking-wider text-xs",
            isPlaying 
              ? "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/20"
              : "bg-[#3B82F6] text-white hover:brightness-110 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          )}
        >
          {isPlaying ? (
            <>
              <Square className="w-3.5 h-3.5 fill-[#EF4444]" />
              Stop Routine
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Start Routine
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
