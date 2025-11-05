import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Award } from 'lucide-react';
import logo from '@/assets/circuitaura-logo.png';

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section with Logo */}
        <div className="text-center mb-16">
          <img src={logo} alt="CircuitAura" className="h-24 w-24 mx-auto mb-6 animate-glow" />
          <h1 className="text-4xl font-bold mb-4">About CircuitAura</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Innovating the Future of Electronics
          </p>
        </div>

        {/* Brand Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, CircuitAura emerged from a passion for making electronics accessible to everyone. 
                  What started as a small workshop has grown into a leading supplier of quality electronic components 
                  and educational kits.
                </p>
                <p>
                  We believe that innovation starts with education. That's why we've dedicated ourselves to creating 
                  comprehensive learning resources and starter kits that empower makers, students, and professionals 
                  to bring their electronic dreams to life.
                </p>
                <p>
                  Today, CircuitAura serves thousands of customers worldwide, from hobbyists building their first 
                  circuit to engineers developing cutting-edge IoT solutions. Our commitment to quality, education, 
                  and customer support remains at the heart of everything we do.
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
                To democratize electronics education and provide quality components that inspire innovation.
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
                A world where everyone can learn, create, and innovate with electronics.
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
                Quality, Innovation, Education, and Customer Success drive everything we do.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Founder Section */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <img src={logo} alt="Founder" className="w-32 h-32" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <h2 className="text-2xl font-bold">Meet Our Founder</h2>
                  <h3 className="text-xl text-primary">Alex Thompson</h3>
                  <p className="text-muted-foreground">
                    Alex Thompson, an electrical engineer with over 15 years of experience in electronics design 
                    and education, founded CircuitAura with a vision to make quality electronics accessible to all. 
                    With a Master's degree in Electrical Engineering from MIT and a passion for teaching, Alex has 
                    helped thousands of students and professionals master electronics through innovative educational 
                    approaches.
                  </p>
                  <p className="text-muted-foreground">
                    "My goal is simple: to spark the same passion for electronics in others that I discovered as 
                    a young engineer. Every product we sell, every kit we design, and every resource we create is 
                    aimed at making that journey as exciting and accessible as possible."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Awards & Recognition */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Awards & Recognition</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              'Best Electronics Supplier 2023',
              'Innovation in Education Award',
              'Customer Choice Award',
              'Top Rated Store 2023',
            ].map((award, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">{award}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
