
import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './use-auth';
import { Station } from './use-stations';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  stationId: string;
  stationName: string;
  date: Date;
  timeSlot: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
}

interface NewBooking {
  stationId: string;
  stationName: string;
  date: Date;
  timeSlot: string;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userData } = useAuth();

  // Fetch bookings based on user role
  const fetchBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const bookingsRef = collection(db, 'bookings');
      let q;
      
      if (userData?.role === 'owner') {
        // Fetch bookings for the stations owned by this user
        // First, we need to get the stations owned by this user
        const stationsRef = collection(db, 'stations');
        const stationsQuery = query(stationsRef, where('ownerId', '==', user.uid));
        const stationsSnapshot = await getDocs(stationsQuery);
        const stationIds = stationsSnapshot.docs.map(doc => doc.id);
        
        if (stationIds.length === 0) {
          setBookings([]);
          setLoading(false);
          return;
        }
        
        // Now fetch bookings for these stations
        q = query(
          bookingsRef, 
          where('stationId', 'in', stationIds),
          orderBy('date', 'desc')
        );
      } else {
        // Regular user - fetch their own bookings
        q = query(
          bookingsRef, 
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
      }
      
      const snapshot = await getDocs(q);
      const bookingList: Booking[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Booking[];
      
      setBookings(bookingList);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, userData?.role]);

  // Check for booking slot availability
  const checkSlotAvailability = async (stationId: string, date: Date, timeSlot: string): Promise<boolean> => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);
      
      const q = query(
        bookingsRef,
        where('stationId', '==', stationId),
        where('date', '>=', dateStart),
        where('date', '<=', dateEnd),
        where('timeSlot', '==', timeSlot),
        where('status', '==', 'confirmed')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.empty; // If empty, the slot is available
    } catch (err) {
      console.error('Error checking slot availability:', err);
      toast({
        title: 'Error',
        description: 'Failed to check slot availability. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Book a slot
  const bookSlot = async (bookingData: NewBooking): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to book a slot',
        variant: 'destructive',
      });
      return false;
    }

    // Check if the slot is available
    const isAvailable = await checkSlotAvailability(
      bookingData.stationId,
      bookingData.date,
      bookingData.timeSlot
    );

    if (!isAvailable) {
      toast({
        title: 'Slot Unavailable',
        description: 'This time slot is already booked. Please select another time.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const bookingsRef = collection(db, 'bookings');
      await addDoc(bookingsRef, {
        ...bookingData,
        userId: user.uid,
        userName: user.displayName,
        status: 'confirmed',
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: 'Success',
        description: 'Slot booked successfully!',
      });
      
      // Refresh bookings list
      fetchBookings();
      return true;
    } catch (err) {
      console.error('Error booking slot:', err);
      toast({
        title: 'Error',
        description: 'Failed to book slot. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to cancel a booking',
        variant: 'destructive',
      });
      return;
    }

    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
      });
      
      toast({
        title: 'Success',
        description: 'Booking cancelled successfully!',
      });
      
      // Refresh bookings list
      fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast({
        title: 'Error',
        description: 'Failed to cancel booking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Generate ICS file for a booking
  const generateICSFile = (booking: Booking) => {
    try {
      // Get the hour from timeSlot (assuming format like "14:00" or "2PM")
      let hour = 12;
      let hourEnd = 13;
      
      if (booking.timeSlot.includes(':')) {
        hour = parseInt(booking.timeSlot.split(':')[0]);
        hourEnd = hour + 1;
      } else if (booking.timeSlot.includes('AM')) {
        hour = parseInt(booking.timeSlot.replace('AM', ''));
        hourEnd = hour + 1;
      } else if (booking.timeSlot.includes('PM')) {
        hour = parseInt(booking.timeSlot.replace('PM', ''));
        if (hour !== 12) hour += 12;
        hourEnd = hour + 1;
      }
      
      // Create start and end dates
      const startDate = new Date(booking.date);
      startDate.setHours(hour, 0, 0);
      
      const endDate = new Date(booking.date);
      endDate.setHours(hourEnd, 0, 0);
      
      // Format dates for ICS
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
      };
      
      // Create ICS content
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//EVChargeFinder//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `UID:${booking.id}@evchargefinder.app`,
        `SUMMARY:EV Charging Slot at ${booking.stationName}`,
        `DESCRIPTION:Your charging slot at ${booking.stationName}. Booking ID: ${booking.id}`,
        `LOCATION:${booking.stationName}`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        'STATUS:CONFIRMED',
        `DTSTAMP:${formatDate(new Date())}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
      
      // Create a blob and download link
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `charging-slot-${booking.id}.ics`;
      link.click();
      
      toast({
        title: 'Success',
        description: 'Calendar invite downloaded successfully!',
      });
    } catch (err) {
      console.error('Error generating ICS file:', err);
      toast({
        title: 'Error',
        description: 'Failed to generate calendar invite. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return { 
    bookings, 
    loading, 
    error, 
    fetchBookings,
    bookSlot,
    cancelBooking,
    checkSlotAvailability,
    generateICSFile
  };
}
