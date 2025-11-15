"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { IconPlus, IconTrash, IconUpload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CreateCourseBodySchema, ExtendedCourseType } from "@/schema/course.schema"
import { CategoryType } from "@/schema/category.schema"
import { z } from "zod"
import { showToast } from "@/lib/toast"
import { createCourse, getCourseById } from "@/service/course.service"
import { uploadImages } from "@/service/upload.service"
import { CategoryTreeSelect } from "@/components/custom/category-tree-select"

type CreateCourseFormValues = z.infer<typeof CreateCourseBodySchema>

interface CreateCourseFormProps {
  categories: CategoryType[]
  onSuccess?: (course: ExtendedCourseType) => void
}

export function CreateCourseForm({ categories, onSuccess }: CreateCourseFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const form = useForm<CreateCourseFormValues>({
    resolver: zodResolver(CreateCourseBodySchema),
    defaultValues: {
      title: "",
      price: 0,
      categoryId: "",
      courseDescription: {
        headline: "",
        targetKnowledges: [""],
        requirements: [""],
        suitableParticipants: [""],
        detail: "",
      },
    },
    mode: "onChange",
  })

  // Handle file upload preview
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("thumbnailUrl", file, { shouldValidate: true })
    }
  }

  // Array field helpers
  const addArrayField = (fieldName: "targetKnowledges" | "requirements" | "suitableParticipants") => {
    const currentValues = form.getValues(`courseDescription.${fieldName}`) || []
    form.setValue(`courseDescription.${fieldName}`, [...currentValues, ""], {
      shouldValidate: true,
    })
  }

  const removeArrayField = (
    fieldName: "targetKnowledges" | "requirements" | "suitableParticipants",
    index: number
  ) => {
    const currentValues = form.getValues(`courseDescription.${fieldName}`) || []
    const newValues = currentValues.filter((_, i) => i !== index)
    form.setValue(`courseDescription.${fieldName}`, newValues, {
      shouldValidate: true,
    })
  }

  const updateArrayField = (
    fieldName: "targetKnowledges" | "requirements" | "suitableParticipants",
    index: number,
    value: string
  ) => {
    const currentValues = form.getValues(`courseDescription.${fieldName}`) || []
    const newValues = [...currentValues]
    newValues[index] = value
    form.setValue(`courseDescription.${fieldName}`, newValues, {
      shouldValidate: true,
    })
  }

  const onSubmit = async (data: CreateCourseFormValues) => {
    setIsLoading(true)
    try {
      let thumbnailUrl: string | undefined = undefined;

      if (data.thumbnailUrl instanceof File) {
        const formData = new FormData();
        formData.append("files", data.thumbnailUrl);
        const urls = await uploadImages(formData);
        if (urls.length > 0) {
          thumbnailUrl = urls[0];
        }
      } else if (typeof data.thumbnailUrl === "string") {
        thumbnailUrl = data.thumbnailUrl;
      }

      const response = await createCourse({
        ...data,
        thumbnailUrl,
      });

      const createdCourse = response.data.createdCourse as { id: number };
      if (!createdCourse || !createdCourse.id) {
        throw new Error("Failed to get course ID from response");
      }
      
      const fullCourse = await getCourseById(String(createdCourse.id));

      showToast("success", "Course created successfully!");
      form.reset();
      setThumbnailPreview(null);
      
      if (onSuccess) {
        onSuccess(fullCourse);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create course";
      showToast("error", errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details about your course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Introduction to React"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a clear and descriptive title for your course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>Course price in USD</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <CategoryTreeSelect
                        categories={categories}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select a category"
                      />
                    </FormControl>
                    <FormDescription>
                      Choose the main category for your course (only leaf categories can be selected)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => {
                const { value, onChange, ...restField } = field;
                return (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          {...restField}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label htmlFor="thumbnail-upload">
                          <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                            asChild
                          >
                            <span>
                              <IconUpload className="mr-2 h-4 w-4" />
                              Upload Thumbnail
                            </span>
                          </Button>
                        </label>
                      </div>
                      {thumbnailPreview && (
                        <div className="relative w-full max-w-md">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an image for your course (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
                );
              }}
            />
          </CardContent>
        </Card>

        {/* Course Description */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Course Description</CardTitle>
            <CardDescription>
              Provide detailed information about your course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="courseDescription.headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A brief headline for your course"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseDescription.detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of your course..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Knowledges */}
            <div className="space-y-2">
              <FormLabel>Target Knowledges</FormLabel>
              <FormDescription>
                What will students learn from this course?
              </FormDescription>
              {form.watch("courseDescription.targetKnowledges")?.map((_, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={form.watch(`courseDescription.targetKnowledges.${index}`)}
                    onChange={(e) =>
                      updateArrayField("targetKnowledges", index, e.target.value)
                    }
                    placeholder={`Target knowledge ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayField("targetKnowledges", index)}
                    disabled={
                      form.watch("courseDescription.targetKnowledges")?.length === 1
                    }
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayField("targetKnowledges")}
                className="w-full"
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Add Target Knowledge
              </Button>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <FormLabel>Requirements</FormLabel>
              <FormDescription>
                What prerequisites are needed for this course?
              </FormDescription>
              {form.watch("courseDescription.requirements")?.map((_, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={form.watch(`courseDescription.requirements.${index}`)}
                    onChange={(e) =>
                      updateArrayField("requirements", index, e.target.value)
                    }
                    placeholder={`Requirement ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayField("requirements", index)}
                    disabled={
                      form.watch("courseDescription.requirements")?.length === 1
                    }
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayField("requirements")}
                className="w-full"
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Add Requirement
              </Button>
            </div>

            {/* Suitable Participants */}
            <div className="space-y-2">
              <FormLabel>Suitable Participants</FormLabel>
              <FormDescription>
                Who is this course best suited for?
              </FormDescription>
              {form.watch("courseDescription.suitableParticipants")?.map((_, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={form.watch(`courseDescription.suitableParticipants.${index}`)}
                    onChange={(e) =>
                      updateArrayField("suitableParticipants", index, e.target.value)
                    }
                    placeholder={`Target audience ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayField("suitableParticipants", index)}
                    disabled={
                      form.watch("courseDescription.suitableParticipants")?.length === 1
                    }
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayField("suitableParticipants")}
                className="w-full"
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Add Participant Type
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
