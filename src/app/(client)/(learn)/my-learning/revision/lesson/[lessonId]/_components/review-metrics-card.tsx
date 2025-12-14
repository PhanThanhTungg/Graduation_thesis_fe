import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LessonReviewSettingType } from "@/schema/review-space.schema";

interface ReviewMetricsCardProps {
  setting: LessonReviewSettingType;
}

export function ReviewMetricsCard({ setting }: ReviewMetricsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Review Step</p>
            <p className="text-lg font-semibold">{setting.reviewStep}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Easiness Factor
            </p>
            <p className="text-lg font-semibold">
              {setting.easinessFactor.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Interval Days</p>
            <p className="text-lg font-semibold">
              {setting.intervalDays}{" "}
              {setting.intervalDays === 1 ? "day" : "days"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Lapsed</p>
            <p className="text-lg font-semibold">{setting.lapsed}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
