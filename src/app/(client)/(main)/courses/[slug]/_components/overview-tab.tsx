import { ExtendedCourseType } from "@/schema/course.schema";
import { Check, MessageCircleQuestionMark, PartyPopper } from "lucide-react";

export default function OverviewTab({ course }: { course: ExtendedCourseType }) {
  return (
    <div className="bg-card border border-t-0 border-border rounded-bl-[20px] rounded-br-[20px] p-[25px]">
      <div className="prose max-w-none">
        <p className="text-base text-foreground leading-relaxed">
          {course.courseDescription.detail}
        </p>

        <h5 className="mt-4 font-semibold">What will you be learned?</h5>
        {course.courseDescription.targetKnowledges?.map((item, index) => (
          <p className="text-base text-foreground leading-relaxed ml-2 flex items-center gap-2 font-sm" key={index}>
            <PartyPopper className="text-orange size-5" /> {item}
          </p>
        ))}

        <h5 className="mt-4 font-semibold">Requirements</h5>
        {course.courseDescription.requirements?.map((item, index) => (
          <p className="text-base text-foreground leading-relaxed ml-2 flex items-center gap-2 font-sm" key={index}>
            <MessageCircleQuestionMark className="text-peach size-5" /> {item}
          </p>
        ))}

        <h5 className="mt-4 font-semibold">Who should take this course?</h5>
        {course.courseDescription.suitableParticipants?.map((item, index) => (
          <p className="text-base text-foreground leading-relaxed ml-2 flex items-center gap-2 font-sm" key={index}>
            <Check className="text-green size-5"/> {item}
          </p>
        ))}
      </div>
    </div>
  );
}
