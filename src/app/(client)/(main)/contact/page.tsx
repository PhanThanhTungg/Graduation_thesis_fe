import BreadcrumbCustom from "@/components/custom/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail } from "lucide-react";

export default function ContactPage() {
  const breadcrumb = [
    { url: "/", label: "Homepage" },
    { url: undefined, label: "Contact" },
  ]

  return (
    <div className="flex flex-col gap-12 pb-20">
      <BreadcrumbCustom breadcrumb={breadcrumb} />

      <div className="container-md flex gap-8 items-start justify-between flex-wrap lg:flex-nowrap">
        <div className="flex flex-col gap-6 w-full lg:w-[380px] shrink-0">
          <h1 className="font-heading font-semibold text-3xl text-foreground capitalize">
            Need a direct line?
          </h1>
          
          <div className="flex flex-col gap-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Feel free to reach out to us through any of the following methods.
            </p>

            <div className="flex gap-6 items-center">
              <div className="bg-muted/30 flex items-center justify-center rounded-lg size-14 shrink-0">
                <Phone className="size-8 text-orange stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <p className="text-lg text-muted-foreground">Phone</p>
                <p className="font-heading font-semibold text-base text-foreground capitalize">
                  (123) 456 7890
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-center">
              <div className="bg-muted/30 flex items-center justify-center rounded-lg size-14 shrink-0">
                <Mail className="size-8 text-orange stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <p className="text-lg text-muted-foreground">Email</p>
                <p className="font-heading font-semibold text-base text-foreground">
                  contact@thimpress.com
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto lg:flex-1 max-w-[700px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.3015540820948!2d105.78532367476801!3d20.98054588943383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acce762c2bb9%3A0xbb64e14683ccd786!2zSOG7jWMgVmnhu4duIENOIELGsHUgQ2jDrW5oIFZp4buFbiBUaMO0bmcgLSBIw6AgxJDDtG5n!5e0!3m2!1svi!2s!4v1762267132338!5m2!1svi!2s" 
            width="100%" 
            height="400" 
            style={{ border: 0, borderRadius: '20px' }}
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>
      </div>

      <div className="container-md flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <h2 className="font-heading font-semibold text-3xl text-foreground capitalize">
            Contact us
          </h2>
          <p className="text-lg text-muted-foreground">
            Your email address will not be published. Required fields are marked *
          </p>
        </div>

        <form className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              type="text"
              placeholder="Name*"
              required
              className="h-12 text-lg"
            />
            <Input
              type="email"
              placeholder="Email*"
              required
              className="h-12 text-lg"
            />
          </div>

          <Textarea
            placeholder="Comment"
            rows={5}
            className="text-lg resize-none"
          />

          <div className="flex items-center gap-2">
            <Checkbox
              id="saveInfo"
            />
            <label 
              htmlFor="saveInfo" 
              className="text-lg text-muted-foreground cursor-pointer select-none"
            >
              Save my name, email in this browser for the next time I comment
            </label>
          </div>

          <div>
            <Button
              type="submit"
              className="bg-orange hover:bg-orange/90 text-white h-12 px-6 rounded-full text-lg font-medium capitalize"
            >
              Posts comment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
