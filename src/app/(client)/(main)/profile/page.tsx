import { getMyProfile } from "@/service/user.service";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import ProfileForm from "./_components/profile-form";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const myProfile = await getMyProfile();

  if (!myProfile) {
    redirect('/login');
  }

  return <ProfileForm user={myProfile} />;
}