"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryNames } from "@/schema/country.schema";
import { UpdateUserBodySchema, UpdateUserBodyType, UserType } from "@/schema/user.schema";
import { updateUserInfo } from "@/service/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { sendVerificationEmail } from "@/service/auth.service";
import { promoteToTeacher } from "@/service/user.service";
import { showToast } from "@/lib/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  user: UserType;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingVerify, setIsSendingVerify] = useState(false);
  const [verifyCooldown, setVerifyCooldown] = useState(0);
  const [isPromoting, setIsPromoting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    watch,
  } = useForm<UpdateUserBodyType>({
    resolver: zodResolver(UpdateUserBodySchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      country: user.country,
      role: user.role,
    },
    mode: "onChange",
  });


  const onSubmit = async (data: UpdateUserBodyType) => {
    setIsSubmitting(true);
    try {
      await updateUserInfo(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    if (verifyCooldown <= 0) return;
    const timer = setInterval(() => {
      setVerifyCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [verifyCooldown]);

  const handleSendVerification = async () => {
    if (verifyCooldown > 0 || isSendingVerify) return;
    setIsSendingVerify(true);
    try {
      await sendVerificationEmail();
      setVerifyCooldown(60);
    } finally {
      setIsSendingVerify(false);
    }
  };

  return (
    <div className="container-md py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="font-heading font-semibold text-3xl text-foreground mb-2">
              My Profile
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your personal information and preferences
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 p-8 border border-border rounded-2xl bg-card">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="size-24">
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName} />
                    <AvatarFallback className="text-2xl font-semibold bg-muted">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    className="absolute inset-0 flex items-center justify-center bg-foreground/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="size-6 text-background" />
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-1">
                    Profile Picture
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload a new avatar or update your current one
                  </p>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-sm"
                    >
                      Upload Image
                    </Button>
                    {user.avatarUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-sm text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-8 border border-border rounded-2xl bg-card">
              <h3 className="font-heading font-semibold text-xl text-foreground">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fullName" className="text-base">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    placeholder="Enter your full name"
                    className="h-11 text-base"
                    aria-invalid={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-base">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    className="h-11 text-base"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="country" className="text-base">
                    Country <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger 
                          id="country" 
                          className="h-11 w-full text-base"
                          aria-invalid={!!errors.country}
                        >
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {countryNames.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.country && (
                    <p className="text-sm text-destructive">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-base">Role</Label>
                  <div className="h-11 px-4 flex items-center rounded-md border border-input bg-background text-base capitalize">
                    {user.role}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-8 border border-border rounded-2xl bg-card">
              <h3 className="font-heading font-semibold text-xl text-foreground">
                Account Status
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-base text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-2.5 rounded-full ${
                        user.status === "active"
                          ? "bg-green"
                          : user.status === "inactive"
                          ? "bg-yellow"
                          : "bg-destructive"
                      }`}
                    />
                    <span className="text-base font-medium capitalize">
                      {user.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-base text-muted-foreground">
                    Email Verified
                  </Label>
                  <div className="flex items-center gap-2">
                {user.emailVerified ? (
                  <>
                    <div className="size-2.5 rounded-full bg-green" />
                    <span className="text-base font-medium">Verified</span>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-sm"
                    onClick={handleSendVerification}
                    disabled={verifyCooldown > 0 || isSendingVerify}
                  >
                    {isSendingVerify ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : verifyCooldown > 0 ? (
                      `Resend in ${verifyCooldown}s`
                    ) : (
                      'Verify'
                    )}
                  </Button>
                )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-base text-muted-foreground">User ID</Label>
                  <span className="text-sm font-mono">
                    {user.id.slice(0, 12)}...
                  </span>
                </div>
              </div>

              {!user.emailVerified && (
                <div className="p-4 bg-yellow/10 border border-yellow/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Email not verified.</strong> Please check your inbox and verify your email address to unlock all features.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label className="text-base text-muted-foreground">Teacher</Label>
                {user.role === 'student' ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 px-6 text-base"
                    onClick={async () => {
                      if (!user.emailVerified) {
                        showToast('error', 'Please verify your email first');
                        return;
                      }
                      setIsPromoting(true);
                      try {
                        const ok = await promoteToTeacher(user);
                        if (ok) {
                          router.push('/teacher/dashboard');
                        }
                      } finally {
                        setIsPromoting(false);
                      }
                    }}
                    disabled={isPromoting}
                  >
                    {isPromoting ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Become a teacher'
                    )}
                  </Button>
                ) : (
                  <Link href="/teacher/dashboard">
                    <Button type="button" variant="outline" className="h-11 px-6 text-base">
                      Go to teacher dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-11 px-6 text-base"
                disabled={!isDirty || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 px-6 text-base bg-green hover:bg-green/90 text-white"
                disabled={!isDirty || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
