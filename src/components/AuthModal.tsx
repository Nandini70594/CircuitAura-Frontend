import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { createClient } from '@supabase/supabase-js';
const ADMIN_SECRET = "ADMIN-CKTAURA@26";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
}

const isValidName = (name: string): boolean => {
  const trimmed = name.trim();
  const minLength = trimmed.length >= 2;
  const noNumbersOrSymbols = /^[a-zA-Z\s]+$/.test(trimmed); 
  const notBlank = trimmed !== "";
  return minLength && noNumbersOrSymbols && notBlank;
};

const isStrongPassword = (password: string): boolean => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return minLength && hasUppercase && hasNumber && hasSpecial;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const AuthModal = ({
  open,
  onOpenChange,
  defaultTab = "login",
}: AuthModalProps) => {
  // EXISTING STATES
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<"user" | "admin">("user");
  const [showRoleField, setShowRoleField] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  
  // FORGOT PASSWORD STATES
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isLoadingReset, setIsLoadingReset] = useState(false);

  const { login, signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // ✅ FIXED PASSWORD RESET - Clean fetch to your backend
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingReset(true);
    setResetMessage("");

    if (!isValidEmail(resetEmail)) {
      setResetMessage("Please enter a valid email address");
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoadingReset(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }) // ✅ FIXED: body (not bod)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setResetMessage("✅ Check your email for reset link!");
      toast({
        title: "Reset link sent!",
        description: "Check your inbox (and spam folder).",
      });
      setResetEmail("");
      // Auto-close after success
      setTimeout(() => setShowForgotPassword(false), 2000);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setResetMessage(`Error: ${error.message || "Unknown error occurred"}`);
      toast({
        title: "Reset failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoadingReset(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing fields",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(loginEmail, loginPassword);
      toast({ title: "Login successful!", description: "Welcome back!" });

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      onOpenChange(false); // ✅ FIXED: onOpenChange(false)
      navigate(user.role === "admin" ? "/admin-dashboard" : "/orders");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupName || !isValidName(signupName)) {
      toast({
        title: "Invalid name",
        description: "Name must be 2+ characters (letters/spaces only, no numbers/symbols)",
        variant: "destructive",
      });
      return;
    }
    
    if (!signupEmail || !isValidEmail(signupEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!signupPassword || !isStrongPassword(signupPassword)) {
      toast({
        title: "Weak password",
        description: "Password must be 8+ chars with uppercase, number, and special character",
        variant: "destructive",
      });
      return;
    }


    if (signupRole === "admin" && adminKey !== ADMIN_SECRET) {
  toast({
    title: "❌ Invalid Admin Key",
    description: "Contact CircuitAura owner for admin access",
    variant: "destructive",
  });
  return;
}

    try {
      await signup(signupName, signupEmail, signupPassword, signupRole, adminKey);
      toast({
        title: "Signup successful!",
        description: "Account created successfully!",
      });
      onOpenChange(false); // ✅ FIXED: onOpenChange(false)
      navigate(signupRole === "admin" ? "/admin-dashboard" : "/orders");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}> {/* ✅ FIXED: onOpenChange */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to CircuitAura</DialogTitle>
          <DialogDescription>
            Login or create an account to continue
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="button"
                variant="link"
                className="h-auto p-0 text-primary hover:text-primary/80 self-start underline text-sm"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </Button>

              <Button 
                type="submit" 
                className="w-full"
                disabled={!loginEmail || !loginPassword}
              >
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="your name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
                {signupName && (
                  <div className="text-xs mt-1 space-y-0.5">
                    <p className={`text-xs ${isValidName(signupName) ? 'text-green-600' : 'text-destructive'}`}>
                      {isValidName(signupName) ? '✓ Valid name' : '✗ Min 2 chars, letters/spaces only'}
                    </p>
                    {signupName.trim().length < 2 && (
                      <p className="text-xs text-destructive">Min 2 characters</p>
                    )}
                    {!/^[a-zA-Z\s]+$/.test(signupName.trim()) && (
                      <p className="text-xs text-destructive">Letters and spaces only (no numbers/symbols)</p>
                    )}
                    {signupName.trim() === "" && (
                      <p className="text-xs text-destructive">Cannot be blank</p>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
                {signupEmail && (
                  <p className={`text-xs mt-1 ${isValidEmail(signupEmail) ? 'text-green-600' : 'text-destructive'}`}>
                    {isValidEmail(signupEmail) ? '✓ Valid email' : '✗ Invalid email format'}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  minLength={8}
                />
                {signupPassword && (
                  <div className="text-xs mt-1 space-y-1">
                    <p className={`mb-2 ${isStrongPassword(signupPassword) ? 'text-green-600' : 'text-destructive'}`}>
                      {isStrongPassword(signupPassword) ? '✓ Strong password' : '⚠ Weak password - meets all criteria below'}
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
                      <li className={`flex items-center ${signupPassword.length >= 8 ? 'text-green-600' : 'text-destructive'}`}>
                        {signupPassword.length >= 8 ? '✓' : '✗'} Min 8 characters
                      </li>
                      <li className={`flex items-center ${/[A-Z]/.test(signupPassword) ? 'text-green-600' : 'text-destructive'}`}>
                        {/[A-Z]/.test(signupPassword) ? '✓' : '✗'} Uppercase letter (A-Z)
                      </li>
                      <li className={`flex items-center ${/\d/.test(signupPassword) ? 'text-green-600' : 'text-destructive'}`}>
                        {/\d/.test(signupPassword) ? '✓' : '✗'} Number (0-9)
                      </li>
                      <li className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(signupPassword) ? 'text-green-600' : 'text-destructive'}`}>
                        {/[!@#$%^&*(),.?":{}|<>]/.test(signupPassword) ? '✓' : '✗'} Special char
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowRoleField(!showRoleField)}
                className="text-xs"
              >
                {showRoleField ? "Hide" : "Show"} Role Selection 
              </Button>

              {showRoleField && (
  <div className="space-y-3">
    <div>
      <Label htmlFor="signup-role">Role</Label>
      <select
        id="signup-role"
        value={signupRole}
        onChange={(e) => setSignupRole(e.target.value as "user" | "admin")}
        className="w-full rounded-md border border-input bg-background px-3 py-2"
      >
        <option value="user">Customer</option>
        <option value="admin">Admin</option>
      </select>
    </div>
    
    {/* 🔥 ADMIN KEY FIELD - Shows ONLY for Admin */}
    {signupRole === "admin" && (
      <div>
        <Label className="text-sm font-semibold text-red-600">
          🔐 Admin Secret Key <span className="text-xs">*</span>
        </Label>
        <Input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          className="mt-1"
        />
      </div>
    )}
  </div>
)}

              <Button 
                type="submit" 
                className="w-full"
                disabled={!signupName || !isValidName(signupName) || !signupEmail || !isValidEmail(signupEmail) || !signupPassword || !isStrongPassword(signupPassword) || (signupRole === "admin" && adminKey !== ADMIN_SECRET)}
              >
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* FORGOT PASSWORD MODAL */}
        <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>Enter your email. We'll send a reset link.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="your@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              {resetMessage && (
                <p className={`text-sm ${resetMessage.includes('✅') ? 'text-green-600' : 'text-destructive'}`}>
                  {resetMessage}
                </p>
              )}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isLoadingReset || !resetEmail}>
                  {isLoadingReset ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForgotPassword(false)}
                  disabled={isLoadingReset}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
