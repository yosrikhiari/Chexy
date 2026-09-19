import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/AuthService.ts";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.login({ emailAddress: email, password });
      localStorage.setItem("user", JSON.stringify(data.user));
      toast({
        title: "Login successful",
        description: `Welcome to Chexy, ${data.user.username}!`,
      });
      navigate("/game-select");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <span className="font-display text-4xl text-primary leading-none" aria-hidden="true">♞</span>
          <h1 className="text-3xl mt-3">Chexy</h1>
          <p className="text-muted-foreground mt-1">Chess, classic and RPG. Sign in to play.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-muted-foreground">Username or email</label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm text-muted-foreground">Password</label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <Button className="w-full fantasy-button" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 flex justify-between text-sm text-muted-foreground">
          <Link to="/register" className="hover:text-foreground">Create an account</Link>
          <Link to="/forgot-password" className="hover:text-foreground">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
