import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Video, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Learning = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

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

          {/* Tutorials - COMING SOON */}
          <TabsContent value="tutorials" className="space-y-6">
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
              <h2 className="text-2xl font-bold mb-4 text-muted-foreground">Coming Soon</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Detailed tutorials will be available here soon.
              </p>
            </div>
          </TabsContent>

          {/* Videos - COMING SOON */}
          <TabsContent value="videos" className="space-y-6">
            <div className="text-center py-20">
              <Video className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
              <h2 className="text-2xl font-bold mb-4 text-muted-foreground">Coming Soon</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Video tutorials coming soon.
              </p>
            </div>
          </TabsContent>

          {/* Downloads - COMING SOON */}
          <TabsContent value="downloads" className="space-y-6">
            <div className="text-center py-20">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
              <h2 className="text-2xl font-bold mb-4 text-muted-foreground">Coming Soon</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Reference sheets, cheat sheets, and downloadable guides will be here soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Learning;
