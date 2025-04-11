
import Layout from '@/components/layout/Layout';
import BookingList from '@/components/booking/BookingList';
import { useAuth } from '@/hooks/use-auth';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BookingsPage = () => {
  const { user } = useAuth();
  
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
