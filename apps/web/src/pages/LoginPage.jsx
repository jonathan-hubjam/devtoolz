'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await pb.collection('users').authWithPassword(email, password);
      toast({
        title: 'Authentication successful',
        description: 'You have been logged in.',
      });
      router.replace('/');
    } catch (err) {
      toast({
        title: 'Login failed',
        description: err.message || 'Invalid email or password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md space-y-6">
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-4 text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="flex justify-center mb-2">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl tracking-tight">Admin Access</CardTitle>
              <CardDescription>
                Sign in to access protected settings and configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-background text-foreground"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-background text-foreground"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-4 bg-muted/20">
              <p className="text-xs text-muted-foreground text-center">
                Protected area. Unauthorized access is prohibited.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LoginPage;