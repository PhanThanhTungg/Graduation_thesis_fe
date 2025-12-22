import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LessonReviewSettingType } from "@/schema/review-space.schema";
import { statusLabels, statusColors } from "@/lib/review-space.constants";
import { formatInterval } from "@/lib/helpers";

interface InformationCardProps {
  setting: LessonReviewSettingType;
}

export function InformationCard({ setting }: InformationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Status</p>
            <Badge
              variant="outline"
              className={statusColors[setting.status] || ""}
            >
              {statusLabels[setting.status] || setting.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Review Step</p>
            <p className="text-sm font-semibold">{setting.reviewStep}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Easiness Factor
            </p>
            <p className="text-sm font-semibold">
              {setting.easinessFactor.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Interval</p>
            <p className="text-sm font-semibold">
              {formatInterval(setting.intervalDays ?? setting.interval ?? 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Lapsed</p>
            <p className="text-sm font-semibold">{setting.lapsed}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
