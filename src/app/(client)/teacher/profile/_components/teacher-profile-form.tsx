"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UpdateTeacherProfileType, UpdateTeacherProfileSchema } from "@/schema/user.schema";
import { updateTeacherProfile } from "@/service/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TeacherType } from "@/schema/user.schema";

interface TeacherProfileFormProps {
  teacher: TeacherType;
}

export default function TeacherProfileForm({ teacher }: TeacherProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateTeacherProfileType>({
    resolver: zodResolver(UpdateTeacherProfileSchema),
    defaultValues: {
      bio: teacher.bio ?? "",
      headline: teacher.headline ?? "",
      website: teacher.website ?? "",
      facebook: teacher.facebook ?? "",
      linkedin: teacher.linkedin ?? "",
      youtube: teacher.youtube ?? "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: UpdateTeacherProfileType) => {
    setIsSubmitting(true);
    try {
      await updateTeacherProfile(data);
      reset(data, { keepValues: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="headline" className="text-base">
          Headline
        </Label>
        <Input
          id="headline"
          {...register("headline")}
          placeholder="Enter your professional headline"
          className="h-11 text-base"
          aria-invalid={!!errors.headline}
        />
        {errors.headline && (
          <p className="text-sm text-destructive">{errors.headline.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bio" className="text-base">
          Bio
        </Label>
        <Textarea
          id="bio"
          {...register("bio")}
          placeholder="Tell us about yourself"
          className="min-h-24 text-base resize-none"
          aria-invalid={!!errors.bio}
        />
        {errors.bio && (
          <p className="text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="website" className="text-base">
            Website
          </Label>
          <Input
            id="website"
            type="url"
            {...register("website")}
            placeholder="https://example.com"
            className="h-11 text-base"
            aria-invalid={!!errors.website}
          />
          {errors.website && (
            <p className="text-sm text-destructive">{errors.website.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="facebook" className="text-base">
            Facebook
          </Label>
          <Input
            id="facebook"
            type="url"
            {...register("facebook")}
            placeholder="https://facebook.com/yourprofile"
            className="h-11 text-base"
            aria-invalid={!!errors.facebook}
          />
          {errors.facebook && (
            <p className="text-sm text-destructive">{errors.facebook.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="linkedin" className="text-base">
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            type="url"
            {...register("linkedin")}
            placeholder="https://linkedin.com/in/yourprofile"
            className="h-11 text-base"
            aria-invalid={!!errors.linkedin}
          />
          {errors.linkedin && (
            <p className="text-sm text-destructive">{errors.linkedin.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="youtube" className="text-base">
            YouTube
          </Label>
          <Input
            id="youtube"
            type="url"
            {...register("youtube")}
            placeholder="https://youtube.com/@yourchannel"
            className="h-11 text-base"
            aria-invalid={!!errors.youtube}
          />
          {errors.youtube && (
            <p className="text-sm text-destructive">{errors.youtube.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
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
  );
}

