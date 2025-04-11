
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Station } from '@/hooks/use-stations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BookingForm from '../booking/BookingForm';

interface StationPopupProps {
  station: Station;
}

const StationPopup = ({ station }: StationPopupProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  return (
    <div className="p-1 min-w-[200px]">
      <h3 className="font-bold text-lg">{station.name}</h3>
      <p className="text-sm text-gray-500">{station.address}</p>
      
      <div className="my-2">
        <div className="flex gap-2 mb-1">
          {station.vehicleTypes.includes('2W') && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
              2-Wheeler
            </span>
          )}
          {station.vehicleTypes.includes('4W') && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              4-Wheeler
            </span>
          )}
        </div>
        
        <p className="text-sm">
          <span className="font-medium">Price:</span> ₹{station.pricePerHour}/hour
        </p>
        
        <p className="text-sm">
          <span className="font-medium">Available Slots:</span> {station.availableSlots}
        </p>
      </div>
      
      <div className="mt-3 flex justify-between">
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary text-sm h-8">Book Now</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book Charging Slot</DialogTitle>
              <DialogDescription>
                Book a 1-hour charging slot at {station.name}
              </DialogDescription>
            </DialogHeader>
            
            <BookingForm 
              station={station} 
              onSuccess={() => setIsBookingOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        <Link to={`/station/${station.id}`}>
          <Button variant="outline" className="text-sm h-8">Details</Button>
        </Link>
      </div>
    </div>
  );
};

export default StationPopup;
