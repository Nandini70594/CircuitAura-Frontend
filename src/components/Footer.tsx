import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Youtube, Instagram } from 'lucide-react';
import logo from '@/assets/circuitaura-logo.png';

const contactInfo = {
  phone: "+91 93222 91932",
  email: "circuitauraelectronics@gmail.com",
  linkedin: "https://www.linkedin.com/in/nikhil-gosavi-70338024b",
  youtube: "https://youtube.com/@circuitauraelectronics?si=K4otlC53zoP1Xrwv",
  instagram: "https://www.instagram.com/circuitaura_ele?igsh=N3JhNnpoZ2V6eGRt",
};

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 items-start">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt="CircuitAura" className="h-8 w-8" />
              <span className="font-bold text-lg">CircuitAura</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building better ways to learn and experiment with electronics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-foreground transition-colors">Products</Link></li>
              <li><Link to="/kits" className="hover:text-foreground transition-colors">Educational Kits</Link></li>
              <li><Link to="/learning" className="hover:text-foreground transition-colors">Learning Resources</Link></li>
            </ul>
          </div>

          {/* Contact - REAL & CLICKABLE */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Contact Us</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:underline">
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="hover:underline">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Follow - REAL LINKS */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Follow Us</h3>
            <div className="flex gap-3">
              <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" 
                 className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all group">
                <Linkedin className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer" 
                 className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all group">
                <Youtube className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" 
                 className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all group">
                <Instagram className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CircuitAura. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
