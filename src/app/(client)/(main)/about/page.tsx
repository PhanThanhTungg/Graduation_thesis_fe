import BreadcrumbCustom from "@/components/custom/breadcrumb";
import { Metadata } from "next";
import { Target, Users, Award, BookOpen, Lightbulb, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Aikabis's organization and mission.",
};

const breadcrumb = [
  { url: "/", label: "Homepage" },
  { url: undefined, label: "About Us" },
];

const stats = [
  { value: "10K+", label: "Active Students" },
  { value: "500+", label: "Expert Instructors" },
  { value: "1000+", label: "Quality Courses" },
  { value: "50+", label: "Country Reach" },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To make quality education accessible to everyone, everywhere, empowering learners to achieve their full potential through innovative online learning experiences.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously innovate our platform with cutting-edge technology to provide the best learning experience for students and teaching tools for instructors.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a global community of learners and educators who support, inspire, and learn from each other through collaborative learning.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in course quality, instructor expertise, and student support to ensure exceptional educational outcomes.",
  },
  {
    icon: BookOpen,
    title: "Accessibility",
    description: "Making education affordable and accessible to learners worldwide, breaking down barriers to knowledge and skill development.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description: "Committed to continuous improvement and growth, helping our students advance their careers and achieve their personal goals.",
  },
];

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "https://ui-avatars.com/api/?name=Sarah+Johnson&size=200&background=00a76f&color=fff&bold=true",
    description: "10+ years in EdTech innovation",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "https://ui-avatars.com/api/?name=Michael+Chen&size=200&background=ff8e3c&color=fff&bold=true",
    description: "Expert in learning platforms",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Content",
    image: "https://ui-avatars.com/api/?name=Emily+Rodriguez&size=200&background=a78bd8&color=fff&bold=true",
    description: "Curriculum design specialist",
  },
  {
    name: "David Kim",
    role: "Lead Instructor",
    image: "https://ui-avatars.com/api/?name=David+Kim&size=200&background=eac700&color=fff&bold=true",
    description: "Master educator & mentor",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <BreadcrumbCustom breadcrumb={breadcrumb} />

      <section className="container-md py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading font-semibold text-4xl md:text-5xl text-foreground mb-6">
            Empowering Learners Worldwide
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            We are a leading online learning platform dedicated to transforming education through 
            technology. Our mission is to provide accessible, high-quality courses that help 
            individuals achieve their personal and professional goals.
          </p>
          <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-green/10 via-orange/10 to-violet/10 rounded-3xl overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#00a76f", stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: "#ff8e3c", stopOpacity: 0.6 }} />
                </linearGradient>
              </defs>
              <circle cx="200" cy="100" r="60" fill="url(#grad1)" opacity="0.3" />
              <circle cx="600" cy="300" r="80" fill="url(#grad1)" opacity="0.3" />
              <circle cx="400" cy="200" r="100" fill="url(#grad1)" opacity="0.2" />
              <rect x="100" y="250" width="120" height="120" rx="20" fill="#00a76f" opacity="0.2" />
              <rect x="550" y="80" width="100" height="100" rx="15" fill="#ff8e3c" opacity="0.2" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center size-24 bg-green/20 rounded-full mb-4">
                  <BookOpen className="size-12 text-green" />
                </div>
                <p className="font-heading font-semibold text-2xl text-foreground">
                  Learning Without Limits
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-heading font-bold text-4xl md:text-5xl text-green mb-2">
                  {stat.value}
                </p>
                <p className="text-lg text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-md py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading font-semibold text-3xl md:text-4xl text-foreground mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These principles guide everything we do and shape our commitment to learners worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="p-8 border border-border rounded-2xl bg-card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center size-14 bg-green/10 rounded-xl mb-6">
                  <Icon className="size-7 text-green" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-to-br from-green/5 via-background to-orange/5 py-16">
        <div className="container-md">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-foreground mb-4">
              Our Story
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From a small startup to a global learning platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3">
                <div className="relative w-full h-48 bg-gradient-to-br from-green to-green/60 rounded-2xl flex items-center justify-center">
                  <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" opacity="0.3"/>
                    <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div className="absolute top-4 left-4 font-heading font-bold text-white text-2xl">
                    2018
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  The Beginning
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Founded with a vision to democratize education, we started with just 10 courses 
                  and a passionate team of educators. Our goal was simple: make quality learning 
                  accessible to everyone.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
              <div className="md:w-1/3">
                <div className="relative w-full h-48 bg-gradient-to-br from-orange to-orange/60 rounded-2xl flex items-center justify-center">
                  <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="white" opacity="0.3"/>
                  </svg>
                  <div className="absolute top-4 left-4 font-heading font-bold text-white text-2xl">
                    2020
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  Rapid Growth
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  We expanded to over 500 courses across multiple disciplines, reaching 50,000+ 
                  students worldwide. Our platform became a trusted destination for online learning.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3">
                <div className="relative w-full h-48 bg-gradient-to-br from-violet to-violet/60 rounded-2xl flex items-center justify-center">
                  <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="2" fill="white" opacity="0.3"/>
                  </svg>
                  <div className="absolute top-4 left-4 font-heading font-bold text-white text-2xl">
                    2025
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  Leading the Future
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Today, we serve 10,000+ active students with 1,000+ courses taught by 500+ expert 
                  instructors. We continue to innovate and shape the future of online education.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-md py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading font-semibold text-3xl md:text-4xl text-foreground mb-4">
            Meet Our Leadership Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate experts committed to transforming education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="group text-center"
            >
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-base text-orange font-medium mb-2">{member.role}</p>
              <p className="text-sm text-muted-foreground">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-green/10 to-orange/10 py-16">
        <div className="container-md">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-foreground mb-6">
              Join Our Learning Community
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Start your learning journey today and become part of a global community 
              of passionate learners and expert educators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/courses"
                className="inline-flex items-center justify-center h-12 px-8 bg-green hover:bg-green/90 text-white rounded-full font-medium text-lg transition-colors"
              >
                Browse Courses
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-8 bg-background hover:bg-muted border border-border text-foreground rounded-full font-medium text-lg transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
