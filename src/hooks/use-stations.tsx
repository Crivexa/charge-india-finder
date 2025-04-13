
import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './use-auth';

export interface Station {
  id: string;
  name: string;
  ownerId: string;
  ownerName?: string;
  latitude: number;
  longitude: number;
  vehicleTypes: ('2W' | '4W')[];
  pricePerHour: number;
  availableSlots: number;
  description: string;
  address: string;
  isActive: boolean;
  isPublic: boolean;
  createdAt: Date;
}

interface NewStation {
  name: string;
  latitude: number;
  longitude: number;
  vehicleTypes: ('2W' | '4W')[];
  pricePerHour: number;
  availableSlots: number;
  description: string;
  address: string;
  isActive: boolean;
  isPublic: boolean;
}

export function useStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userData } = useAuth();

  // Fetch stations from Firebase
  const fetchStations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const stationsRef = collection(db, 'stations');
      let q = query(stationsRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
      
      // If user is an owner, also fetch their inactive stations
      if (userData?.role === 'owner' && user) {
        q = query(stationsRef, where('ownerId', '==', user.id), orderBy('createdAt', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      const stationList: Station[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Station[];
      
      setStations(stationList);
    } catch (err) {
      console.error('Error fetching stations:', err);
      setError('Failed to fetch charging stations');
      toast({
        title: 'Error',
        description: 'Failed to fetch charging stations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStations();
  }, [userData?.role, user?.id]);

  // Add a new station
  const addStation = async (stationData: NewStation) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to add a station',
        variant: 'destructive',
      });
      return;
    }

    try {
      const stationsRef = collection(db, 'stations');
      const userName = userData?.name || 
                       user.user_metadata?.full_name || 
                       user.user_metadata?.name || 
                       user.email?.split('@')[0] || 
                       'Unknown User';
      
      await addDoc(stationsRef, {
        ...stationData,
        ownerId: user.id,
        ownerName: userName,
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: 'Success',
        description: 'Charging station added successfully!',
      });
      
      // Refresh stations list
      fetchStations();
    } catch (err) {
      console.error('Error adding station:', err);
      toast({
        title: 'Error',
        description: 'Failed to add charging station. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Update a station
  const updateStation = async (stationId: string, stationData: Partial<Station>) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to update a station',
        variant: 'destructive',
      });
      return;
    }

    try {
      const stationRef = doc(db, 'stations', stationId);
      await updateDoc(stationRef, {
        ...stationData,
        updatedAt: serverTimestamp(),
      });
      
      toast({
        title: 'Success',
        description: 'Charging station updated successfully!',
      });
      
      // Refresh stations list
      fetchStations();
    } catch (err) {
      console.error('Error updating station:', err);
      toast({
        title: 'Error',
        description: 'Failed to update charging station. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Delete a station
  const deleteStation = async (stationId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to delete a station',
        variant: 'destructive',
      });
      return;
    }

    try {
      const stationRef = doc(db, 'stations', stationId);
      await deleteDoc(stationRef);
      
      toast({
        title: 'Success',
        description: 'Charging station deleted successfully!',
      });
      
      // Refresh stations list
      fetchStations();
    } catch (err) {
      console.error('Error deleting station:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete charging station. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Fetch public API stations
  const fetchPublicApiStations = async (lat: number, lng: number) => {
    try {
      // This would be implemented with the real API
      // For now, we'll just show a toast message
      toast({
        title: 'Public API',
        description: 'Fetching stations from public API would be implemented with the real API endpoint.',
      });
      
      // In a real implementation, we would fetch from the API and merge with our Firestore stations
    } catch (err) {
      console.error('Error fetching public API stations:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch public charging stations. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return { 
    stations, 
    loading, 
    error, 
    fetchStations,
    addStation,
    updateStation,
    deleteStation,
    fetchPublicApiStations
  };
}
