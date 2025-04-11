
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useStations, Station } from '@/hooks/use-stations';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Timer, Zap, ChevronLeft, Calendar } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StationDetailPage = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { stations, loading, error } = useStations();
  const { user } = useAuth();
  const [station, setStation] = useState<Station | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Check if we should open booking dialog
  useEffect(() => {
    const shouldOpenBooking = searchParams.get('book') === 'true';
    if (shouldOpenBooking) {
      setIsBookingOpen(true);
      // Remove the query parameter after opening
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);
  
  // Find the station
  useEffect(() => {
    if (stationId && stations.length > 0) {
      const foundStation = stations.find(s => s.id === stationId);
      setStation(foundStation || null);
    }
  }, [stationId, stations]);
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-ev-blue" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !station) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <p className="text-red-700">
              {error || "Station not found. It may have been removed or is no longer available."}
            </p>
          </div>
          <Link to="/map">
            <Button>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Map
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to="/map" className="text-ev-blue hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Map
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Station Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 md:h-64 bg-ev-light-blue flex items-center justify-center">
                <Zap className="h-20 w-20 text-ev-blue animate-pulse-slow" />
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
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
                
                <h1 className="text-3xl font-bold mb-2">{station.name}</h1>
                
                <div className="flex items-center text-ev-gray mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <p>{station.address}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-ev-gray mb-1">
                      <Timer className="h-5 w-5 mr-2" />
                      <p className="font-medium">Price Per Hour</p>
                    </div>
                    <p className="text-2xl font-bold">₹{station.pricePerHour}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-ev-gray mb-1">
                      <Calendar className="h-5 w-5 mr-2" />
                      <p className="font-medium">Available Slots</p>
                    </div>
                    <p className="text-2xl font-bold">{station.availableSlots}</p>
                  </div>
                </div>
                
                <Tabs defaultValue="description">
                  <TabsList className="mb-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description">
                    <div className="prose max-w-none">
                      <p>{station.description}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="location">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-medium mb-2">Address</h3>
                      <p>{station.address}</p>
                      
                      <h3 className="text-lg font-medium mt-4 mb-2">Coordinates</h3>
                      <p>
                        Latitude: {station.latitude}<br />
                        Longitude: {station.longitude}
                      </p>
                      
                      <div className="mt-4">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ev-blue hover:underline"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Booking Card */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Book a Charging Slot</h2>
                
                {user ? (
                  <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">Book Now</Button>
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
                ) : (
                  <div className="space-y-4">
                    <p className="text-ev-gray mb-4">
                      Please log in to book a charging slot.
                    </p>
                    <Link to="/login">
                      <Button className="w-full">Log In to Book</Button>
                    </Link>
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Station Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-ev-gray">Station Name:</span>
                      <span>{station.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ev-gray">Price:</span>
                      <span>₹{station.pricePerHour}/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ev-gray">Vehicle Types:</span>
                      <span>
                        {station.vehicleTypes.map(type => 
                          type === '2W' ? '2-Wheeler' : '4-Wheeler'
                        ).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ev-gray">Available Slots:</span>
                      <span>{station.availableSlots}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StationDetailPage;
