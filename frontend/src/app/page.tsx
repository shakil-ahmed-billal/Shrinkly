"use client"

import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, BarChart3, Check, Link2, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading]);

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Create shortened URLs instantly with our optimized infrastructure",
    },
    {
      icon: BarChart3,
      title: "Click Analytics",
      description:
        "Track every click and monitor your link performance in real-time",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee",
    },
  ];

  const benefits = [
    "100 free URLs per account",
    "Unlimited click tracking",
    "Custom short codes",
    "Real-time analytics",
    "No credit card required",
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">     
    <Header/>
      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-32 relative">
        {/* Background effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Free tier • 100 URLs included
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in stagger-1">
            Shorten URLs,
            <br />
            <span className="text-gradient">Amplify Reach</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-in stagger-2">
            Transform long, unwieldy URLs into clean, trackable links. Monitor
            clicks, analyze performance, and grow your audience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
            <Link href="/auth">
              <Button variant="glow" size="xl" className="animate-pulse-glow">
                Start for Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12 animate-fade-in stagger-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="w-4 h-4 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-32">
        <div className="grid md:grid-cols-3 gap-6 mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-strong rounded-2xl p-6 animate-fade-in"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mx-auto text-center glass-strong rounded-3xl p-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Create your free account and start shortening URLs in seconds.
          </p>
          <Link href="/auth">
            <Button variant="glow" size="lg">
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Link2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Shrinkly</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Shrinkly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
