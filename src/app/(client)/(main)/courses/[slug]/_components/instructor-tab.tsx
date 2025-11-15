import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback } from "@/lib/helpers";
import { TeacherType } from "@/schema/user.schema";
import { Facebook, Linkedin, Youtube, Globe } from "lucide-react";

interface InstructorTabProps {
  instructor: TeacherType;
}

export default function InstructorTab({ instructor }: InstructorTabProps) {
  return (
    <div className="bg-card border border-t-0 border-border rounded-bl-[20px] rounded-br-[20px] p-[25px]">
      <div className="flex gap-[25px] mb-6">
        {/* Instructor Avatar */}
        <Avatar className="size-23">
          <AvatarImage src={instructor.avatarUrl || ""} />
          <AvatarFallback>{getAvatarFallback(instructor.fullName)}</AvatarFallback>
        </Avatar>

        {/* Instructor Info */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-3">
            {instructor.fullName}
          </h3>
          <p className="text-base text-foreground leading-relaxed mb-3">
            {instructor.headline || "This instructor has not provided a headline yet."}
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <span>📧 {instructor.email}</span>
          </div>
        </div>
      </div>

      <p className="text-base text-foreground leading-relaxed mb-5">
        {instructor.bio || "This instructor has not provided a bio yet."}
      </p>

      {/* Social Links */}
      <div className="flex items-center gap-4">
        <span className="text-base text-foreground font-medium">Follow:</span>
        <div className="flex items-center gap-4">
          <a
            href={instructor.website || "#"}
            className="size-5 text-muted-foreground hover:text-orange transition-colors"
            aria-label="Website"
          >
            <Globe className="size-5" />
          </a>
          <a
            href={instructor.facebook || "#"}
            className="size-5 text-muted-foreground hover:text-orange transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="size-5" />
          </a>
          <a
            href={instructor.linkedin || "#"}
            className="size-5 text-muted-foreground hover:text-orange transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="size-5" />
          </a>
          <a
            href={instructor.youtube || "#"}
            className="size-5 text-muted-foreground hover:text-orange transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="size-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
