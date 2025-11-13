import { mockCourses, testimonials, articles } from "@/lib/mockData";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, GraduationCap, TrendingUp, Star, PlayCircle, CheckCircle, Brain, RefreshCw, Sparkles, Shield, Target, Zap, ArrowRight, Globe, Clock } from "lucide-react";
import CourseCard from "@/components/custom/course-card";
import Logo from "@/components/custom/logo";
import ArticleCard from "@/components/custom/article-card";
import { Metadata } from "next";
import { getAllCategories } from "@/service/category.service";

export const metadata: Metadata = {
  title: "Aikabis - Your learning platform",
  description: "Aikabis is a platform for learning and teaching.",
  keywords: ["Aikabis", "learning", "teaching", "online", "training"],
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
  category: "education"
}

export default function HomePage() {

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
          <div className="container-lg relative z-5 w-full h-full flex flex-col justify-center gap-3">
            <h1 className="text-3xl md:text-4xl font-semibold text-black">Aikabis: <br/> Your learning platform</h1>
            <p className="text-muted-foreground">Online training solutions help your business thrive.</p>
            <Button size="lg" className="bg-green text-white w-fit">
              <Link href='/courses'>Get Started</Link>
            </Button>
          </div>
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
            <Button size="lg" className="bg-green text-secondary">
              <Link href="/my-learning">Start Learning Now</Link>
            </Button>
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

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-lg">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green/10 rounded-full text-sm font-medium text-green mb-4">
              OUR CORE VALUES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Aikabis is Different
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We combine cutting-edge technology with proven learning methodologies 
              to create the most effective learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Spaced Repetition Learning */}
            <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green to-mint opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="relative">
                <div className="size-14 rounded-xl bg-gradient-to-br from-green to-mint flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <RefreshCw className="size-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Spaced Repetition Learning</h3>
                <p className="text-muted-foreground mb-4">
                  Our platform uses scientifically-proven spaced repetition techniques to help you retain knowledge longer. 
                  Review materials at optimal intervals to maximize memory retention and learning efficiency.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Automated review scheduling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Personalized learning intervals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Progress tracking & analytics</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* AI-Powered Learning */}
            <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-mint to-peach opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="relative">
                <div className="size-14 rounded-xl bg-gradient-to-br from-mint to-peach flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Brain className="size-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Powered Assistance</h3>
                <p className="text-muted-foreground mb-4">
                  Learn smarter with our AI assistant that provides instant answers, personalized recommendations, 
                  and adaptive learning paths tailored to your unique learning style and pace.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>24/7 AI tutor support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Personalized course recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Intelligent doubt resolution</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interactive Learning */}
            <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-peach to-orange opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="relative">
                <div className="size-14 rounded-xl bg-gradient-to-br from-peach to-orange flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Target className="size-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Interactive Exercises</h3>
                <p className="text-muted-foreground mb-4">
                  Engage with hands-on projects, coding challenges, and interactive quizzes. 
                  Apply what you learn immediately to reinforce understanding and build real-world skills.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Real-world projects & case studies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Interactive coding environments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Instant feedback & solutions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quality Content */}
            <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange to-violet opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="relative">
                <div className="size-14 rounded-xl bg-gradient-to-br from-orange to-violet flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Sparkles className="size-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Premium Quality Content</h3>
                <p className="text-muted-foreground mb-4">
                  Every course is carefully crafted by industry experts and reviewed for quality. 
                  Learn from real professionals with years of experience in their fields.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Industry-leading instructors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Up-to-date content & curriculum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>HD video & downloadable resources</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Secure Platform */}
            <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet to-green opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="relative">
                <div className="size-14 rounded-xl bg-gradient-to-br from-violet to-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="size-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure & Reliable</h3>
                <p className="text-muted-foreground mb-4">
                  Your data and privacy are our top priorities. We use enterprise-grade security 
                  to protect your information and ensure a safe learning environment.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>SSL encrypted connections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>GDPR compliant data handling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>99.9% uptime guarantee</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Global Community */}
            <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green to-peach opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="relative">
                <div className="size-14 rounded-xl bg-gradient-to-br from-green to-peach flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Globe className="size-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Global Learning Community</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with learners worldwide, join study groups, participate in discussions, 
                  and build your professional network while learning together.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Active discussion forums</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Peer-to-peer learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green shrink-0 mt-0.5" />
                    <span>Networking opportunities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}