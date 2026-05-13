/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Map, MapPin, PlaySquare, CalendarClock, Settings, Smartphone } from 'lucide-react';
import { cn } from './lib/utils';
import { useStore } from './store/useStore';
import MapTab from './components/MapTab';
import MacrosTab from './components/MacrosTab';
import TasksTab from './components/TasksTab';
import SettingsTab from './components/SettingsTab';
import FloatingWidget from './components/FloatingWidget';

type Tab = 'map' | 'macros' | 'tasks' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('map');
  const { isFloatingMode } = useStore();

  const tabs = [
    { id: 'map', label: 'Location', icon: MapPin },
    { id: 'macros', label: 'Macros', icon: PlaySquare },
    { id: 'tasks', label: 'Schedule', icon: CalendarClock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  if (isFloatingMode) {
    return <FloatingWidget />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0B] text-[#E0E0E0] font-sans overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#0D0D0F] z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <h1 className="font-bold tracking-tight text-lg uppercase">
            iMock <span className="text-[#3B82F6] text-xs font-mono uppercase px-1">PRO</span>
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[#0A0A0B]">
        {activeTab === 'map' && <MapTab />}
        {activeTab === 'macros' && <MacrosTab />}
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex items-center justify-around p-3 pb-safe bg-[#0D0D0F] border-t border-[#262626] z-10">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[64px]",
              activeTab === id 
                ? "text-[#3B82F6]" 
                : "text-[#666666] hover:text-[#A0A0A0]"
            )}
          >
            <Icon className={cn("w-6 h-6", activeTab === id ? "opacity-100" : "opacity-70")} />
            <span className="text-[10px] font-bold tracking-wide uppercase">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

