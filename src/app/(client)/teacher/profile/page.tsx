import { Metadata } from "next";
import { getMyProfile } from "@/service/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TeacherProfileForm from "../dashboard/_components/teacher-profile-form";
import { TeacherType } from "@/schema/user.schema";

export const metadata: Metadata = {
  title: "Profile - Teacher Space",
  description: "Manage your teacher profile",
}

export default async function TeacherProfilePage() {
  const user = await getMyProfile();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="container-lg py-12">
      <section className="mb-8">
        <h1 className="font-heading font-semibold text-3xl text-foreground mb-2">Teacher Profile</h1>
        
      </section>

      {user && (
        <section className="mb-10 p-6 border border-border rounded-2xl bg-card">
          <div className="flex items-center gap-6">
            <Avatar className="size-20">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName} />
              <AvatarFallback className="text-xl font-semibold bg-muted">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Full Name</div>
                <div className="text-base font-medium text-foreground">{user.fullName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-base font-medium text-foreground">{user.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="text-base font-medium capitalize">{user.role}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="flex items-center gap-2">
                  <div
                    className={`size-2.5 rounded-full ${
                      user.status === "active"
                        ? "bg-green"
                        : user.status === "inactive"
                        ? "bg-yellow"
                        : "bg-destructive"
                    }`}
                  />
                  <span className="text-base font-medium capitalize">{user.status}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Country</div>
                <div className="text-base font-medium text-foreground">{user.country}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email Verified</div>
                <div className="text-base font-medium">{user.emailVerified ? "Yes" : "No"}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {user && user.role === "teacher" && (
        <section className="mb-10 p-8 border border-border rounded-2xl bg-card">
          <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
            Teacher Profile
          </h3>
          <TeacherProfileForm teacher={user as TeacherType} />
        </section>
      )}
    </div>
  )
}

