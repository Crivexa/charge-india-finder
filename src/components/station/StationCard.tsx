
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Station } from '@/hooks/use-stations';
import { MapPin, Zap } from 'lucide-react';

interface StationCardProps {
  station: Station;
}

const StationCard = ({ station }: StationCardProps) => {
  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-0">
        <div className="relative">
          <div className="h-48 bg-ev-light-blue flex items-center justify-center">
            <Zap className="h-16 w-16 text-ev-blue animate-pulse-slow" />
          </div>
          
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {station.vehicleTypes.includes('2W') && (
              <Badge variant="secondary" className="bg-ev-blue text-white">
                2-Wheeler
              </Badge>
            )}
            {station.vehicleTypes.includes('4W') && (
              <Badge variant="secondary" className="bg-ev-green text-white">
                4-Wheeler
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold">{station.name}</h3>
          
          <div className="flex items-center text-ev-gray mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <p className="text-sm truncate">{station.address}</p>
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-ev-gray">Price per hour</span>
              <span className="font-medium">₹{station.pricePerHour}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-ev-gray">Available slots</span>
              <span className="font-medium">{station.availableSlots}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link to={`/station/${station.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        <Link to={`/station/${station.id}?book=true`}>
          <Button>Book Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default StationCard;
