import { auth } from "@/lib/auth/server";
import Link from "next/link";

export default async function Home() {
  const { data: session } = await auth.getSession();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-foreground hidden sm:block">Portfolio</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Projects</Link>
              <Link href="/order" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {session ? (
                <Link 
                  href="/admin/dashboard" 
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Available for projects
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Building{" "}
                <span className="text-gradient">Digital Experiences</span>{" "}
                That Matter
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                Professional web development and design services. 
                Transforming ideas into elegant, functional solutions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/order" 
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all hover:scale-105"
                >
                  Start a Project
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </Link>
                <Link 
                  href="/projects" 
                  className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted transition-all"
                >
                  View Work
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div>
                  <div className="text-2xl font-bold text-foreground">5+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">50+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">30+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                    <div>
                      <div className="h-4 w-32 bg-muted rounded"></div>
                      <div className="h-3 w-20 bg-muted/50 rounded mt-2"></div>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 bg-muted rounded-lg"></div>
                    <div className="h-16 bg-muted rounded-lg"></div>
                    <div className="h-16 bg-muted rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What I Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional services tailored to bring your vision to life
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
                title: "Web Development",
                desc: "Custom websites and web applications built with modern technologies"
              },
              {
                icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
                title: "UI/UX Design",
                desc: "Beautiful, intuitive interfaces that enhance user experience"
              },
              {
                icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
                title: "Consultation",
                desc: "Expert advice to help you make informed technical decisions"
              }
            ].map((service, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={service.icon}/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-0"></div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Let&apos;s discuss how I can help bring your ideas to life. 
                Reach out today for a free consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/order" 
                  className="inline-flex items-center justify-center bg-white text-primary font-medium px-6 py-3 rounded-lg hover:bg-primary-foreground/90 transition-colors"
                >
                  Order Service
                </Link>
                <Link 
                  href="/auth/register" 
                  className="inline-flex items-center justify-center border border-primary-foreground/30 text-primary-foreground font-medium px-6 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="text-sm text-muted-foreground">© 2024 Portfolio. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
