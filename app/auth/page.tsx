"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Types for form validation
interface FormData {
  identifier: string;
  password: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  referralCode: string;
}

interface FormErrors {
  identifier?: string;
  password?: string;
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  referralCode?: string;
}

export default function AuthPage() {
  const { login, register, setGuestMode, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
    name: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    referralCode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState("signin");

  // Form validation functions
  const validateIdentifier = (identifier: string): string | undefined => {
    if (!identifier) return "Phone/Email is required";
    // Allow both email and phone number formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      return "Please enter a valid email or phone number";
    }
    return undefined;
  };

  const validatePhoneNumber = (phone: string): string | undefined => {
    if (!phone) return "Phone number is required";

    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");

    // More flexible Kenyan phone number validation
    // Accept: 07XXXXXXXX, 01XXXXXXXX, +254XXXXXXXX, 254XXXXXXXX
    const kenyanPhoneRegex = /^(07|01|\+254|254)[0-9]{8}$/;

    if (!kenyanPhoneRegex.test(cleanPhone)) {
      return "Please enter a valid Kenyan phone number (e.g., 0712345678, +254712345678)";
    }

    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  const validateLastName = (lastName: string): string | undefined => {
    if (!lastName.trim()) return "Last name is required";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return undefined; // Email is optional for registration
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  const validateDob = (dob: string): string | undefined => {
    if (!dob) return undefined; // Date of birth is optional
    return undefined;
  };

  const validateReferralCode = (referralCode: string): string | undefined => {
    if (!referralCode) return undefined; // Referral code is optional
    // Basic validation - alphanumeric, 3-20 characters
    const referralRegex = /^[a-zA-Z0-9]{3,20}$/;
    if (!referralRegex.test(referralCode)) {
      return "Referral code must be 3-20 alphanumeric characters";
    }
    return undefined;
  };

  const validateForm = (isSignUp = false): boolean => {
    const newErrors: FormErrors = {};

    if (isSignUp) {
      // Sign-up validations
      const nameError = validateName(formData.name);
      if (nameError) {
        newErrors.name = nameError;
      }

      const lastNameError = validateLastName(formData.lastName);
      if (lastNameError) {
        newErrors.lastName = lastNameError;
      }

      const emailError = validateEmail(formData.email);
      if (emailError) {
        newErrors.email = emailError;
      }

      const phoneError = validatePhoneNumber(formData.phone);
      if (phoneError) {
        newErrors.phone = phoneError;
      }

      const dobError = validateDob(formData.dob);
      if (dobError) {
        newErrors.dob = dobError;
      }

      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }

      const referralCodeError = validateReferralCode(formData.referralCode);
      if (referralCodeError) {
        newErrors.referralCode = referralCodeError;
      }
    } else {
      // Sign-in validations
      const identifierError = validateIdentifier(formData.identifier);
      if (identifierError) newErrors.identifier = identifierError;

      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(false)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(formData.identifier, formData.password);

      toast({
        title: "Success",
        description: "Successfully signed in!",
      });
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(true)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      const registerData = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        identifier: formData.phone, // Use phone as identifier
        password: formData.password,
        dob: formData.dob,
        referralCode: formData.referralCode,
      };

      await register(registerData);

      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const handleGuestAccess = () => {
    setGuestMode();

    toast({
      title: "Guest Access",
      description: "Welcome! You can explore as a guest.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img
              src="/compass.png"
              alt="Compass Press Logo"
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-gray-900">
              Revision Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Auth Tabs */}
        <Tabs defaultValue="signin" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="guest">Guest</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-identifier">Phone Number or Email</Label>
                <Input
                  id="signin-identifier"
                  type="text"
                  placeholder="0711432437 or email@example.com"
                  value={formData.identifier}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      identifier: e.target.value,
                    }))
                  }
                  className={errors.identifier ? "border-red-500" : ""}
                />
                {errors.identifier && (
                  <p className="text-sm text-red-500">{errors.identifier}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">First Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-lastName">Last Name</Label>
                <Input
                  id="signup-lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone Number</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="0711432437"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-dob">Date of Birth</Label>
                <Input
                  id="signup-dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  className={errors.dob ? "border-red-500" : ""}
                />
                {errors.dob && (
                  <p className="text-sm text-red-500">{errors.dob}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-referral-code">
                  Referral Code (Optional)
                </Label>
                <Input
                  id="signup-referral-code"
                  type="text"
                  placeholder="Enter referral code"
                  value={formData.referralCode}
                  onChange={handleInputChange}
                  name="referralCode"
                  className={errors.referralCode ? "border-red-500" : ""}
                />
                {errors.referralCode && (
                  <p className="text-sm text-red-500">{errors.referralCode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="guest" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Continue as Guest</h3>
                <p className="text-sm text-gray-600">
                  Explore quizzes without creating an account. Some features may
                  be limited.
                </p>
              </div>

              <Button
                onClick={handleGuestAccess}
                className="w-full"
                disabled={isLoading}>
                {isLoading ? "Loading..." : "Continue as Guest"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
