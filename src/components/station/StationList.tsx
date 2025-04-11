
import { useState } from 'react';
import { useStations } from '@/hooks/use-stations';
import StationCard from './StationCard';
import { Loader2 } from 'lucide-react';
import StationFilters from '../map/StationFilters';

const StationList = () => {
  const { stations, loading, error } = useStations();
  const [selectedVehicleType, setSelectedVehicleType] = useState<'2W' | '4W' | 'all'>('all');
  
  // Filter stations based on vehicle type
  const filteredStations = selectedVehicleType === 'all'
    ? stations
    : stations.filter(station => station.vehicleTypes.includes(selectedVehicleType));
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-ev-blue" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div>
      <StationFilters 
        selectedVehicleType={selectedVehicleType}
        onVehicleTypeChange={setSelectedVehicleType}
      />
      
      {filteredStations.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-ev-gray">No stations found</h3>
          <p className="mt-2 text-ev-gray">
            Try changing your filters or check back later
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StationList;
