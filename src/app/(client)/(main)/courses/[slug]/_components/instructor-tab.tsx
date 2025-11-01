import { TeacherType } from "@/schema/user.schema";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";

interface InstructorTabProps {
  instructor: TeacherType;
}

export default function InstructorTab({ instructor }: InstructorTabProps) {
  return (
    <div className="bg-card border border-t-0 border-border rounded-bl-[20px] rounded-br-[20px] p-[25px]">
      <div className="flex gap-[25px] mb-6">
        {/* Instructor Avatar */}
        <div className="relative w-[150px] h-[150px] flex-shrink-0 rounded-full overflow-hidden bg-muted">
          <Image
            src={instructor.avatarUrl || "/placeholder-avatar.jpg"}
            alt={instructor.fullName}
            fill
            sizes="150px"
            className="object-cover"
          />
        </div>

        {/* Instructor Info */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-3">
            {instructor.fullName}
          </h3>
          <p className="text-base text-foreground leading-relaxed mb-3">
            LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best
            WordPress LMS Plugins which can be used to easily create & sell courses online.
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <span>📧 {instructor.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>📱 +1234567890</span>
          </div>
        </div>
      </div>

      <p className="text-base text-foreground leading-relaxed mb-5">
        LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best WordPress
        LMS Plugins which can be used to easily create & sell courses online.
      </p>

      {/* Social Links */}
      <div className="flex items-center gap-4">
        <span className="text-base text-foreground font-medium">Follow:</span>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="size-5 text-muted-foreground hover:text-orange transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="size-5" />
          </a>
          <a
            href="#"
            className="size-5 text-muted-foreground hover:text-orange transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="size-5" />
          </a>
          <a
            href="#"
            className="size-5 text-muted-foreground hover:text-orange transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="size-5" />
          </a>
          <a
            href="#"
            className="size-5 text-muted-foreground hover:text-orange transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="size-5" />
          </a>
          <a
            href="#"
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
