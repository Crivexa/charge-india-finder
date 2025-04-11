
import { format } from 'date-fns';
import { Booking, useBookings } from '@/hooks/use-bookings';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Loader2, DownloadCloud, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BookingCardProps {
  booking: Booking;
}

const BookingCard = ({ booking }: BookingCardProps) => {
  const { cancelBooking, generateICSFile } = useBookings();
  const [isCancelling, setIsCancelling] = useState(false);
  
  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      await cancelBooking(booking.id);
    } finally {
      setIsCancelling(false);
    }
  };
  
  // Find the time slot label (convert 14:00 to 2:00 PM)
  const getTimeSlotLabel = (timeSlot: string) => {
    const [hourStr] = timeSlot.split(':');
    const hour = parseInt(hourStr);
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? 'AM' : 'PM';
    return `${formattedHour}:00 ${amPm}`;
  };
  
  const isUpcoming = booking.status === 'confirmed' && new Date(booking.date) > new Date();
  const isPast = booking.status === 'confirmed' && new Date(booking.date) < new Date();
  
  return (
    <Card className={`overflow-hidden ${booking.status === 'cancelled' ? 'opacity-75' : ''}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold">{booking.stationName}</h3>
          
          <Badge
            className={`${
              booking.status === 'confirmed'
                ? isUpcoming
                  ? 'bg-ev-green'
                  : 'bg-gray-500'
                : 'bg-red-500'
            } text-white`}
          >
            {booking.status === 'confirmed'
              ? isUpcoming
                ? 'Upcoming'
                : 'Past'
              : 'Cancelled'}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-ev-gray">Date</span>
            <span className="font-medium">{format(new Date(booking.date), 'MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-ev-gray">Time</span>
            <span className="font-medium">{getTimeSlotLabel(booking.timeSlot)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-ev-gray">Booking ID</span>
            <span className="font-medium text-sm">{booking.id.substring(0, 8)}...</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-ev-gray">Booked On</span>
            <span className="font-medium">
              {format(new Date(booking.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => generateICSFile(booking)}
          className="flex items-center"
          disabled={booking.status === 'cancelled'}
        >
          <DownloadCloud className="mr-2 h-4 w-4" />
          Calendar
        </Button>
        
        {isUpcoming && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isCancelling}>
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel your booking at {booking.stationName} on{' '}
                  {format(new Date(booking.date), 'MMMM d, yyyy')} at {getTimeSlotLabel(booking.timeSlot)}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, Keep It</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelBooking}>
                  Yes, Cancel Booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingCard;
