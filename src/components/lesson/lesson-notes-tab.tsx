"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Trash2 } from "lucide-react";

interface Note {
  id: number;
  timestamp: string;
  content: string;
  createdAt: Date;
}

// interface LessonNotesTabProps {
//   lessonId: number;
// }

export function LessonNotesTab() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      timestamp: "05:30",
      content: "Important point about LearnPress installation process. Make sure to backup database before proceeding.",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: 2,
      timestamp: "12:45",
      content: "Configuration settings for the plugin are crucial for proper functionality.",
      createdAt: new Date("2024-01-15"),
    },
  ]);
  const [newNote, setNewNote] = useState("");
  const [currentTimestamp] = useState("00:00"); // In real app, this would come from video player

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now(),
      timestamp: currentTimestamp,
      content: newNote,
      createdAt: new Date(),
    };

    setNotes([note, ...notes]);
    setNewNote("");
  };

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Add Note Section */}
      <div className="bg-[--color-muted] rounded-lg p-6">
        <h3 className="font-heading text-lg font-semibold mb-4">Add a Note</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-[--color-muted-foreground]">
            <BookOpen className="w-4 h-4" />
            <span>At timestamp: {currentTimestamp}</span>
          </div>
          <Textarea
            placeholder="Write your note here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddNote}
              className="bg-[--color-orange] hover:bg-[--color-orange]/90 text-white"
            >
              Add Note
            </Button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div>
        <h3 className="font-heading text-lg font-semibold mb-4">
          Your Notes ({notes.length})
        </h3>

        {notes.length === 0 ? (
          <div className="text-center py-12 bg-[--color-muted] rounded-lg">
            <BookOpen className="w-12 h-12 mx-auto text-[--color-muted-foreground] mb-3" />
            <p className="text-[--color-muted-foreground]">
              No notes yet. Start taking notes to remember important points!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-[--color-card] border border-[--color-border] rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-[--color-orange]/10 text-[--color-orange] text-sm font-medium rounded">
                      {note.timestamp}
                    </span>
                    <span className="text-sm text-[--color-muted-foreground]">
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[--color-muted-foreground] leading-relaxed">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
