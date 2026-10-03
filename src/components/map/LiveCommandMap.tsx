import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useSevasData } from '../../context/SevasDataContext';
import { Vehicle } from '../../types';
import { ShieldAlert, Navigation, Eye, Maximize2, RotateCcw, AlertTriangle } from 'lucide-react';

interface LiveCommandMapProps {
  height?: string;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  showEmergencyBanner?: boolean;
}

export const LiveCommandMap: React.FC<LiveCommandMapProps> = ({
  height = '500px',
  onSelectVehicle,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const routesLayerRef = useRef<L.LayerGroup | null>(null);

  const {
    vehicles,
    activeEmergency,
    selectedVehicleId,
    setSelectedVehicleId,
    focusedMapCoords,
    setFocusedMapCoords,
    isSimulationActive,
    toggleSimulation,
  } = useSevasData();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Greater Cairo (Ring Road / New Cairo / Maadi)
    const initialLat = activeEmergency ? activeEmergency.coordinates.lat : 30.0150;
    const initialLng = activeEmergency ? activeEmergency.coordinates.lng : 31.4200;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      minZoom: 9,
      maxZoom: 18,
      zoomControl: false,
    });

    // Dark high-contrast CartoDB tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Routes layer
    const routesGroup = L.layerGroup().addTo(map);
    routesLayerRef.current = routesGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers and Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous route polylines
    if (routesLayerRef.current) {
      routesLayerRef.current.clearLayers();
    }

    vehicles.forEach((bus) => {
      const isEmergency = activeEmergency && activeEmergency.vehicleId === bus.id && activeEmergency.status === 'ACTIVE';
      const isSelected = selectedVehicleId === bus.id;

      // Draw route polyline
      if (routesLayerRef.current && bus.routeWaypoints.length > 1) {
        const latLngs = bus.routeWaypoints.map((w) => [w.lat, w.lng] as [number, number]);
        const polyline = L.polyline(latLngs, {
          color: isEmergency ? '#E51B24' : isSelected ? '#EF4444' : '#475569',
          weight: isEmergency ? 4 : isSelected ? 3 : 2,
          opacity: isEmergency ? 0.9 : isSelected ? 0.8 : 0.4,
          dashArray: isEmergency ? undefined : '5, 8',
        });
        routesLayerRef.current.addLayer(polyline);
      }

      // Marker Icon HTML
      const markerHtml = `
        <div class="relative group cursor-pointer">
          ${
            isEmergency
              ? `<div class="absolute -inset-4 bg-red-600/30 rounded-full animate-radar pointer-events-none"></div>
                 <div class="absolute -inset-2 bg-red-600/50 rounded-full animate-ping pointer-events-none"></div>`
              : ''
          }
          <div class="relative flex items-center justify-center w-10 h-10 rounded-lg ${
            isEmergency
              ? 'bg-[#E51B24] text-white border-2 border-white shadow-[0_0_20px_#E51B24]'
              : isSelected
              ? 'bg-[#1E293B] text-red-400 border-2 border-[#E51B24] shadow-[0_0_12px_rgba(229,27,36,0.5)]'
              : 'bg-[#0F172A] text-slate-200 border border-slate-700 hover:border-slate-400'
          } transition-transform hover:scale-110">
            ${
              isEmergency
                ? `<svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`
                : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8m-8 4h8m-8 4h5M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>`
            }
            <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#05070A]/95 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-800 whitespace-nowrap shadow-sm ${
              isEmergency ? 'text-red-400 border-red-900/60 font-black' : 'text-slate-300'
            }">
              ${bus.id}
            </span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-bus-marker',
        html: markerHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -22],
      });

      if (markersRef.current[bus.id]) {
        // Smoothly animate marker to new GPS coordinate
        markersRef.current[bus.id].setLatLng([bus.currentLocation.lat, bus.currentLocation.lng]);
        markersRef.current[bus.id].setIcon(customIcon);
      } else {
        const marker = L.marker([bus.currentLocation.lat, bus.currentLocation.lng], {
          icon: customIcon,
          title: bus.id,
        }).addTo(map);

        marker.on('click', () => {
          setSelectedVehicleId(bus.id);
          if (onSelectVehicle) {
            onSelectVehicle(bus);
          }
        });

        // Popup content
        const popupContent = `
          <div class="p-2.5 font-sans min-w-[210px]">
            <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span class="font-display font-bold text-base text-white">${bus.id}</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isEmergency ? 'bg-red-950 text-red-400 border border-red-700' : 'bg-slate-800 text-emerald-400'
              }">
                ${bus.status}
              </span>
            </div>
            <div class="space-y-1 text-xs text-slate-300">
              <div class="flex justify-between"><span class="text-slate-500">Plate:</span> <span class="font-mono text-white">${bus.plateNumber}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Speed:</span> <span class="font-mono font-bold text-white">${bus.currentSpeed} km/h</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Onboard:</span> <span class="font-mono font-bold text-emerald-400">${bus.studentsOnBoard} / ${bus.capacity}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Driver:</span> <span class="text-slate-200 truncate max-w-[120px]">${bus.driver.fullName}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">GPS Link:</span> <span class="text-[10px] font-mono text-emerald-400 font-semibold">${bus.gpsStatus}</span></div>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
        markersRef.current[bus.id] = marker;
      }
    });
  }, [vehicles, activeEmergency, selectedVehicleId]);

  // Handle programmatic camera centering (e.g. View Location in Emergency alert)
  useEffect(() => {
    if (focusedMapCoords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([focusedMapCoords.lat, focusedMapCoords.lng], 15, {
        duration: 1.2,
      });
      setFocusedMapCoords(null);
    }
  }, [focusedMapCoords]);

  const handleCenterCairo = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([30.0150, 31.4200], 12);
    }
  };

  const handleFocusEmergency = () => {
    if (activeEmergency && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [activeEmergency.coordinates.lat, activeEmergency.coordinates.lng],
        16,
        { duration: 1 }
      );
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-[#070A0F] shadow-2xl">
      {/* Map Header Overlay Bar */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2">
        <div className="bg-[#05070A]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Cairo Transit Grid</span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-400">{vehicles.length} Vehicles Monitored</span>
        </div>

        {activeEmergency && (
          <button
            onClick={handleFocusEmergency}
            className="bg-[#E51B24] hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,27,36,0.6)] animate-pulse transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ACCIDENT LOCUS: {activeEmergency.vehicleId}</span>
          </button>
        )}
      </div>

      {/* Map Control Shortcuts (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-2">
        <button
          onClick={handleCenterCairo}
          title="Reset to Cairo Fleet Overview"
          className="bg-[#05070A]/90 hover:bg-slate-800 text-slate-300 p-2 rounded-lg border border-slate-800 shadow-md text-xs flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium hidden sm:inline">Reset View</span>
        </button>

        <button
          onClick={toggleSimulation}
          title="Toggle Simulated GPS Telemetry"
          className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-medium shadow-md transition-colors flex items-center gap-1.5 ${
            isSimulationActive
              ? 'bg-slate-900/90 text-emerald-400 border-emerald-900/50'
              : 'bg-slate-900/90 text-amber-400 border-amber-900/50'
          }`}
        >
          <Navigation className={`w-3.5 h-3.5 ${isSimulationActive ? 'animate-spin' : ''}`} />
          <span>GPS SIM: {isSimulationActive ? 'STREAMING' : 'PAUSED'}</span>
        </button>
      </div>

      {/* Actual Leaflet Map Canvas */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
    </div>
  );
};
