"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Trash2, Edit2, X, Check, Loader2 } from "lucide-react";
import { AddNoteForm } from "./add-note-form";
import { getNotesByLessonId, createNote, updateNote, deleteNote } from "@/service/note.service";
import { NoteType, CreateNoteBodyType, UpdateNoteBodyType } from "@/schema/note.schema";
import { formatTimeMinute, formatTimeAgo } from "@/lib/helpers";
import { showToast } from "@/lib/toast";

interface LessonNotesTabProps {
  lessonId: number | string;
}

export function LessonNotesTab({ lessonId }: LessonNotesTabProps) {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editMinutes, setEditMinutes] = useState("");
  const [editSeconds, setEditSeconds] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      const result = await getNotesByLessonId(String(lessonId));
      
      if (result) {
        setNotes(result.notes);
      }
      setIsLoading(false);
    };

    fetchNotes();
  }, [lessonId]);

  const handleAddNote = async (data: CreateNoteBodyType) => {
    const result = await createNote(data);

    if (result) {
      // Add new note to state without re-fetching
      const newNote: NoteType = {
        id: result.id,
        userId: result.userId,
        lessonId: result.lessonId,
        content: result.content,
        timestamp: result.timestamp,
        createdAt: result.createdAt,
      };
      setNotes((prev) => [newNote, ...prev]);
      showToast("success", "Note added successfully");
    }
  };

  const handleStartEdit = (note: NoteType) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
    const minutes = Math.floor(note.timestamp / 60);
    const seconds = note.timestamp % 60;
    setEditMinutes(minutes.toString());
    setEditSeconds(seconds.toString());
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditContent("");
    setEditMinutes("");
    setEditSeconds("");
  };

  const handleSaveEdit = async (noteId: string) => {
    if (!editContent.trim()) {
      showToast("warning", "Note content cannot be empty");
      return;
    }

    const min = parseInt(editMinutes) || 0;
    const sec = parseInt(editSeconds) || 0;
    const timestamp = min * 60 + sec;

    setIsSaving(true);
    const updateData: UpdateNoteBodyType = {
      content: editContent.trim(),
      timestamp,
    };

    const result = await updateNote(noteId, updateData);
    setIsSaving(false);

    if (result) {
      // Update note in state without re-fetching
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId
            ? { ...note, content: result.content, timestamp: result.timestamp }
            : note
        )
      );
      showToast("success", "Note updated successfully");
      handleCancelEdit();
    }
  };

  const handleDeleteClick = (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;

    const success = await deleteNote(noteToDelete);

    if (success) {
      // Remove note from state without re-fetching
      setNotes((prev) => prev.filter((note) => note.id !== noteToDelete));
      showToast("success", "Note deleted successfully");
    }
    
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange" />
          <p className="text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Add Note Form */}
      <AddNoteForm lessonId={String(lessonId)} onSubmit={handleAddNote} />

      {/* Notes List */}
      <div>
        <h3 className="font-heading text-lg font-semibold mb-4">
          Your Notes ({notes.length})
        </h3>

        {notes.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No notes yet. Start taking notes to remember important points!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                {editingNoteId === note.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Timestamp</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          placeholder="MM"
                          value={editMinutes}
                          onChange={(e) => setEditMinutes(e.target.value)}
                          className="w-20 text-center"
                          disabled={isSaving}
                        />
                        <span className="text-muted-foreground">:</span>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          placeholder="SS"
                          value={editSeconds}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            if (val >= 60) {
                              setEditSeconds("59");
                            } else {
                              setEditSeconds(e.target.value);
                            }
                          }}
                          className="w-20 text-center"
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Content</Label>
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="resize-none"
                        disabled={isSaving}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(note.id)}
                        disabled={isSaving}
                        className="bg-orange hover:bg-orange/90"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-orange/10 text-orange text-sm font-medium rounded">
                          {formatTimeMinute(note.timestamp)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(note.createdAt)}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(note)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(note.id)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
