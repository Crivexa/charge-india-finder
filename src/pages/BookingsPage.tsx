
import Layout from '@/components/layout/Layout';
import BookingList from '@/components/booking/BookingList';
import { useAuth } from '@/hooks/use-auth';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

const BookingsPage = () => {
  const { user, loading, authError } = useAuth();
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-ev-blue" />
            <p className="text-lg">Loading your bookings...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (authError) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>
              {authError.message || "There was an error with authentication."}
              <div className="mt-4">
                <Link to="/login">
                  <Button variant="outline">Go to Login</Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">My Bookings</h1>
          <Link to="/map">
            <Button>Find New Station</Button>
          </Link>
        </div>
        
        <BookingList />
      </div>
    </Layout>
  );
};

export default BookingsPage;
