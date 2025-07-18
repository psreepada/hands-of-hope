import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Instagram } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/80 z-10" />
        <div className="relative h-[300px] w-full">
          <Image src="/images/CONTACTBANNER.png" alt="Hands of Hope contact" fill className="object-cover" style={{ objectPosition: '20% 30%' }} />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                Contact <span className="text-yellow-400">Us</span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                We're here to answer your questions and help you get involved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-6">Get in Touch</h2>
              <p className="text-gray-600">
                We'd love to hear from you! Whether you're interested in volunteering, donating, or partnering with us,
                feel free to reach out.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-teal-600 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@handsofhope-outreach.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-teal-600 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Phone</h3>
                    <p className="text-gray-600">(404) 992-4320</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Instagram className="h-6 w-6 text-teal-600 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Instagram</h3>
                    <p className="text-gray-600">Follow us on our Journey</p>
                    <a
                      href="https://www.instagram.com/handsofhope_outreach?igsh=M2dwam8wYWJ6YjVk&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 mt-1"
                    >
                      @handsofhopeoutreach
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-teal-600 mt-0.5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-900">LinkedIn</h3>
                    <p className="text-gray-600">Connect with us professionally</p>
                    <a
                      href="https://www.linkedin.com/company/hands-of-hope-outreach/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 mt-1"
                    >
                      Hands of Hope Outreach
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-teal-100">
              <h2 className="text-2xl font-bold text-teal-800 mb-6">Send us a Message</h2>
              <form action="https://formsubmit.co/info@handsofhopeoutreach.org" method="POST" className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message here..."
                    className="w-full min-h-[150px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-yellow-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-teal-800 mb-12 text-center">Frequently Asked Questions</h2>
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="w-full md:w-2/5">
                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-md">
                  <Image 
                    src="/images/walk.jpg" 
                    alt="Hands of Hope volunteers walking together" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>
              <div className="w-full md:w-3/5 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-teal-800 mb-2">How can I get involved?</h3>
                  <p className="text-gray-600">
                    You can get involved by signing up on our website, joining a local branch at your school, or
                    contacting us directly to learn about volunteer opportunities.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-teal-800 mb-2">Do you offer volunteer hours for students?</h3>
                  <p className="text-gray-600">
                    Yes! We provide verified volunteer hours and documentation that can be used for school requirements
                    and college applications.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-teal-800 mb-2">How can my school start a branch?</h3>
                  <p className="text-gray-600">
                    Contact us through this form or email us directly, and we'll guide you through the process of
                    establishing a Hands of Hope branch at your school.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
