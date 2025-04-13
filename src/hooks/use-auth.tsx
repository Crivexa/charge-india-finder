
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

type UserRole = 'user' | 'owner';

interface UserData {
  uid: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  session: Session | null;
  loading: boolean;
  authError: Error | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.error('Supabase is not properly configured. Please set your Supabase URL and Anon Key.');
      setLoading(false);
      setAuthError(new Error('Supabase configuration is missing. Please check the console for details.'));
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('uid', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user data:', error);
            toast({
              title: "Error",
              description: "Failed to load user data. Please try again.",
              variant: "destructive",
            });
          }

          if (data) {
            setUserData({
              uid: data.uid,
              name: data.name,
              email: data.email,
              role: data.role,
              createdAt: new Date(data.created_at),
            });
          } else if (session.user) {
            // Get user metadata from Supabase user
            const fullName = session.user.user_metadata?.full_name || 
                             session.user.user_metadata?.name || 
                             session.user.email?.split('@')[0] || null;
                             
            const newUserData: UserData = {
              uid: session.user.id,
              name: fullName,
              email: session.user.email,
              role: 'user',
              createdAt: new Date(),
            };

            // Create user profile in database
            try {
              const { error: insertError } = await supabase
                .from('user_profiles')
                .insert([{
                  uid: newUserData.uid,
                  name: newUserData.name,
                  email: newUserData.email,
                  role: newUserData.role,
                  created_at: newUserData.createdAt.toISOString(),
                }]);

              if (insertError) {
                console.error('Error creating user profile:', insertError);
                toast({
                  title: "Error",
                  description: "Failed to create user profile. Please try again.",
                  variant: "destructive",
                });
              } else {
                setUserData(newUserData);
              }
            } catch (err) {
              console.error('Error in user profile creation:', err);
            }
          }
        } else {
          setUserData(null);
        }

        setLoading(false);
      }
    );

    const initSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error initializing session:', error);
        setAuthError(error instanceof Error ? error : new Error('Failed to initialize session'));
      } finally {
        setLoading(false);
      }
    };

    initSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      console.error("Error signing in with email:", error);
      setAuthError(error);
      
      toast({
        title: "Sign-in Failed",
        description: error.message || "Could not sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      console.log("Starting Google sign-in process...");
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      setAuthError(error);
      
      toast({
        title: "Sign-in Failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      console.error("Error signing up:", error);
      setAuthError(error);
      
      toast({
        title: "Registration Failed",
        description: error.message || "Could not register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed Out",
        description: "You've been successfully signed out.",
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (role: UserRole) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role })
        .eq('uid', user.id);
      
      if (error) throw error;
      
      setUserData(prev => prev ? { ...prev, role } : null);
      
      toast({
        title: "Role Updated",
        description: `Your account is now set as a Station ${role === 'owner' ? 'Owner' : 'User'}.`,
      });
    } catch (error: any) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update your role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const value = {
    user,
    userData,
    session,
    loading,
    authError,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
    updateUserRole,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
