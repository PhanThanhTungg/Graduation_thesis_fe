import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface NoteCardProps {
  noteValue: string;
  isUpdating: boolean;
  onNoteChange: (value: string) => void;
  onNoteBlur: () => void;
}

export function NoteCard({
  noteValue,
  isUpdating,
  onNoteChange,
  onNoteBlur,
}: NoteCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Note</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={noteValue}
          onChange={(e) => onNoteChange(e.target.value)}
          onBlur={onNoteBlur}
          placeholder="Add a note for this lesson..."
          className="min-h-32"
          disabled={isUpdating}
        />
      </CardContent>
    </Card>
  );
}
