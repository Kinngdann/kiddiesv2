import Link from "next/link";
import { Button } from "@ui/button";
import { Mail, MapPinHouse, Phone } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Privacy Policy", link: "/privacy-policy" },
    { name: "About", link: "#about" },
    { name: "Contact", link: "#contact" },
  ];
  return (
    <footer className="full-bleed mt-32" id="contact">
      <div className="flex justify-between flex-col lg:flex-row text-white bg-[linear-gradient(to_left,#11d5ff_0%,#0089cd_100%)] px-8 py-4 lg:px-34 lg:py-8">
        <div className="font-bold">
          <h2>Ready to Enroll?</h2>
          <p>Take the oppurtunity now!</p>
        </div>
        <Button
          asChild
          className="h-12 px-8 font-bold mt-8 bg-white text-black max-w-fit"
          size="lg">
          <Link href="/register" target="_blank">
            REGISTER
          </Link>
        </Button>
      </div>
      <div className="footer px-6 py-6 space-y-6 flex flex-col lg:flex-row lg:gap-6 justify-evenly">
        <div className="space-y-4 text-[#ababab]">
          <h3 className="font-bold text-xl">Contact Info</h3>
          <div className="flex gap-4 ">
            <MapPinHouse size={70} />
            <p className="max-w-[30ch]">
              Irama complex, plot 4, sa&apos;adu zungur avenue, off wole soyinka
              avanue, 4th avanue, Gwarinpa Abuja.
            </p>
          </div>
          <div className="flex gap-4">
            <Phone />
            <p>+234 802 441 8127</p>
          </div>
          <div className="flex gap-4">
            <Mail />
            <p>kiddiescrown123@gmail.com</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-xl">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((quickLink) => (
              <li key={quickLink.name}>
                <Link
                  href={quickLink.link}
                  className="hover:text-white transition ease-in-out duration-300">
                  {quickLink.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-sm text-center font-semibold">
        © 2025. All rights reserved{" "}
      </p>
    </footer>
  );
}
