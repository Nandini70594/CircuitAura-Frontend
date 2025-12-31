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

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

// Validation functions (SIGNUP only)
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

const isValidName = (name: string): boolean => {
  const trimmed = name.trim();
  const minLength = trimmed.length >= 2;
  const onlyLettersSpaces = /^[a-zA-Z\s]+$/.test(trimmed);  // Letters + spaces ONLY
  const hasContent = trimmed !== trimmed.replace(/\s/g, ''); // Not just spaces
  return minLength && onlyLettersSpaces && hasContent;
};

export const AuthModal = ({
  open,
  onClose,
  defaultTab = "login",
}: AuthModalProps) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<"user" | "admin">("user");
  const [showRoleField, setShowRoleField] = useState(false);
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // LOGIN: Only check if fields are filled
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
      onClose();
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
    
    // SIGNUP: Full validation
    if (!signupName || !isValidName(signupName)) {
      toast({
        title: "Invalid name",
        description: "Name must be 2+ characters, letters and spaces only",
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

    try {
      await signup(signupName, signupEmail, signupPassword, signupRole);
      toast({
        title: "Signup successful!",
        description: "Account created successfully!",
      });
      onClose();
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
    <Dialog open={open} onOpenChange={onClose}>
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
                      {isValidName(signupName) ? '✓ Valid name' : '✗ Invalid name format'}
                    </p>
                    {signupName.trim().length < 2 && (
                      <p className="text-xs text-destructive">Min 2 characters</p>
                    )}
                    {signupName.trim() === signupName.trim().replace(/\s/g, '') && (
                      <p className="text-xs text-destructive">Cannot be blank</p>
                    )}
                    {!/^[a-zA-Z\s]+$/.test(signupName.trim()) && (
                      <p className="text-xs text-destructive">Letters and spaces only</p>
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
                {showRoleField ? "Hide" : "Show"} Role Selection (Admin Only)
              </Button>

              {showRoleField && (
                <div>
                  <Label htmlFor="signup-role">Role</Label>
                  <select
                    id="signup-role"
                    value={signupRole}
                    onChange={(e) =>
                      setSignupRole(e.target.value as "user" | "admin")
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={!signupName || !isValidName(signupName) || !signupEmail || !isValidEmail(signupEmail) || !signupPassword || !isStrongPassword(signupPassword)}
              >
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
