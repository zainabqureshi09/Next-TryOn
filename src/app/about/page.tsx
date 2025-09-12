"use client";

import { useEffect, useRef } from "react";
import Head from "next/head";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero Section Animation
    if (heroRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        heroRef.current.querySelectorAll(".hero-title"),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      ).fromTo(
        heroRef.current.querySelectorAll(".hero-text"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.5"
      );
    }

    // Staggered Cards
    gsap.utils.toArray<HTMLElement>(".stagger-card").forEach((section) => {
      gsap.fromTo(
        section.querySelectorAll(".card-item"),
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      );
    });

    // Team Animation
    gsap.utils.toArray<HTMLElement>(".team-member").forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50, rotate: 10 },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 1,
          delay: i * 0.2,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });

    // Contact Button Pulse
    gsap.fromTo(
      ".contact-btn",
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: ".contact-btn",
          start: "top 85%",
        },
      }
    );
  }, []);

  return (
    <>
      {/* SEO */}
      <Head>
        <title>About LensVision | Luxury Eyewear & Virtual Try-On</title>
        <meta
          name="description"
          content="Learn about LensVision - luxury eyewear brand combining premium craftsmanship, timeless design, and AI-powered virtual try-on technology."
        />
        <meta
          name="keywords"
          content="luxury eyewear, about LensVision, virtual try-on, premium glasses, designer frames"
        />
      </Head>

      <div className="overflow-hidden font-sans">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative text-center py-32 bg-gradient-to-b from-purple-950 via-[#1a001f] to-background text-white space-y-6 overflow-hidden"
        >
          <h1 className="hero-title text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-gradient">
            About Us
          </h1>
          <p className="hero-text text-lg md:text-xl max-w-2xl mx-auto text-white/80">
            Redefining eyewear with <strong>premium craftsmanship</strong>,{" "}
            <strong>timeless design</strong>, and{" "}
            <strong>cutting-edge virtual try-on technology</strong>.
          </p>
          {/* Subtle animated floating circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full animate-pulse-slow blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-500/20 rounded-full animate-pulse-slow blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </section>

        {/* Mission / Vision */}
        <section className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 stagger-card">
          {[
            {
              title: "Our Mission",
              desc: "To empower self-expression with eyewear that blends style, comfort, and technology — making every frame a reflection of your individuality.",
            },
            {
              title: "Our Vision",
              desc: "To build the future of eyewear with sustainability, innovation, and experiences that feel truly unforgettable.",
            },
          ].map((item, idx) => (
            <Card
              key={idx}
              className="card-item group relative rounded-2xl shadow-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 transition-transform duration-500 hover:-translate-y-2 hover:rotate-1 hover:shadow-2xl"
            >
              <CardContent className="p-8 space-y-4">
                <h2 className="text-3xl font-bold text-purple-950 group-hover:text-pink-600 transition-colors">
                  {item.title}
                </h2>
                <p className="text-purple-950/80 leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Why Choose Us */}
        <section className="container mx-auto px-6 py-20 grid md:grid-cols-3 gap-10 stagger-card">
          {[
            {
              title: "Premium Craftsmanship",
              desc: "Every frame is carefully designed and handcrafted with the finest materials.",
            },
            {
              title: "Next-Gen Technology",
              desc: "Our AI virtual try-on gives you a realistic, instant preview of every style.",
            },
            {
              title: "Sustainable Future",
              desc: "We’re committed to eco-friendly practices and recyclable materials.",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="card-item group rounded-2xl shadow-md bg-surface border border-border hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <CardContent className="p-6 space-y-4 text-center">
                <h3 className="text-xl font-semibold group-hover:text-purple-700 transition-colors">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Team Section */}
        <section className="py-24">
          <h2 className="text-center text-4xl font-bold mb-12">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              { name: "Ayesha Khan", role: "Founder & CEO", img: "/team/ayesha.jpg" },
              { name: "Ali Raza", role: "Design Lead", img: "/team/ali.jpg" },
              { name: "Sara Malik", role: "Tech Lead", img: "/team/sara.jpg" },
            ].map((member, idx) => (
              <div key={idx} className="team-member relative text-center space-y-4 group">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg border-4 border-white/10 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-4 text-white">
                    <a href="#" className="hover:text-pink-500">🐦</a>
                    <a href="#" className="hover:text-pink-500">💼</a>
                    <a href="#" className="hover:text-pink-500">📷</a>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-24 bg-gradient-to-b from-surface to-background">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold">Get in Touch</h2>
            <p className="text-lg text-muted-foreground">
              Have questions, feedback, or collaboration ideas? We’d love to hear from you.
            </p>
            <a
              href="/contact"
              className="contact-btn inline-block px-10 py-4 text-lg rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-110 transition-transform shadow-xl"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
