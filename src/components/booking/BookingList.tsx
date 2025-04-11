
import { useState } from 'react';
import { useBookings } from '@/hooks/use-bookings';
import BookingCard from './BookingCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const BookingList = () => {
  const { bookings, loading, error } = useBookings();
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Categorize bookings
  const upcomingBookings = bookings.filter(
    (booking) => 
      booking.status === 'confirmed' && 
      new Date(booking.date) > new Date()
  );
  
  const pastBookings = bookings.filter(
    (booking) => 
      booking.status === 'confirmed' && 
      new Date(booking.date) <= new Date()
  );
  
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === 'cancelled'
  );
  
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
  
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-ev-gray">No bookings found</h3>
        <p className="mt-2 text-ev-gray">
          You haven't made any bookings yet
        </p>
      </div>
    );
  }
  
  return (
    <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="upcoming">
          Upcoming ({upcomingBookings.length})
        </TabsTrigger>
        <TabsTrigger value="past">
          Past ({pastBookings.length})
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          Cancelled ({cancelledBookings.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming">
        {upcomingBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ev-gray">No upcoming bookings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="past">
        {pastBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ev-gray">No past bookings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="cancelled">
        {cancelledBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ev-gray">No cancelled bookings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cancelledBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default BookingList;
