import { Metadata } from "next";
import { getCourseBySlugTeacherArea } from "@/service/course.service";
import { getLessonBySlug } from "@/service/lesson.service";
import { notFound } from "next/navigation";
import BreadcrumbCustom, { BreadcrumbProps } from "@/components/custom/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/helpers";
import { UploadVideo } from "./_components/upload-video";

interface LessonDetailPageProps {
  params: Promise<{
    slug: string;
    chapterslug: string;
    lessonslug: string;
  }>;
}

export const metadata: Metadata = {
  title: "Lesson Detail - Teacher Space",
  description: "View and edit lesson details",
};

export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
  const { slug, chapterslug, lessonslug } = await params;

  let course;
  try {
    course = await getCourseBySlugTeacherArea(slug);
  } catch (error) {
    console.error("Failed to fetch course:", error);
    notFound();
  }

  if (!course) {
    notFound();
  }

  let lesson;
  try {
    lesson = await getLessonBySlug(lessonslug);
    
    if (lesson.chapter.slug !== chapterslug || lesson.chapter.course.slug !== slug) {
      notFound();
    }
  } catch (error) {
    console.error("Failed to fetch lesson:", error);
    notFound();
  }

  if (!lesson) {
    notFound();
  }

  const breadcrumbData: BreadcrumbProps[] = [
    { url: "/teacher", label: "Teacher" },
    { url: "/teacher/courses", label: "Courses" },
    { url: `/teacher/courses/${course.slug}`, label: course.title },
    { url: `/teacher/courses/${slug}/chapter/${chapterslug}`, label: lesson.chapter.title },
    { url: undefined, label: lesson.title },
  ];

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <>
      <BreadcrumbCustom breadcrumb={breadcrumbData} />
      <section className="w-full px-6 py-8 bg-gradient-to-br from-violet/5 via-background to-mint/5">
        <div className="container-md space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet to-green bg-clip-text text-transparent">
              Lesson Details
            </h1>
            <p className="text-muted-foreground mt-1">Manage your lesson information</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lesson.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p className="text-sm">{lesson.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Position</h3>
                  <p className="text-sm">{lesson.position}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Created At</h3>
                  <p className="text-sm">{formatDate(lesson.createdAt)}</p>
                </div>

                {lesson.updatedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Updated At</h3>
                    <p className="text-sm">{formatDate(lesson.updatedAt)}</p>
                  </div>
                )}
              </div>

              {lesson.videoLesson && (
                <UploadVideo
                  lessonId={lesson.id}
                  currentVideoId={lesson.videoLesson?.videoId || null}
                  currentEmbedUrl={lesson.videoLesson?.embedUrl || null}
                />
              )}

              {lesson.files && lesson.files.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Files</h3>
                  <div className="space-y-2">
                    {lesson.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.fileSize / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green hover:underline"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

