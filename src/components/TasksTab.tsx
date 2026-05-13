import { useState } from 'react';
import { useStore, ScheduledTask } from '../store/useStore';
import { format } from 'date-fns';
import { Clock, Plus, MapPin, PlaySquare, Trash2, Power } from 'lucide-react';
import { cn } from '../lib/utils';

export default function TasksTab() {
  const { tasks, locations, macros, addTask, toggleTask, removeTask } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  
  // Form State
  const [taskName, setTaskName] = useState('');
  const [selectedLocId, setSelectedLocId] = useState('');
  const [selectedMacroId, setSelectedMacroId] = useState('');
  const [startTimeStr, setStartTimeStr] = useState('09:00');

  const handleCreate = () => {
    const today = new Date();
    const [hours, mins] = startTimeStr.split(':').map(Number);
    const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, mins).getTime();
    
    // Add 1 hour by default for effective time
    const endTime = startTime + (60 * 60 * 1000);

    const newTask: ScheduledTask = {
      id: Math.random().toString(36).substr(2,9),
      name: taskName || 'Automated Routine',
      locationId: selectedLocId,
      macroId: selectedMacroId,
      startTime,
      endTime,
      isActive: true
    };
    addTask(newTask);
    setShowCreate(false);
    resetForm();
  };

  const resetForm = () => {
    setTaskName('');
    setSelectedLocId('');
    setSelectedMacroId('');
    setStartTimeStr('09:00');
  };

  return (
    <div className="p-6 flex flex-col h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#E0E0E0] uppercase tracking-wider">Automation</h2>
          <p className="text-xs text-[#A0A0A0] mt-1 font-mono">Schedule location + macro routines</p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center hover:brightness-110 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
        >
          <Plus className={cn("w-5 h-5 text-white transition-transform", showCreate ? "rotate-45" : "")} />
        </button>
      </div>

      {showCreate && (
        <div className="bg-[#151517] border border-[#262626] rounded-2xl p-5 mb-8 animate-in slide-in-from-top-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#E0E0E0] mb-4">New Routine</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#666666] mb-2 block tracking-wider">Routine Name</label>
              <input 
                type="text"
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                placeholder="e.g. Morning Check-in"
                className="w-full bg-[#1A1A1C] border border-[#333] rounded-lg px-4 py-3 text-xs text-[#E0E0E0] focus:border-[#3B82F6] focus:outline-none placeholder:text-[#666666]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#666666] mb-2 block tracking-wider">Execution Time</label>
                <input 
                  type="time"
                  value={startTimeStr}
                  onChange={e => setStartTimeStr(e.target.value)}
                  className="w-full bg-[#1A1A1C] border border-[#333] rounded-lg px-4 py-3 text-xs font-mono text-[#E0E0E0] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#666666] mb-2 block tracking-wider">Virtual Location</label>
              <select 
                value={selectedLocId}
                onChange={e => setSelectedLocId(e.target.value)}
                className="w-full bg-[#1A1A1C] border border-[#333] rounded-lg px-4 py-3 text-xs text-[#E0E0E0] focus:border-[#3B82F6] focus:outline-none appearance-none"
              >
                <option value="">Select a location...</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#666666] mb-2 block tracking-wider">Macro Sequence (Optional)</label>
              <select
                value={selectedMacroId}
                onChange={e => setSelectedMacroId(e.target.value)}
                className="w-full bg-[#1A1A1C] border border-[#333] rounded-lg px-4 py-3 text-xs text-[#E0E0E0] focus:border-[#3B82F6] focus:outline-none appearance-none"
              >
                <option value="">None / Only Mock Location</option>
                {macros.map(mac => (
                  <option key={mac.id} value={mac.id}>{mac.name}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleCreate}
              disabled={!selectedLocId}
              className="w-full py-3 bg-[#3B82F6] text-white text-xs font-bold uppercase tracking-wider rounded-xl mt-4 disabled:opacity-50 hover:brightness-110"
            >
              Create Routine
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {tasks.length === 0 && !showCreate ? (
          <div className="text-center text-[#666666] py-10 mt-10">
            <div className="w-16 h-16 rounded-full bg-[#151517] border border-[#262626] mx-auto mb-4 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#A0A0A0]" />
            </div>
            <p className="mb-2 text-xs uppercase tracking-wider font-bold">No scheduled routines</p>
            <p className="text-[10px] font-mono">Automate your location & macros triggered by time.</p>
          </div>
        ) : (
          tasks.map(task => {
            const loc = locations.find(l => l.id === task.locationId);
            const mac = macros.find(m => m.id === task.macroId);

            return (
              <div key={task.id} className={cn(
                "bg-[#151517] border rounded-xl p-5 transition-all relative overflow-hidden flex flex-col gap-4",
                task.isActive ? "border-[#3B82F6]/30" : "border-[#262626] opacity-75 grayscale-[0.5]"
              )}>
                {task.isActive && <div className="absolute top-0 left-0 w-1 h-full bg-[#3B82F6]" />}
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#E0E0E0] text-sm uppercase tracking-wider">{task.name}</h3>
                    <div className="text-2xl font-mono font-bold tracking-wider mt-1 text-[#3B82F6]">
                      {format(task.startTime, 'HH:mm')}
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors border",
                      task.isActive ? "bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-[#1A1A1C] text-[#666666] border-[#333]"
                    )}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 bg-[#0D0D0F] p-3 rounded-lg border border-[#262626]">
                  <div className="flex items-center gap-3 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#A0A0A0] shrink-0" />
                    <span className="text-[#A0A0A0] font-medium truncate">{loc?.name || 'Unknown Location'}</span>
                  </div>
                  {mac && (
                    <div className="flex items-center gap-3 text-xs">
                      <PlaySquare className="w-3.5 h-3.5 text-[#A0A0A0] shrink-0" />
                      <span className="text-[#A0A0A0] font-medium truncate">{mac.name}</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-5 right-5">
                  <button onClick={() => removeTask(task.id)} className="p-2 text-[#666666] hover:text-[#EF4444] transition-colors rounded-lg hover:bg-[#1A1A1C]">
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
