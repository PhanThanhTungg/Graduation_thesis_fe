"use client";

import { useEffect, useState } from "react";
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
          const courseId = courseOptions[0].id;
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
  }, []);

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
    <div className="w-full bg-gradient-to-br from-violet/5 via-background to-mint/5 min-h-screen">
      <div className="px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet to-green bg-clip-text text-transparent mb-2">
            Student Management
          </h1>
          <p className="text-muted-foreground text-base">
            Monitor student progress and learning activity across your courses
          </p>
        </div>

        {/* Course Selection */}
        <div className="mb-6">
          <Card className="border-0 shadow-sm bg-white/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Select Course</CardTitle>
              <CardDescription>
                Choose a course to view enrolled students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedCourseId}
                onValueChange={setSelectedCourseId}
              >
                <SelectTrigger className="w-full md:w-96">
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
        </div>

        {/* Students Table */}
        {selectedCourseId && (
          <div>
            <Card className="border-0 shadow-sm bg-white/50 backdrop-blur">
              <CardContent className="pt-6">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full rounded" />
                    <Skeleton className="h-12 w-full rounded" />
                    <Skeleton className="h-12 w-full rounded" />
                    <Skeleton className="h-12 w-full rounded" />
                  </div>
                ) : students.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No students enrolled in this course yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-b-2">
                            <TableHead className="font-semibold w-12">
                              No.
                            </TableHead>
                            <TableHead className="font-semibold">
                              Student
                            </TableHead>
                            <TableHead className="font-semibold">
                              Email
                            </TableHead>
                            <TableHead className="font-semibold">
                              Location
                            </TableHead>
                            <TableHead className="font-semibold text-center">
                              Progress
                            </TableHead>
                            <TableHead className="font-semibold text-center">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student, index) => (
                            <TableRow
                              key={student.id}
                              className="cursor-pointer hover:bg-muted/30 transition-colors"
                              onClick={() =>
                                setExpandedStudentId(
                                  expandedStudentId === student.id
                                    ? null
                                    : student.id,
                                )
                              }
                            >
                              <TableCell className="font-medium text-sm text-muted-foreground w-12">
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage
                                      src={student.avatarUrl}
                                      alt={student.fullName}
                                    />
                                    <AvatarFallback className="text-xs font-semibold">
                                      {student.fullName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">
                                      {student.fullName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Joined{" "}
                                      {new Date(
                                        student.createdAt,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {student.email}
                              </TableCell>
                              <TableCell className="text-sm">
                                {student.country}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 justify-center">
                                  <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                                      style={{
                                        width: `${student.completionPercentage}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm font-semibold text-foreground min-w-10">
                                    {student.completionPercentage}%
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  className={`text-xs font-medium ${
                                    student.completionPercentage === 100
                                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                                      : student.completionPercentage > 0
                                        ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                  }`}
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
                    </div>

                    {/* Expanded Student Details */}
                    {expandedStudentId && (
                      <div className="mt-6 p-6 bg-muted/40 rounded-lg border border-muted-foreground/10">
                        {students.find((s) => s.id === expandedStudentId) && (
                          <div>
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={
                                    students.find(
                                      (s) => s.id === expandedStudentId,
                                    )?.avatarUrl
                                  }
                                  alt={
                                    students.find(
                                      (s) => s.id === expandedStudentId,
                                    )?.fullName
                                  }
                                />
                                <AvatarFallback>
                                  {students
                                    .find((s) => s.id === expandedStudentId)
                                    ?.fullName.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">
                                  Lesson Progress -{" "}
                                  {
                                    students.find(
                                      (s) => s.id === expandedStudentId,
                                    )?.fullName
                                  }
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {students.find(
                                    (s) => s.id === expandedStudentId,
                                  )?.completedLessons || 0}
                                  /
                                  {students.find(
                                    (s) => s.id === expandedStudentId,
                                  )?.totalLessons || 0}{" "}
                                  lessons completed
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 max-h-96 overflow-y-auto">
                              {students
                                .find((s) => s.id === expandedStudentId)
                                ?.lessonProgress.map((lesson, idx) => (
                                  <div
                                    key={lesson.lessonId}
                                    className="flex items-center justify-between p-3 bg-background rounded border hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">
                                        {idx + 1}. {lesson.lessonTitle}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {lesson.chapterTitle}
                                      </p>
                                    </div>
                                    <Badge
                                      className={`text-xs font-medium ${getProgressColor(lesson.progress)}`}
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
          </div>
        )}
      </div>
    </div>
  );
}
