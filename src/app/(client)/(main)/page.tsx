import { mockCategories, mockCourses, testimonials, articles } from "@/lib/mockData";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, GraduationCap, TrendingUp, Star, PlayCircle, CheckCircle } from "lucide-react";
import CourseCard from "@/components/custom/course-card";
import Logo from "@/components/custom/logo";
import ArticleCard from "@/components/custom/article-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aikabis - Your learning platform",
  description: "Aikabis is a platform for learning and teaching.",
  keywords: ["Aikabis", "learning", "teaching", "online", "training"],
  openGraph: {
    title: "Aikabis - Your learning platform",
    description: "Aikabis is a platform for learning and teaching.",
    images: ["/banner.svg"],
  },
  alternates: {
    canonical: "https://aikabis.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
  authors: [{ name: "Aikabis" }],
  creator: "Ha Cuong Thinh, An Quoc Viet, Phan Thanh Tung",
  publisher: "An Quoc Viet",
  category: "education",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default async function HomePage() {
  const categories = mockCategories.slice(0, 10);
  const featuredCourses = mockCourses.slice(0, 6);

  // Category icons mapping
  const categoryIcons: Record<number, React.ReactNode> = {
    1: <BookOpen className="size-8 text-green" />,
    2: <Users className="size-8 text-green" />,
    3: <GraduationCap className="size-8 text-green" />,
    4: <PlayCircle className="size-8 text-green" />,
    5: <Star className="size-8 text-green" />,
    6: <BookOpen className="size-8 text-green" />,
    7: <Users className="size-8 text-green" />,
    8: <TrendingUp className="size-8 text-green" />,
    9: <GraduationCap className="size-8 text-green" />,
    10: <PlayCircle className="size-8 text-green" />,
  };

  return (
    <>
      {/* Banner */}
      <section>
        <div className="relative w-full aspect-192/70">
          <Image 
            src="/banner.svg"
            alt="Banner"
            fill
            sizes="100vw"
            priority
            className="object-cover absolute inset-0"
          />
          <div className="container-lg relative z-50 w-full h-full flex flex-col justify-center gap-3">
            <h1 className="text-3xl md:text-4xl font-semibold text-black">Aikabis: <br/> Your learning platform</h1>
            <p className="text-muted-foreground">Online training solutions help your business thrive.</p>
            <Button size="lg" className="bg-green text-white w-fit">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="py-16 bg-background container-lg">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Top Categories</h2>
            <p className="text-muted-foreground">Explore our Popular Categories</p>
          </div>
          <Button variant="outline" className="hidden md:inline-flex">
            All Categories
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <div className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  {categoryIcons[category.id]}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 50 + 10)} Courses</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-muted/30 container-lg">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Courses</h2>
            <p className="text-muted-foreground">Explore our Popular Courses</p>
          </div>
          <Button variant="outline" className="hidden md:inline-flex">
            All Courses
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* LearnPress Add-Ons */}
      <section className="container-lg py-16">
        <div className="bg-gradient-to-r from-mint to-peach rounded-2xl p-8 md:p-12">
          <div className="inline-block px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
            GET UNLIMITED ACCESS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">LearnPress Add-Ons</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Extend the features of your LMS with powerful and flexible LearnPress add-ons to help you organize, sell and manage your courses.
          </p>
          <Button size="lg" className="bg-green hover:bg-green-500">
            Explore Add-Ons
          </Button>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-background container-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green mb-2">230+</div>
            <div className="text-muted-foreground">Active Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green mb-2">899</div>
            <div className="text-muted-foreground">Best Courses</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green mb-2">158</div>
            <div className="text-muted-foreground">Mentors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green mb-2">100%</div>
            <div className="text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>
      </section>

      {/* Grow Up Your Skill */}
      <section className="py-16 bg-muted/30 container-lg">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square">
            <Image
              src="/Illustration.png"
              alt="Learning illustration"
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw"
              className="object-contain"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Grow Up Your Skill <br />
              With <Logo className="text-3xl"/>
            </h2>
            <p className="text-muted-foreground">
              We denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure.
            </p>
            <ul className="space-y-3">
              {[
                "Can Focus",
                "Can Inspire",
                "Can Motivate",
                "Can Learn",
                "Can Teach"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="size-5 text-green shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="bg-green text-white">
              Start Learning Now
            </Button>
          </div>
        </div>
      </section>

      {/* Education WordPress Theme */}
      <section className="py-16 bg-background container-lg">
        <div className="bg-gradient-to-r from-peach via-violet to-peach rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              AMAZING COURSE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              C++ Programming for Beginners
            </h2>
            <p className="text-muted-foreground mb-6">
              Learn the basics of C++ programming with this beginner-friendly course.
            </p>
            <Button size="lg" className="bg-orange hover:bg-orange-500 text-white">
              Purchase Now
            </Button>
          </div>
          <div className="absolute right-8 top-8">
            <div className="size-32 bg-yellow rounded-full flex items-center justify-center text-2xl font-bold transform rotate-12">
              50% OFF
            </div>
          </div>
        </div>
      </section>

      {/* Student Feedbacks */}
      <section className="py-16 bg-muted/30 container-lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Student Feedbacks</h2>
          <p className="text-muted-foreground">What student say about Aikabis</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-card border rounded-lg p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="size-4 fill-star text-star" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="relative size-10 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="font-medium text-sm">{testimonial.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 bg-background container-lg">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Latest Articles</h2>
            <p className="text-muted-foreground">Explore our Free Articles</p>
          </div>
          <Button variant="outline" className="hidden md:inline-flex">
            All Articles
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </>
  )
}