"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { signInWithEmail } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const passwordValidation = useMemo(() => {
    const hasMinLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    const isValid = hasMinLength && hasUppercase && hasSymbol;
    return { hasMinLength, hasUppercase, hasSymbol, isValid };
  }, [password]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordValidation.isValid) {
      let errorMessages = [];
      if (!passwordValidation.hasMinLength) errorMessages.push("at least 6 characters");
      if (!passwordValidation.hasUppercase) errorMessages.push("an uppercase letter");
      if (!passwordValidation.hasSymbol) errorMessages.push("a symbol");
      setError(`Password must contain ${errorMessages.join(', ')}.`);
      return;
    }

    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const AuthFormSkeleton = () => (
     <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">Welcome to NewsAI Digest</CardTitle>
          <CardDescription>Sign in to access your AI-powered news feed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
                This is a demo application. You can use any email and password to sign in.
            </p>
        </CardFooter>
      </Card>
  )

  const ValidationCheck = ({ isValid, text }: { isValid: boolean, text: string }) => (
    <div className={`flex items-center gap-2 text-sm ${isValid ? 'text-green-500' : 'text-muted-foreground'}`}>
      {isValid ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {!isClient ? <AuthFormSkeleton /> : (
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Welcome to NewsAI Digest</CardTitle>
            <CardDescription>Sign in to access your AI-powered news feed</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {password.length > 0 && (
                 <div className="space-y-1.5 pt-2">
                    <ValidationCheck isValid={passwordValidation.hasMinLength} text="At least 6 characters" />
                    <ValidationCheck isValid={passwordValidation.hasUppercase} text="Contains an uppercase letter" />
                    <ValidationCheck isValid={passwordValidation.hasSymbol} text="Contains a symbol (!@#$...)" />
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={!passwordValidation.isValid}>
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter>
              <p className="text-xs text-muted-foreground text-center w-full">
                  This is a demo application. You can use any email and password to sign in.
              </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
