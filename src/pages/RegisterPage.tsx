
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from '@/components/ui/alert';

const RegisterPage = () => {
  const { user, userData, loading, authError, signInWithGoogle, updateUserRole, clearAuthError } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'user' | 'owner'>('user');
  const [updatingRole, setUpdatingRole] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in and has a role set, redirect to home
    if (user && userData && userData.role) {
      navigate('/');
    }
  }, [user, userData, navigate]);
  
  const handleRoleSelection = async () => {
    if (!user) return;
    
    setUpdatingRole(true);
    try {
      await updateUserRole(selectedRole);
      navigate('/');
    } finally {
      setUpdatingRole(false);
    }
  };
  
  const handleRetry = () => {
    clearAuthError();
    signInWithGoogle();
  };
  
  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Register with ChargeIndia</CardTitle>
            <CardDescription className="text-center">
              Create an account to access charging stations and manage your bookings
            </CardDescription>
          </CardHeader>
          
          <CardContent className="grid gap-4">
            {!user ? (
              // Step 1: Sign in with Google
              <>
                {authError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Authentication failed. {authError.message}
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center" 
                          onClick={handleRetry}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Try Again
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  onClick={signInWithGoogle}
                  className="w-full bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                  )}
                  Continue with Google
                </Button>
              </>
            ) : (
              // Step 2: Select Role
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700">
                    Signed in as <strong>{user.displayName || user.email}</strong>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Select Account Type</h3>
                  
                  <RadioGroup 
                    defaultValue="user" 
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value as 'user' | 'owner')}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="user" id="user" />
                      <Label htmlFor="user" className="cursor-pointer">EV User</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="owner" id="owner" />
                      <Label htmlFor="owner" className="cursor-pointer">Station Owner</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  {selectedRole === 'user' ? (
                    <p className="text-blue-700">
                      As an <strong>EV User</strong>, you can find and book charging stations for your electric vehicle.
                    </p>
                  ) : (
                    <p className="text-blue-700">
                      As a <strong>Station Owner</strong>, you can list your charging stations and manage bookings.
                    </p>
                  )}
                </div>
                
                <Button 
                  onClick={handleRoleSelection}
                  className="w-full"
                  disabled={updatingRole}
                >
                  {updatingRole ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up your account...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-ev-blue hover:underline">
                Login here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPage;
