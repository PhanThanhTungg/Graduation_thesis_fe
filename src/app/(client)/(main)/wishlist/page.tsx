import { Metadata } from "next";
import WishlistClient from "./wishlistClient";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Your saved wishlist courses in Aikabis Learning Platform",
};

export default async function WishlistPage() {
  return (
    <>
      <section className="container-md py-16">
        <h1 className="text-4xl font-bold">My Wishlist</h1>
        <p>Your saved wishlist courses in Aikabis Learning Platform</p>

        <WishlistClient />
      </section>
    </>
  );
}
