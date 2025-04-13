
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, userData, signOut, updateUserRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'user' | 'owner'>(userData?.role || 'user');
  const [updatingRole, setUpdatingRole] = useState(false);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const handleRoleUpdate = async () => {
    if (selectedRole === userData?.role) return;
    
    setUpdatingRole(true);
    try {
      await updateUserRole(selectedRole);
    } finally {
      setUpdatingRole(false);
    }
  };
  
  // Extract user info from userData or user.user_metadata
  const userDisplayName = userData?.name || 
                         user.user_metadata?.full_name || 
                         user.user_metadata?.name || 
                         user.email?.split('@')[0] || 
                         'User';
  
  const userEmail = user.email || '';
  const userAvatar = user.user_metadata?.avatar_url;
  const userInitial = userDisplayName.charAt(0).toUpperCase();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div>
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={userAvatar || undefined} alt={userDisplayName} />
                  <AvatarFallback className="text-2xl">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{userDisplayName}</CardTitle>
                <CardDescription>{userEmail}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ev-gray">Account Type:</span>
                    <span className="font-medium capitalize">{userData?.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ev-gray">Member Since:</span>
                    <span className="font-medium">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Settings Tabs */}
          <div className="md:col-span-2">
            <Tabs defaultValue="account">
              <TabsList className="mb-6">
                <TabsTrigger value="account">Account Settings</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Account Type</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose your account type based on how you want to use ChargeIndia.
                        </p>
                      </div>
                      
                      <RadioGroup 
                        value={selectedRole}
                        onValueChange={(value) => setSelectedRole(value as 'user' | 'owner')}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user" id="user-role" />
                          <Label htmlFor="user-role" className="cursor-pointer">EV User</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="owner" id="owner-role" />
                          <Label htmlFor="owner-role" className="cursor-pointer">Station Owner</Label>
                        </div>
                      </RadioGroup>
                      
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
                        onClick={handleRoleUpdate}
                        disabled={updatingRole || selectedRole === userData?.role}
                      >
                        {updatingRole ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Account Type'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>
                      Manage your notification and app preferences.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Preferences settings will be available in a future update.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
