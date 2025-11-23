"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getStudentsOfCourse } from "@/service/student.service";
import { getMyCourses } from "@/service/course.service";
import type { StudentWithProgressType } from "@/schema/student.schema";

interface CourseDropdownOption {
  id: string;
  title: string;
}

const getProgressColor = (progress: string) => {
  switch (progress) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "not_started":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getProgressLabel = (progress: string) => {
  switch (progress) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In Progress";
    case "not_started":
      return "Not Started";
    default:
      return progress;
  }
};

export default function StudentManagementContent() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<CourseDropdownOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [students, setStudents] = useState<StudentWithProgressType[]>([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(
    null,
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Load courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setCoursesLoading(true);
        const data = await getMyCourses();
        const courseOptions = data.courses.map((course) => ({
          id: String(course.id),
          title: course.title,
        }));

        setCourses(courseOptions);

        // If there are courses, select the first one by default
        if (courseOptions.length > 0) {
          const courseId = searchParams.get("courseId") || courseOptions[0].id;
          setSelectedCourseId(courseId);
        }
        setIsInitialized(true);
      } catch (error) {
        toast.error("Error loading courses list");
        console.error(error);
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, [searchParams]);

  // Load students when course is selected
  useEffect(() => {
    if (!selectedCourseId || !isInitialized) return;

    const loadStudents = async () => {
      try {
        setLoading(true);
        const data = await getStudentsOfCourse({
          courseId: selectedCourseId,
          page: 1,
          limit: 100,
        });

        setStudents(data.students);
        setExpandedStudentId(null);

        // Update URL without full page reload
        const url = new URL(window.location.href);
        url.searchParams.set("courseId", selectedCourseId);
        window.history.replaceState({}, "", url.toString());
      } catch (error) {
        toast.error("Error loading students list");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [selectedCourseId, isInitialized]);

  if (coursesLoading) {
    return (
      <div className="w-full py-12 px-4 md:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="w-full py-12 px-4 md:px-6 lg:px-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You don&apos;t have any courses yet. Please create a course first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <section className="mb-8">
        <h1 className="font-heading font-semibold text-3xl text-foreground mb-2">
          Student Management
        </h1>
        <p className="text-lg text-muted-foreground">
          View student list and their learning progress
        </p>
      </section>

      {/* Course Selection */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Course</CardTitle>
            <CardDescription>
              Choose a course to view the list of students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </section>

      {/* Students Table */}
      {selectedCourseId && (
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Students</CardTitle>
                  <CardDescription>
                    View student list and their learning progress
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : students.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No students have purchased this course yet
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Information</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Lessons</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow
                          key={student.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() =>
                            setExpandedStudentId(
                              expandedStudentId === student.id
                                ? null
                                : student.id,
                            )
                          }
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={student.avatarUrl}
                                  alt={student.fullName}
                                />
                                <AvatarFallback>
                                  {student.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {student.fullName}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {student.email}
                          </TableCell>
                          <TableCell>{student.country}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 transition-all"
                                  style={{
                                    width: `${student.completionPercentage}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {student.completionPercentage}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {student.completedLessons}/{student.totalLessons}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                student.completionPercentage === 100
                                  ? "bg-green-100 text-green-800"
                                  : student.completionPercentage > 0
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {student.completionPercentage === 100
                                ? "Completed"
                                : student.completionPercentage > 0
                                  ? "In Progress"
                                  : "Not Started"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Expanded Student Details */}
                  {expandedStudentId && (
                    <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
                      {students.find((s) => s.id === expandedStudentId) && (
                        <div>
                          <h3 className="font-semibold text-lg mb-4">
                            Progress Details -{" "}
                            {
                              students.find((s) => s.id === expandedStudentId)
                                ?.fullName
                            }
                          </h3>

                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {students
                              .find((s) => s.id === expandedStudentId)
                              ?.lessonProgress.map((lesson, idx) => (
                                <div
                                  key={lesson.lessonId}
                                  className="flex items-center justify-between p-3 bg-background rounded border"
                                >
                                  <div>
                                    <p className="font-medium text-sm">
                                      Lesson {idx + 1}: {lesson.lessonTitle}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {lesson.chapterTitle}
                                    </p>
                                  </div>
                                  <Badge
                                    className={getProgressColor(
                                      lesson.progress,
                                    )}
                                  >
                                    {getProgressLabel(lesson.progress)}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
