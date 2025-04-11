
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import StationMap from '@/components/map/StationMap';
import StationFilters from '@/components/map/StationFilters';

const MapPage = () => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<'2W' | '4W' | 'all'>('all');
  
  return (
    <Layout hideFooter>
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">Find EV Charging Stations</h1>
        
        <StationFilters 
          selectedVehicleType={selectedVehicleType}
          onVehicleTypeChange={setSelectedVehicleType}
        />
        
        <div className="rounded-lg overflow-hidden shadow-lg">
          <StationMap selectedVehicleType={selectedVehicleType} />
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
