import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useStations, Station } from '@/hooks/use-stations';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin } from 'lucide-react';
import StationPopup from './StationPopup';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div class="w-6 h-6 bg-${color} rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

// Component to recenter map to user location
const RecenterAutomatically = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  
  return null;
};

interface StationMapProps {
  selectedVehicleType?: '2W' | '4W' | 'all';
}

const StationMap = ({ selectedVehicleType = 'all' }: StationMapProps) => {
  const { latitude, longitude, loading: geoLoading, error: geoError, getCurrentLocation } = useGeolocation();
  const { stations, loading: stationsLoading, fetchStations } = useStations();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // Filter stations based on vehicle type
  const filteredStations = selectedVehicleType === 'all'
    ? stations
    : stations.filter(station => station.vehicleTypes.includes(selectedVehicleType));

  // Create custom icons
  const twoWheelerIcon = createCustomIcon('ev-blue');
  const fourWheelerIcon = createCustomIcon('ev-green');
  const bothTypesIcon = createCustomIcon('purple-500');

  const getStationIcon = (station: Station) => {
    if (station.vehicleTypes.includes('2W') && station.vehicleTypes.includes('4W')) {
      return bothTypesIcon;
    } else if (station.vehicleTypes.includes('4W')) {
      return fourWheelerIcon;
    } else {
      return twoWheelerIcon;
    }
  };

  if (geoLoading || stationsLoading) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-ev-blue mx-auto mb-4" />
          <p className="text-ev-dark">Loading map...</p>
        </div>
      </div>
    );
  }

  if (geoError) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 p-4 rounded-lg mb-4">
            <p className="text-red-800">{geoError}</p>
          </div>
          <Button onClick={getCurrentLocation} className="btn-primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!latitude || !longitude) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-yellow-100 p-4 rounded-lg mb-4">
            <p className="text-yellow-800">Location access is required to show charging stations near you.</p>
          </div>
          <Button onClick={getCurrentLocation} className="btn-primary">
            Share Location
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="map-container">
      <MapContainer
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        zoom={14}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User's current location */}
        <Marker
          position={[latitude, longitude] as L.LatLngExpression}
        >
          <Popup>
            <div className="text-center py-1">
              <p className="font-medium">Your Location</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Charging stations */}
        {filteredStations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude] as L.LatLngExpression}
            eventHandlers={{
              click: () => {
                setSelectedStation(station);
              },
            }}
          >
            <Popup>
              <StationPopup station={station} />
            </Popup>
          </Marker>
        ))}
        
        {/* Keep map centered on user location */}
        <RecenterAutomatically lat={latitude} lng={longitude} />
      </MapContainer>
      
      {/* Floating location button */}
      <div className="absolute bottom-4 right-4 z-10">
        <Button
          onClick={getCurrentLocation}
          className="rounded-full w-12 h-12 bg-white shadow-lg hover:bg-gray-100"
        >
          <MapPin className="h-5 w-5 text-ev-blue" />
        </Button>
      </div>
    </div>
  );
};

export default StationMap;
