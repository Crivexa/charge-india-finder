
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import StationList from '@/components/station/StationList';
import { ChevronRight, MapPin, Zap, Timer, Calendar } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-ev-blue to-ev-green py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find and Book EV Charging Stations Across India
            </h1>
            <p className="text-xl mb-8">
              Locate, book, and charge your electric vehicle at stations near you. No more range anxiety.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/map">
                <Button size="lg" className="bg-white text-ev-blue hover:bg-gray-100 px-6">
                  Find Stations
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              {!user && (
                <Link to="/register">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-6">
                    Register Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-ev-light-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-ev-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Find Stations</h3>
              <p className="text-ev-gray">
                Discover charging stations for 2-wheelers and 4-wheelers near your location using our interactive map.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-ev-light-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-ev-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Book a Slot</h3>
              <p className="text-ev-gray">
                Reserve a 1-hour charging slot at your preferred station and time, with calendar integration.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-ev-light-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-ev-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Charge Your EV</h3>
              <p className="text-ev-gray">
                Visit the station at your booked time and charge your electric vehicle hassle-free.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-ev-dark py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Are you a station owner?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Register your charging stations on ChargeIndia and reach more EV owners. Manage your stations and view bookings easily.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-ev-green hover:bg-green-600 px-6">
              Register as Station Owner
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Featured Stations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Charging Stations</h2>
            <Link to="/map" className="text-ev-blue hover:underline flex items-center">
              View All
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <StationList />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
