import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";  // ← ADD THESE IMPORTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import logo from "@/assets/circuitaura-logo.png";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subjectType, setSubjectType] = useState("inquiry");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const CONTACT_EMAIL = "circuitauraelectronics@gmail.com";
  const PHONE_NUMBER = "919322291932";

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const subjects: Record<string, string> = {
    inquiry: "CircuitAura Product Inquiry",
    feedback: "CircuitAura Feedback",
    support: "CircuitAura Support Request",
    order: "CircuitAura Order Question",
    suggestion: "CircuitAura Suggestion",
    partnership: "CircuitAura Partnership",
  };

  const finalSubject = subjects[subjectType];

  const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nCircuitAura Website`;

  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(
      finalSubject
    )}&body=${encodeURIComponent(body)}`,
    "_blank",
    "noopener,noreferrer"
  );

  await navigator.clipboard.writeText(
    `To: ${CONTACT_EMAIL}\nSubject: ${finalSubject}\n\n${body}`
  );

  toast({
    title: "✅ Opened!",
    description: `Subject: "${finalSubject}"`,
  });

  setName("");
  setEmail("");
  setSubjectType("inquiry");
  setMessage("");
};

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <img src={logo} alt="CircuitAura" className="h-24 w-24 mx-auto mb-6 animate-glow" />
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Feel free to ask any query or to give any feedback!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
              <CardDescription>Fill the below details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* SUBJECT DROPDOWN */}
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subjectType} onValueChange={setSubjectType}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Choose subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inquiry">Product Inquiry</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="order">Order/Shipping</SelectItem>
                      <SelectItem value="suggestion">Feature Suggestion</SelectItem>
                      <SelectItem value="partnership">Partnership/College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" placeholder="Tell us how we can help you..." rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
                </div>

                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Direct Contact</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <a href="mailto:circuitauraelectronics@gmail.com" className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors block">
                  <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <div className="text-muted-foreground hover:text-foreground underline">circuitauraelectronics@gmail.com</div>
                  </div>
                </a>

                <div className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => window.open(`tel:${PHONE_NUMBER}`, '_blank')}>
                  <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Phone/WhatsApp</p>
                    <div className="text-muted-foreground hover:text-foreground font-mono">+91 93222 91932</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">Pune, Maharashtra, India</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <a href="https://wa.me/919322291932" target="_blank" className="block">
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200/50 hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-2xl font-bold text-green-700 mb-2">Quick Chat</h3>
                  <p className="text-muted-foreground mb-6">Instant WhatsApp support</p>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white text-lg">Start Chat</Button>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
