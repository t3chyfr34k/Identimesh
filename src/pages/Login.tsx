
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!email || !password) {
      setFormError("All fields are required");
      return;
    }
    
    await login(email, password);
  };

  return (
    <AuthLayout title="Digital Detective Login">
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {formError}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4" />}
            required
            className="focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-4 w-4" />}
            required
            className="focus:border-primary"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full group relative overflow-hidden" 
          disabled={loading}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          {loading ? "Breaking In..." : "Access Your Detective Tools"}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>
        <Button variant="outline" className="w-full group" type="button">
          <span className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/10 to-secondary/0 group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          Continue with Google
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
            Become a Digital Detective
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
