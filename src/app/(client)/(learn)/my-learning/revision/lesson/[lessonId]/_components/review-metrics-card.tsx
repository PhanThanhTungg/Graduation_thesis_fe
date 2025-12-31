import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LessonReviewSettingType } from "@/schema/review-space.schema";
import { formatInterval } from "@/lib/helpers";

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
            <p className="text-sm text-muted-foreground mb-2">Interval</p>
            <p className="text-lg font-semibold">
              {formatInterval(setting.intervalDays ?? setting.interval ?? 0)}
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
