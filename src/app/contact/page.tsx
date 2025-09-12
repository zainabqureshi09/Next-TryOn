"use client";

import { motion } from "framer-motion";
import Head from "next/head";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      {/* SEO HEAD */}
      <Head>
        <title>Contact Us | LensVision</title>
        <meta
          name="description"
          content="Get in touch with LensVision. Call us, email us, or visit us. Our team is ready to assist with eyewear inquiries, support, or collaborations."
        />
        <meta
          name="keywords"
          content="contact lensvision, eyewear support, customer service, email, phone, address"
        />
        <meta name="author" content="LensVision" />
      </Head>

      <div className="container mx-auto px-4 py-20 space-y-24 font-inter">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold font-poppins tracking-tight text-purple-900"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            We&apos;d love to hear from you! Whether you have a question about
            products, need support, or just want to say hi — our team is ready
            to assist.
          </motion.p>
        </section>

        {/* Contact Info Cards */}
        <section
          aria-labelledby="contact-info"
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <h2 id="contact-info" className="sr-only">
            Contact Information
          </h2>
          {[
            {
              icon: <Phone className="w-8 h-8 text-purple-600" />,
              title: "Call Us",
              text: "+92 300 1234567",
            },
            {
              icon: <Mail className="w-8 h-8 text-pink-600" />,
              title: "Email Us",
              text: "support@lensvision.com",
            },
            {
              icon: <MapPin className="w-8 h-8 text-indigo-600" />,
              title: "Visit Us",
              text: "123 Vision Street, Lahore, PK",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.2 }}
            >
              <Card className="rounded-2xl shadow-lg hover:shadow-xl transition bg-white">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="flex justify-center">{item.icon}</div>
                  <h3 className="text-xl font-semibold font-poppins">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 font-inter text-base">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Contact Form */}
        <section className="max-w-4xl mx-auto" aria-labelledby="contact-form">
          <motion.h2
            id="contact-form"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-10 font-poppins text-gray-900"
          >
            Send Us a Message
          </motion.h2>

          <Card className="rounded-2xl shadow-md bg-white">
            <CardContent className="p-8 space-y-6">
              <form className="space-y-6" method="POST" action="/api/contact">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    name="name"
                    placeholder="Your Name"
                    aria-label="Your Name"
                    className="rounded-xl font-inter"
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    aria-label="Your Email"
                    className="rounded-xl font-inter"
                    required
                  />
                </div>
                <Input
                  name="subject"
                  placeholder="Subject"
                  aria-label="Subject"
                  className="rounded-xl font-inter"
                />
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  aria-label="Your Message"
                  className="rounded-xl font-inter"
                  required
                />
                <Button
                  size="lg"
                  type="submit"
                  className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 font-poppins text-lg"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
