
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
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
  loading: boolean;
  authError: Error | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Get additional user data from Firestore
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            // New user, create a default profile
            const newUserData: UserData = {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              role: 'user', // Default role
              createdAt: new Date(),
            };
            
            await setDoc(docRef, {
              ...newUserData,
              createdAt: serverTimestamp(),
            });
            
            setUserData(newUserData);
          }
        } catch (error) {
          console.error("Error getting user data:", error);
          toast({
            title: "Error",
            description: "Failed to load user data. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      console.log("Starting Google sign-in process...");
      
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get the Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (credential) {
        console.log("Authentication successful");
        toast({
          title: "Welcome!",
          description: "You've successfully signed in.",
        });
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      console.error("Error code:", (error as any).code);
      console.error("Error message:", (error as any).message);
      
      setAuthError(error as Error);
      
      toast({
        title: "Sign-in Failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Signed Out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
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
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { role }, { merge: true });
      
      // Update local state
      setUserData(prev => prev ? { ...prev, role } : null);
      
      toast({
        title: "Role Updated",
        description: `Your account is now set as a Station ${role === 'owner' ? 'Owner' : 'User'}.`,
      });
    } catch (error) {
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
    loading,
    authError,
    signInWithGoogle,
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
