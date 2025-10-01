import { slogan } from "@/lib/data";
import Logo from "./logo";
import Link from "next/link";

export default function ClientFooter() {
  return (
    <footer className="bg-muted container-md pt-4 pb-4 lg:pt-16 flex flex-col gap-4 lg:gap-16">
      <section className="grid lg:grid-cols-6 grid-rows-[auto_auto_auto_auto] lg:grid-rows-[auto_auto] grid-flow-col gap-3 lg:gap-6">
        <div className="col-span-2 self-end order-1">
          <Logo />
        </div>
        <p className="col-span-2 order-2">
          {slogan}
        </p>

        <h3 className="uppercase font-semibold text-base lg:text-lg self-end order-5 lg:order-3">Get help</h3>
        <ul className="flex flex-col gap-4 order-6 lg:order-4">
          <li className="text-sm lg:text-base"><Link href="/About">About Us</Link></li>
          <li className="text-sm lg:text-base"><Link href="/contact">Contact Us</Link></li>
          <li className="text-sm lg:text-base"><Link href="/faqs">FAQ</Link></li>
        </ul>

        <h3 className="uppercase font-semibold text-base lg:text-lg self-end order-7 lg:order-5">Programs</h3>
        <ul className="flex flex-col gap-4 order-8 lg:order-6">
          <li className="text-sm lg:text-base"><Link href="/About">About Us</Link></li>
          <li className="text-sm lg:text-base"><Link href="/contact">Contact Us</Link></li>
          <li className="text-sm lg:text-base"><Link href="/faqs">FAQ</Link></li>
          <li className="text-sm lg:text-base"><Link href="/About">About Us</Link></li>
          <li className="text-sm lg:text-base"><Link href="/contact">Contact Us</Link></li>
          <li className="text-sm lg:text-base"><Link href="/faqs">FAQ</Link></li>
        </ul>

        <h3 className="col-span-2 self-end uppercase font-semibold text-base lg:text-lg order-3 lg:order-7">
          Contact Us
        </h3>
        <div className="col-span-2 text-sm lg:text-base flex flex-col gap-4 order-4 lg:order-8">
          <p>Address: Km 10 Nguyen Trai, P.Mo Lao, Q.Ha Dong, TP.Ha Noi</p>
          <p>Tel: +84 96 307 5184</p>
          <p>Email: aikabis@gmail.com</p>
        </div>

      </section>

      <section className="text-sm md:text-base text-center">Copyright © 2025 Aikabis | Graduation Thesis LMS</section>
    </footer>
  )
}