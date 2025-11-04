import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPrice } from "@/lib/utils"

const courses = [
  {
    id: "1",
    title: "React Fundamentals",
    thumbnailUrl: "/thumbnails/react-basics.jpg",
    price: 99.99,
    countStudent: 150,
    isPublished: true,
    teacher: {
      id: "t1",
      name: "John Doe"
    },
    category: {
      id: "c1",
      name: "Web Development"
    },
    createdAt: new Date("2025-10-15")
  },
  {
    id: "2",
    title: "Node.js Complete Guide",
    thumbnailUrl: "/thumbnails/nodejs.jpg",
    price: 149.99,
    countStudent: 89,
    isPublished: true,
    teacher: {
      id: "t2",
      name: "Jane Smith"
    },
    category: {
      id: "c1",
      name: "Web Development"
    },
    createdAt: new Date("2025-10-20")
  },
  {
    id: "3",
    title: "TypeScript for Beginners",
    thumbnailUrl: "/thumbnails/typescript.jpg",
    price: 79.99,
    countStudent: 45,
    isPublished: false,
    teacher: {
      id: "t1",
      name: "John Doe"
    },
    category: {
      id: "c2",
      name: "Programming Languages"
    },
    createdAt: new Date("2025-10-25")
  }
]

export function ListCourses() {
  return (
    <Table>
      <TableCaption>List of Courses</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Title</TableHead>
          <TableHead>Teacher</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
            <TableCell className="font-medium">{course.title}</TableCell>
            <TableCell>{course.teacher.name}</TableCell>
            <TableCell>{course.category.name}</TableCell>
            <TableCell>{course.countStudent || 0}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                course.isPublished 
                  ? "bg-green-100 text-green-700" 
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {course.isPublished ? "Published" : "Draft"}
              </span>
            </TableCell>
            <TableCell className="text-right">{formatPrice(course.price)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
