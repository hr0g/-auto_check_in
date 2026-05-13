// @ts-reference types="../types/global"
import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useStore } from '../store/useStore';
import { Crosshair, Save, Send, Clock, List, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

// Fix typical Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for user selected point
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/2.0.2/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapTab() {
  const { locations, addLocation, activeLocationId, setActiveLocation } = useStore();
  const [selectedPos, setSelectedPos] = useState<{lat: number, lng: number} | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationHours, setSimulationHours] = useState(1);

  const activeLocation = locations.find(l => l.id === activeLocationId);

  const handleSaveLocation = () => {
    if (!selectedPos || !newLocName.trim()) return;
    addLocation({
      id: Math.random().toString(36).substr(2, 9),
      name: newLocName,
      lat: selectedPos.lat,
      lng: selectedPos.lng,
      savedAt: Date.now()
    });
    setNewLocName('');
    setSelectedPos(null);
  };

  const handleStartSimulation = () => {
    if (!activeLocationId) return;
    setIsSimulating(true);
    
    // Call Native Android Engine if running in App
    if (window.AndroidNative && activeLocation) {
        window.AndroidNative.startMockLocation(activeLocation.lat, activeLocation.lng);
    } else {
        console.log("Mocking started in browser environment.");
    }
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
    
    // Stop Native Android Engine
    if (window.AndroidNative) {
        window.AndroidNative.stopMockLocation();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Map Area */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={activeLocation ? [activeLocation.lat, activeLocation.lng] : [30.2674, 120.0243]} 
          zoom={13} 
          className="w-full h-full font-sans filter invert hue-rotate-180 brightness-90 contrast-80" // Dark mode effect for tiles
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onLocationSelect={(lat, lng) => setSelectedPos({ lat, lng })} />
          
          {selectedPos && (
            <Marker position={[selectedPos.lat, selectedPos.lng]} icon={customIcon} />
          )}
          {activeLocation && !selectedPos && (
            <Marker position={[activeLocation.lat, activeLocation.lng]} icon={customIcon} />
          )}
        </MapContainer>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
          <button 
            onClick={() => setShowDrawer(true)}
            className="w-12 h-12 bg-[#1A1A1C]/90 backdrop-blur-md rounded-full flex items-center justify-center border border-[#333] shadow-lg text-[#E0E0E0] active:scale-95 transition-transform"
          >
            <List className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bg-[#0D0D0F] border-t border-[#262626] rounded-t-2xl px-6 py-6 pb-8 z-10 flex flex-col gap-4 -mt-4 relative shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        {isSimulating ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#3B82F6] text-[10px] uppercase font-bold tracking-wider flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
                  SPOOFING ACTIVE
                </div>
                <h3 className="text-lg font-bold text-[#E0E0E0] truncate max-w-[200px]">
                  {activeLocation?.name || 'Selected Point'}
                </h3>
              </div>
              <div className="text-right text-[#A0A0A0]">
                <div className="text-[10px] uppercase tracking-widest font-bold">Expires in</div>
                <div className="text-lg font-mono text-[#E0E0E0]">
                  {simulationHours}h 00m
                </div>
              </div>
            </div>
            <button 
              onClick={handleStopSimulation}
              className="w-full py-3 bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold uppercase tracking-wider rounded-xl border border-[#EF4444]/20 active:bg-[#EF4444]/20 transition-colors"
            >
              Stop Simulation
            </button>
          </div>
        ) : (
          <>
            {selectedPos && !showDrawer ? (
              <div className="flex flex-col gap-4 animate-in slide-in-from-bottom flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#E0E0E0]">Location Selected</h3>
                    <p className="text-[10px] text-[#A0A0A0] font-mono mt-1">
                      LAT: {selectedPos.lat.toFixed(6)}<br/>LNG: {selectedPos.lng.toFixed(6)}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedPos(null)}
                    className="text-[#666666] text-xs uppercase font-bold tracking-wider p-2 hover:text-[#E0E0E0]"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Location Name"
                    value={newLocName}
                    onChange={(e) => setNewLocName(e.target.value)}
                    className="flex-1 bg-[#1A1A1C] border border-[#333] rounded-lg px-4 py-3 text-xs text-[#E0E0E0] placeholder:text-[#666666] focus:outline-none focus:border-[#3B82F6]"
                  />
                  <button 
                    onClick={handleSaveLocation}
                    disabled={!newLocName.trim()}
                    className="bg-[#1A1A1C] border border-[#333] text-[#E0E0E0] px-4 py-3 rounded-lg flex items-center justify-center disabled:opacity-50 hover:bg-[#262626]"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => {
                    const id = Math.random().toString(36).substr(2, 9);
                    addLocation({
                      id,
                      name: newLocName || 'Temporary Point',
                      lat: selectedPos.lat,
                      lng: selectedPos.lng,
                      savedAt: Date.now()
                    });
                    setActiveLocation(id);
                    setSelectedPos(null);
                    setNewLocName('');
                  }}
                  className="w-full py-3 bg-[#3B82F6] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:brightness-110"
                >
                  <Send className="w-4 h-4" />
                  Apply Location
                </button>
              </div>
            ) : (
                <div className="flex flex-col gap-4">
                  <div>
                     <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Current Target</h3>
                     <div className="flex items-center gap-3 mt-2 p-3 bg-[#151517] border border-[#262626] rounded-xl">
                       <Crosshair className="w-5 h-5 text-[#3B82F6] shrink-0" />
                       <div className="flex-1 min-w-0">
                         <div className="text-[#E0E0E0] text-sm font-medium truncate">
                           {activeLocation?.name || 'No location selected'}
                         </div>
                         {activeLocation && (
                           <div className="text-[10px] text-[#A0A0A0] font-mono mt-0.5">
                             {activeLocation.lat.toFixed(4)}, {activeLocation.lng.toFixed(4)}
                           </div>
                         )}
                       </div>
                       <button onClick={() => setShowDrawer(true)} className="text-[10px] text-[#3B82F6] font-bold uppercase tracking-wider whitespace-nowrap px-3 py-1.5 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-md">
                         Change
                       </button>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 mt-1">
                    <Clock className="w-4 h-4 text-[#A0A0A0] shrink-0" />
                    <div className="flex-1 text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">Duration</div>
                    <select 
                      value={simulationHours}
                      onChange={(e) => setSimulationHours(Number(e.target.value))}
                      className="bg-[#1A1A1C] border border-[#333] text-[#E0E0E0] text-xs font-mono rounded-lg focus:outline-none focus:border-[#3B82F6] block p-2"
                    >
                      <option value={1}>1 hour</option>
                      <option value={4}>4 hours</option>
                      <option value={8}>8 hours</option>
                      <option value={24}>24 hours</option>
                    </select>
                  </div>

                  <button 
                    disabled={!activeLocationId}
                    onClick={handleStartSimulation}
                    className="w-full py-3 mt-2 bg-[#3B82F6] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.2)] disabled:opacity-50 disabled:bg-[#1A1A1C] disabled:text-[#666666] disabled:border disabled:border-[#333] disabled:shadow-none flex justify-center items-center gap-2 hover:brightness-110"
                  >
                    <Send className="w-4 h-4" />
                    Start Simulation
                  </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Locations Drawer (BottomSheet simulation) */}
      {showDrawer && (
        <div className="absolute inset-0 z-[500] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDrawer(false)} />
          <div className="bg-[#0D0D0F] border-t border-[#262626] rounded-t-3xl min-h-[50%] max-h-[80%] flex flex-col relative animate-in slide-in-from-bottom-full duration-200 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
            <div className="w-12 h-1 bg-[#333] rounded-full mx-auto my-3" />
            <div className="px-6 pb-4 border-b border-[#262626]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#E0E0E0]">Location Bookmarks</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pb-safe space-y-3">
              {locations.length === 0 ? (
                <div className="text-center text-[#666666] py-10 font-mono text-xs uppercase">No saved locations</div>
              ) : (
                locations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setActiveLocation(loc.id);
                      setSelectedPos(null);
                      setShowDrawer(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                      activeLocationId === loc.id 
                        ? "bg-[#3B82F6]/10 border-[#3B82F6]/50" 
                        : "bg-[#1A1A1C] border-transparent hover:border-[#333]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                        <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                        activeLocationId === loc.id ? "bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30" : "bg-[#151517] text-[#666666] border-[#333]"
                        )}>
                        <MapPin className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                        <div className="text-[#E0E0E0] text-sm font-medium truncate">{loc.name}</div>
                        <div className="text-[10px] text-[#A0A0A0] mt-0.5 font-mono">
                            {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                        </div>
                        </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
