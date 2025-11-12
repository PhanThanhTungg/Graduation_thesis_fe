"use client";

import React from "react";
import { Bell, Calendar, User } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  date: Date;
  isNew: boolean;
}

interface LessonAnnouncementsTabProps {
  courseId: number;
}

export function LessonAnnouncementsTab({ courseId }: LessonAnnouncementsTabProps) {
  // Mock data - in real app, fetch from API
  const announcements: Announcement[] = [
    {
      id: 1,
      title: "Welcome to the Course!",
      content:
        "Welcome to the LearnPress course! I'm excited to have you here. Throughout this course, we'll cover everything you need to know about building LMS websites. Don't hesitate to ask questions in the discussion section.",
      author: "Determined-Poitras",
      date: new Date("2024-01-10"),
      isNew: true,
    },
    {
      id: 2,
      title: "New Resources Added",
      content:
        "I've just added new downloadable resources to Section 2. These include templates and cheat sheets that will help you follow along with the lessons more easily. Check them out!",
      author: "Determined-Poitras",
      date: new Date("2024-01-08"),
      isNew: true,
    },
    {
      id: 3,
      title: "Office Hours This Week",
      content:
        "I'll be hosting live office hours this Thursday at 3 PM EST. This is a great opportunity to ask questions and get personalized feedback on your projects. Meeting link will be shared via email.",
      author: "Determined-Poitras",
      date: new Date("2024-01-05"),
      isNew: false,
    },
    {
      id: 4,
      title: "Course Update - New Section Added",
      content:
        "Based on student feedback, I've added a new bonus section covering advanced customization techniques. This section is now available in the curriculum. Existing students get free access!",
      author: "Determined-Poitras",
      date: new Date("2023-12-28"),
      isNew: false,
    },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return formatDate(date);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-semibold mb-2">Course Announcements</h2>
        <p className="text-[--color-muted-foreground]">
          Stay updated with the latest news and updates from your instructor
        </p>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-12 bg-[--color-muted] rounded-lg">
          <Bell className="w-12 h-12 mx-auto text-[--color-muted-foreground] mb-3" />
          <p className="text-[--color-muted-foreground]">
            No announcements yet. Check back later for updates!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-[--color-card] border border-[--color-border] rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-heading text-lg font-semibold">
                      {announcement.title}
                    </h3>
                    {announcement.isNew && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-[--color-orange] text-white text-xs font-medium rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[--color-muted-foreground]">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{announcement.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{getTimeAgo(announcement.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[--color-muted-foreground] leading-relaxed">
                {announcement.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
