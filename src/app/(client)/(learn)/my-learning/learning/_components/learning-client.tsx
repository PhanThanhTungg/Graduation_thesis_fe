"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLessonChapterTree } from "@/service/lesson.service";
import { CourseType } from "@/schema/course.schema";
import { QuestionGenerationCard } from "./question-generation-card";
import { Loader2 } from "lucide-react";

interface LearningClientProps {
  initialCourses: CourseType[];
}

type ChapterWithLessons = {
  id: string;
  title: string;
  slug: string;
  position: number;
  lessons: {
    id: string;
    title: string;
    slug: string;
    position: number;
  }[];
};

export default function LearningClient({
  initialCourses,
}: LearningClientProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedLessonSlug, setSelectedLessonSlug] = useState<string>("");
  const [chapters, setChapters] = useState<ChapterWithLessons[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);

  const selectedCourse = initialCourses.find(
    (c) => c.id.toString() === selectedCourseId,
  );

  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedCourse?.slug) {
        setChapters([]);
        setSelectedLessonSlug("");
        return;
      }

      try {
        setIsLoadingLessons(true);
        const chapterTree = await getLessonChapterTree(selectedCourse.slug);

        const flattenChapters = (
          chapters: typeof chapterTree,
          parentPath: string = "",
        ): ChapterWithLessons[] => {
          const result: ChapterWithLessons[] = [];

          chapters.forEach((chapter) => {
            const chapterPath = parentPath
              ? `${parentPath} > ${chapter.title}`
              : chapter.title;

            result.push({
              id: chapter.id,
              title: chapterPath,
              slug: chapter.slug,
              position: chapter.position,
              lessons: chapter.lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                slug: lesson.slug,
                position: lesson.position,
              })),
            });

            if (chapter.children && chapter.children.length > 0) {
              const childChapters = flattenChapters(
                chapter.children,
                chapterPath,
              );
              result.push(...childChapters);
            }
          });

          return result;
        };

        const formattedChapters = flattenChapters(chapterTree);
        setChapters(formattedChapters);
        setSelectedLessonSlug("");
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        setChapters([]);
      } finally {
        setIsLoadingLessons(false);
      }
    };

    fetchLessons();
  }, [selectedCourse?.slug]);

  const allLessons = chapters.flatMap((chapter) =>
    chapter.lessons.map((lesson) => ({
      ...lesson,
      chapterTitle: chapter.title,
    })),
  );

  const selectedLesson = allLessons.find((l) => l.slug === selectedLessonSlug);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                value={selectedCourseId}
                onValueChange={setSelectedCourseId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {initialCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              {isLoadingLessons ? (
                <div className="flex items-center gap-2 text-muted-foreground h-10">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading lessons...</span>
                </div>
              ) : (
                <Select
                  value={selectedLessonSlug}
                  onValueChange={setSelectedLessonSlug}
                  disabled={!selectedCourse}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a lesson" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map((chapter) =>
                      chapter.lessons.map((lesson) => (
                        <SelectItem key={lesson.id} value={lesson.slug}>
                          {chapter.title} - {lesson.title}
                        </SelectItem>
                      )),
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedLesson && selectedCourse && (
        <QuestionGenerationCard
          lessonSlug={selectedLessonSlug}
          courseSlug={selectedCourse.slug}
          lessons={allLessons}
        />
      )}
    </div>
  );
}
