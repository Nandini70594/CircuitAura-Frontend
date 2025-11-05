import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Video, FileText, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Learning = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const tutorials = [
    {
      title: 'Introduction to Arduino Programming',
      description: 'Learn the basics of Arduino programming from scratch',
      type: 'article',
      duration: '15 min read',
    },
    {
      title: 'Building Your First Circuit',
      description: 'Step-by-step guide to creating basic electronic circuits',
      type: 'article',
      duration: '20 min read',
    },
    {
      title: 'Understanding Ohm\'s Law',
      description: 'Master the fundamental principle of electronics',
      type: 'article',
      duration: '10 min read',
    },
  ];

  const videos = [
    {
      title: 'ESP32 WiFi Tutorial',
      description: 'Connect your ESP32 to WiFi and create a web server',
      videoId: 'dQw4w9WgXcQ',
      duration: '25 minutes',
    },
    {
      title: 'PCB Design Basics',
      description: 'Learn professional PCB design techniques',
      videoId: 'dQw4w9WgXcQ',
      duration: '35 minutes',
    },
  ];

  const resources = [
    {
      title: 'Complete Arduino Reference',
      description: 'Comprehensive PDF guide with all Arduino functions',
      restricted: true,
    },
    {
      title: 'Circuit Design Diagrams',
      description: 'Collection of common circuit diagrams',
      restricted: true,
    },
    {
      title: 'Electronics Cheat Sheet',
      description: 'Quick reference for component values and formulas',
      restricted: false,
    },
  ];

  const handleDownload = (restricted: boolean) => {
    if (restricted && !isAuthenticated) {
      setAuthModalOpen(true);
    } else {
      // Handle download logic
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Learning Resources</h1>
          <p className="text-xl text-muted-foreground">
            Expand your electronics knowledge with our comprehensive resources
          </p>
        </div>

        <Tabs defaultValue="tutorials" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>

          <TabsContent value="tutorials" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">{tutorial.duration}</span>
                    </div>
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Read Article</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((video, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <Video className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                    <p className="text-sm text-muted-foreground">{video.duration}</p>
                  </CardHeader>
                  <CardContent>
                    <Button variant="default" className="w-full">Watch Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {resource.restricted && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Login Required
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleDownload(resource.restricted)}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Learning;
