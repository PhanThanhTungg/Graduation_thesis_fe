"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  UserRegisterSchema,
  type UserRegisterType,
} from "@/schema/user.schema";
import { clientRegister } from "@/service/auth.service";
import { countryNames } from "@/schema/country.schema";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { SocialLogin } from "@/components/auth/SocialLogin";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm<UserRegisterType>({
    resolver: zodResolver(UserRegisterSchema),
    mode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "Vietnam",
    },
  });

  const onSubmit = async (data: UserRegisterType) => {
    if (!agreedToTerms) {
      form.setError("email", {
        type: "manual",
        message: "You must agree to the terms and conditions",
      });
      return;
    }

    if (!executeRecaptcha) {
      showToast("error", "reCAPTCHA not loaded yet. Please try again.");
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("register");
      data.recaptchaToken = recaptchaToken;
      await clientRegister(data);
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }
      showToast("error", "reCAPTCHA verification failed. Please try again.");
      console.log("reCAPTCHA error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/50 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-heading text-center">
          Create an Account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your information to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        tabIndex={1}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        tabIndex={2}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          tabIndex={3}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value || "Select your country"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search country..." />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countryNames.map((country) => (
                              <CommandItem
                                key={country}
                                value={country}
                                onSelect={() => {
                                  form.setValue("country", country);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    country === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {country}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        tabIndex={4}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          const confirmPasswordValue =
                            form.getValues("confirmPassword");
                          if (confirmPasswordValue) {
                            form.trigger("confirmPassword");
                          }
                        }}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
                        tabIndex={5}
                        {...field}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked as boolean)
                }
                className="mt-1"
                tabIndex={6}
              />
              <label
                htmlFor="terms"
                className="text-sm font-normal cursor-pointer leading-tight"
                tabIndex={-1}
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-green hover:text-green/80 transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-green hover:text-green/80 transition-colors"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-green hover:bg-green/90 text-white font-medium"
              disabled={form.formState.isSubmitting || !agreedToTerms}
              tabIndex={7}
            >
              {form.formState.isSubmitting
                ? "Creating account..."
                : "Create account"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green hover:text-green/80 underline"
                tabIndex={-1}
                aria-label="Google Privacy Policy (opens in new tab)"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green hover:text-green/80 underline"
                tabIndex={-1}
                aria-label="Google Terms of Service (opens in new tab)"
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <SocialLogin
          disabled={form.formState.isSubmitting}
          startTabIndex={8}
          type="register"
        />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green hover:text-green/80 font-medium transition-colors"
            tabIndex={10}
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
