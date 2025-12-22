import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning",
  description: "Your learning progress and activities",
};

export default function LearningPage() {
  return (
    <div className="py-8 container-sm">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Learning</h1>
        <p className="text-muted-foreground">
          Track your learning progress and activities
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-2xl font-semibold text-muted-foreground mb-2">
          Coming Soon
        </p>
        <p className="text-muted-foreground">
          This section is under development
        </p>
      </div>
    </div>
  );
}
