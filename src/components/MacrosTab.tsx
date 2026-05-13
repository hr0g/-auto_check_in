// @ts-reference types="../types/global"
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Play, Square, CircleDot, Clock, MoreVertical, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function MacrosTab() {
  const { macros, addMacro, removeMacro, activeMacroId, setActiveMacro } = useStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [newMacroName, setNewMacroName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Simulation handlers
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // In reality, this communicates with the Android Service via intent/broadcast
  };

  const stopRecording = () => {
    setIsRecording(false);
    setShowSaveDialog(true);
  };

  const saveRecording = () => {
    if (!newMacroName.trim()) return;
    addMacro({
      id: Math.random().toString(36).substring(2, 9),
      name: newMacroName,
      description: 'Recorded touch sequence',
      durationMs: (recordingTime || 5) * 1000,
      savedAt: Date.now()
    });
    setShowSaveDialog(false);
    setNewMacroName('');
  };

  const togglePlayback = (id: string, durationMs: number) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      setActiveMacro(id);
      
      const macroToPlay = macros.find(m => m.id === id);
      
      // Send macro sequence to Android Native Service
      if (window.AndroidNative && macroToPlay) {
          window.AndroidNative.executeMacro(JSON.stringify(macroToPlay));
      } else {
          console.log(`Simulating Macro [${id}] playback in web.`);
      }

      // Simulate playback finishing
      setTimeout(() => {
        setPlayingId(current => current === id ? null : current);
      }, durationMs);
    }
  };

  return (
    <div className="p-6 flex flex-col h-full overflow-y-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#E0E0E0] uppercase tracking-wider">Touch Macros</h2>
          <p className="text-xs text-[#A0A0A0] mt-1 font-mono">Record and replay screen interactions</p>
        </div>
      </div>

      {/* Record Widget */}
      <div className="bg-[#151517] border border-[#262626] rounded-2xl p-5 mb-8 flex flex-col items-center justify-center relative overflow-hidden">
        {isRecording && <div className="absolute inset-0 bg-[#EF4444]/5 animate-pulse" />}
        
        <div className="relative z-10 flex flex-col items-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]",
              isRecording 
                ? "bg-[#1A1A1C] border-4 border-[#EF4444]/50 hover:border-[#EF4444] scale-95" 
                : "bg-[#EF4444] hover:bg-red-500 border-4 border-[#EF4444]/20 hover:border-[#EF4444]/40"
            )}
          >
            {isRecording ? <Square className="w-8 h-8 fill-[#EF4444] text-[#EF4444]" /> : <CircleDot className="w-10 h-10 text-white" />}
          </button>
          
          <div className="mt-4 font-mono text-lg font-medium tracking-widest text-[#E0E0E0]">
            {isRecording ? "REC 00:05" : "READY"}
          </div>
          <div className="text-xs text-[#666666] mt-1 uppercase tracking-wider">
            {isRecording ? "Tap to stop recording" : "Tap to record sequence"}
          </div>
        </div>
      </div>

      {/* Save Dialog inline */}
      {showSaveDialog && (
        <div className="bg-[#151517] border border-[#3B82F6]/50 rounded-2xl p-5 mb-8 animate-in slide-in-from-bottom-4 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#E0E0E0] mb-4">Save Recording</h3>
          <input
            type="text"
            placeholder="Macro Name (e.g. Daily Check-in)"
            value={newMacroName}
            onChange={(e) => setNewMacroName(e.target.value)}
            className="w-full bg-[#0D0D0F] border border-[#333] rounded-lg px-4 py-3 text-xs text-[#E0E0E0] mb-4 focus:border-[#3B82F6] focus:outline-none placeholder:text-[#666666]"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowSaveDialog(false)}
              className="flex-1 py-3 bg-[#1A1A1C] text-[#E0E0E0] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#262626] hover:bg-[#262626]"
            >
              Discard
            </button>
            <button
              onClick={saveRecording}
              disabled={!newMacroName.trim()}
              className="flex-1 py-3 bg-[#3B82F6] text-white text-xs font-bold uppercase tracking-wider rounded-lg disabled:opacity-50 hover:brightness-110"
            >
              Save Macro
            </button>
          </div>
        </div>
      )}

      {/* Saved Macros List */}
      <h3 className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-4 border-b border-[#262626] pb-2">Saved Sequences</h3>
      
      <div className="space-y-3 flex-1 pb-10">
        {macros.length === 0 ? (
          <div className="text-center text-[#666666] py-10 text-xs uppercase tracking-wider font-mono">No macros recorded yet</div>
        ) : (
          macros.map((macro) => {
            const isPlaying = playingId === macro.id;
            
            return (
              <div key={macro.id} className="bg-[#151517] border border-[#262626] rounded-xl p-4 flex gap-4 items-center transition-all hover:border-[#333]">
                <button
                  onClick={() => togglePlayback(macro.id, macro.durationMs)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all",
                    isPlaying 
                      ? "bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/50 animate-pulse" 
                      : "bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20"
                  )}
                >
                  {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#E0E0E0] truncate text-sm">{macro.name}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-[#A0A0A0] flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {(macro.durationMs / 1000).toFixed(1)}s
                    </span>
                    <span className="text-[10px] text-[#666666] font-mono">
                      {format(macro.savedAt, 'MMM d')}
                    </span>
                  </div>
                </div>

                <div className="relative group">
                  <button onClick={() => removeMacro(macro.id)} className="p-2 text-[#666666] hover:text-[#EF4444] transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
