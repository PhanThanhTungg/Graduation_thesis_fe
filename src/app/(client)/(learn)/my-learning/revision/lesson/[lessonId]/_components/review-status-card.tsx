import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { LessonReviewSettingType } from "@/schema/review-space.schema";
import { statusLabels, statusColors } from "@/lib/review-space.constants";

interface ReviewStatusCardProps {
  setting: LessonReviewSettingType;
  isUpdating: boolean;
  onToggleReviewEnabled: (checked: boolean) => void;
}

export function ReviewStatusCard({
  setting,
  isUpdating,
  onToggleReviewEnabled,
}: ReviewStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <p className="text-sm text-muted-foreground mb-2">Review Enabled</p>
            <Switch
              checked={setting.reviewEnabled}
              onCheckedChange={onToggleReviewEnabled}
              disabled={isUpdating}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
