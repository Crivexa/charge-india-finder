
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        setError('Supabase is not properly configured. Please set your Supabase URL and Anon Key in the environment variables.');
        return;
      }

      try {
        const { error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error during auth callback:', sessionError);
          setError(sessionError.message);
          navigate('/login?error=auth-callback-failed');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        navigate('/login?error=auth-callback-failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-4">
                <p className="text-sm">
                  Please make sure your Supabase environment variables are correctly set.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-ev-blue mx-auto mb-4" />
        <p className="text-ev-dark">Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
