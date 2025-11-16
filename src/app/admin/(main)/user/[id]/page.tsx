"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getUserById } from "@/service/admin/user.service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  IconArrowLeft,
  IconMail,
  IconMapPin,
  IconCalendar,
  IconCheck,
  IconX,
  IconWorld,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconBook,
  IconUsers,
  IconCurrencyDollar,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { formatDateToString } from "@/lib/helpers"
import Image from "next/image"

type UserDetail = {
  id: string
  name: string
  email: string
  role: "teacher" | "student"
  emailVerified: boolean
  avatarUrl: string | null
  status: "active" | "inactive" | "banned"
  country: string
  createdAt: string
  updatedAt: string
  teacherSettings?: {
    id: string
    bio: string | null
    headline: string | null
    website: string | null
    facebook: string | null
    linkedin: string | null
    youtube: string | null
  } | null
  courses?: Array<{
    id: string
    title: string
    thumbnailUrl: string | null
    price: number
    countStudent: number
    isPublished: boolean
    slug: string
    category: {
      id: string
      name: string
    } | null
    createdAt: string
  }>
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    case "banned":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "teacher":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "student":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const data = await getUserById(userId)
        setUser(data)
      } catch (error) {
        toast.error("Failed to load user details")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-lg text-muted-foreground">User not found</p>
        <Button onClick={() => router.push("/admin/user")}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>
    )
  }

  const capitalizeWords = (str: string) => str.replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/admin/user")}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-3xl">{user.name}</CardTitle>
                <Badge variant="outline" className={getRoleColor(user.role)}>
                  {capitalizeWords(user.role)}
                </Badge>
                <Badge variant="outline" className={getStatusColor(user.status)}>
                  {capitalizeWords(user.status)}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-4 text-base">
                <span className="flex items-center gap-1">
                  <IconMail className="h-4 w-4" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  {user.emailVerified ? (
                    <>
                      <IconCheck className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Email Verified</span>
                    </>
                  ) : (
                    <>
                      <IconX className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-600">Email Not Verified</span>
                    </>
                  )}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <IconMapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Country:</span>
              <span className="font-medium">{user.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconCalendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Joined:</span>
              <span className="font-medium">
                {formatDateToString(user.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IconCalendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="font-medium">
                {formatDateToString(user.updatedAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Details */}
      {user.role === "teacher" && (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="courses">Courses ({user.courses?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            {user.teacherSettings ? (
              <>
                {/* Headline & Bio */}
                {(user.teacherSettings.headline || user.teacherSettings.bio) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {user.teacherSettings.headline && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Headline</p>
                          <p className="text-lg font-medium">{user.teacherSettings.headline}</p>
                        </div>
                      )}
                      {user.teacherSettings.bio && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Bio</p>
                          <p className="text-base leading-relaxed">{user.teacherSettings.bio}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Social Links */}
                {(user.teacherSettings.website ||
                  user.teacherSettings.facebook ||
                  user.teacherSettings.linkedin ||
                  user.teacherSettings.youtube) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {user.teacherSettings.website && (
                          <a
                            href={user.teacherSettings.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                          >
                            <IconWorld className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium">Website</span>
                          </a>
                        )}
                        {user.teacherSettings.facebook && (
                          <a
                            href={user.teacherSettings.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                          >
                            <IconBrandFacebook className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium">Facebook</span>
                          </a>
                        )}
                        {user.teacherSettings.linkedin && (
                          <a
                            href={user.teacherSettings.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                          >
                            <IconBrandLinkedin className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium">LinkedIn</span>
                          </a>
                        )}
                        {user.teacherSettings.youtube && (
                          <a
                            href={user.teacherSettings.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                          >
                            <IconBrandYoutube className="h-5 w-5 text-red-600" />
                            <span className="text-sm font-medium">YouTube</span>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No teacher profile information available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            {user.courses && user.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.courses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      {course.thumbnailUrl ? (
                        <Image
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          fill
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <IconBook className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="secondary"
                          className={
                            course.isPublished
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                          }
                        >
                          {course.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                      {course.category && (
                        <CardDescription>
                          <Badge variant="outline" className="text-xs">
                            {course.category.name}
                          </Badge>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <IconUsers className="h-4 w-4" />
                          <span>{course.countStudent} students</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-primary">
                          <IconCurrencyDollar className="h-4 w-4" />
                          <span>{course.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <p className="text-xs text-muted-foreground">
                        Created at: {formatDateToString(course.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <IconBook className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No courses found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Student View */}
      {user.role === "student" && (
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Basic student account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <IconUsers className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                This is a student account. Enrollment and progress data will be displayed here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
