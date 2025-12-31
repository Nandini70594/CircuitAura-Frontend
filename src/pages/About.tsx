import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award } from "lucide-react";
import logoLight from "@/assets/circuitaura-logo-light.png";
import logoDark from "@/assets/circuitaura-logo-dark.png";
import founderPhoto from "@/assets/founder-photo.png";

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section with Dual Theme Logo */}
        <div className="text-center mb-16">
          {/* Light theme logo */}
          <img
            src={logoLight}
            alt="CircuitAura"
            className="h-24 w-24 mx-auto mb-6 animate-glow hidden dark:block"
          />
          {/* Dark theme logo */}
          <img
            src={logoDark}
            alt="CircuitAura"
            className="h-24 w-24 mx-auto mb-6 animate-glow block dark:hidden"
          />
          <h1 className="text-4xl font-bold mb-4">About CircuitAura</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Building the next wave of electronics learning and innovation.
          </p>
        </div>

        {/* Brand Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  CircuitAura is a product-driven electronics startup committed 
                  to creating powerful, intelligent, and practical electronic 
                  solutions that solve real-world problems through innovation 
                  in embedded systems and IoT. Built on hands-on engineering, 
                  precision, and purpose, CircuitAura transforms ideas into 
                  reliable, user-ready products while fostering a culture of 
                  learning and technological curiosity, with a clear focus on 
                  impact, affordability, and the future of smart electronics.
                </p>
                <p>
                  Right now we are in our early stage – designing our product
                  catalog, refining our educational kits, and building tools
                  that make it easier to go from idea to working prototype.
                  Our goal is to become a trusted place where students,
                  hobbyists, and early‑stage startups find not just parts, but
                  guidance: curated components, ready‑to‑use kits, and clear
                  learning paths that make electronics less intimidating and
                  more fun.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-center">
                <Target className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Our Mission</h3>
              <p className="text-muted-foreground">
                To make learning and experimenting with electronics simple,
                affordable, and accessible for students, makers, and builders.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-center">
                <Eye className="h-12 w-12 text-secondary" />
              </div>
              <h3 className="text-xl font-bold">Our Vision</h3>
              <p className="text-muted-foreground">
                A future where anyone with curiosity can design, prototype, and
                launch real‑world electronic projects without needing a lab or a
                large budget.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-center">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Our Values</h3>
              <p className="text-muted-foreground">
                Clarity over hype, quality over quantity, and genuine support
                for learners and builders at every stage of their journey.
              </p>
            </CardContent>
          </Card>
        </div>

      {/* Founder / Team Section */}
<div className="max-w-4xl mx-auto">
  <Card>
    <CardContent className="pt-6">
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 flex justify-center">
          <div className="relative group">
            <img
              src={founderPhoto}
              alt="Nikhil Gosavi, CircuitAura founder"
              className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-2xl ring-4 ring-background/50 group-hover:ring-primary/30 transition-all duration-500 object-[15%_0%] hover:scale-110 origin-center"
            />
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold">Meet the Founder</h2>
          <h3 className="text-xl text-primary">Nikhil Gosavi</h3>
          <p className="text-muted-foreground leading-relaxed">
            Driven by a vision to build a powerful and impactful electronics 
            product brand, Nikhil Gosavi founded CircuitAura to transform 
            innovative ideas into practical, real-world solutions. With a 
            strong foundation in electronics, embedded systems, and IoT, 
            he leads with a product-first mindset focused on innovation, 
            reliability, and meaningful impact.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</div>



        {/* Early-stage note */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Where We Are Now</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            We are in the build phase: validating our ideas, improving our
            product experience, and learning from every user who tries
            CircuitAura. Just real work, real feedback, and a
            clear roadmap.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
