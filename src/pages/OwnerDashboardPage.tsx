
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStations } from '@/hooks/use-stations';
import { useBookings } from '@/hooks/use-bookings';
import StationList from '@/components/station/StationList';
import BookingList from '@/components/booking/BookingList';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddStationForm from '@/components/station/AddStationForm';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OwnerDashboardPage = () => {
  const { user, userData } = useAuth();
  const { stations } = useStations();
  const { bookings } = useBookings();
  const [isAddStationOpen, setIsAddStationOpen] = useState(false);
  
  // Check if user is logged in and is an owner
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (userData?.role !== 'owner') {
    return <Navigate to="/register" />;
  }
  
  // Count active stations
  const activeStations = stations.filter(station => station.isActive).length;
  // Count upcoming bookings
  const upcomingBookings = bookings.filter(
    booking => booking.status === 'confirmed' && new Date(booking.date) > new Date()
  ).length;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Owner Dashboard</h1>
          
          <Dialog open={isAddStationOpen} onOpenChange={setIsAddStationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Station
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Charging Station</DialogTitle>
                <DialogDescription>
                  Add your charging station details below. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              
              <AddStationForm onSuccess={() => setIsAddStationOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Stations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stations.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeStations} active stations
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingBookings} upcoming bookings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estimated Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{bookings.reduce((acc, booking) => {
                  const station = stations.find(s => s.id === booking.stationId);
                  return acc + (station?.pricePerHour || 0);
                }, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on hourly rates
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="stations">
          <TabsList className="mb-8">
            <TabsTrigger value="stations">My Stations</TabsTrigger>
            <TabsTrigger value="bookings">Station Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stations">
            <StationList />
          </TabsContent>
          
          <TabsContent value="bookings">
            <BookingList />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OwnerDashboardPage;
