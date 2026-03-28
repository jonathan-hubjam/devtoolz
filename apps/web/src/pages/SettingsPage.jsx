import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Trash2, Image as ImageIcon, Settings, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFavicon } from '@/hooks/useFavicon.js';

const SettingsPage = () => {
  const { favicon, uploadFavicon, removeFavicon, isLoading } = useFavicon();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadFavicon(file);
      toast({
        title: 'Favicon updated',
        description: 'Your custom favicon has been successfully saved to the database.',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    try {
      await removeFavicon();
      toast({
        title: 'Favicon removed',
        description: 'The favicon has been reset to the default.',
      });
    } catch (error) {
      toast({
        title: 'Removal failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Helmet>
        <title>Settings - JWT Decoder</title>
        <meta name="description" content="Configure your application settings and preferences." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="rounded-full">
                <Link to="/">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="sr-only">Back to Home</span>
                </Link>
              </Button>
              <div className="flex items-center gap-2 font-semibold text-lg">
                <Settings className="w-5 h-5 text-primary" />
                Settings
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
              <p className="text-muted-foreground mt-2">
                Customize how the application looks and feels.
              </p>
            </div>

            <Card className="border-2 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Global Favicon
                </CardTitle>
                <CardDescription>
                  Upload a custom icon to display in the browser tab for all users. Supports .ico, .png, .jpg, .gif, .svg, and .webp formats (max 20MB).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Preview Area */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden relative group">
                      {favicon ? (
                        <img 
                          src={favicon} 
                          alt="Favicon preview" 
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</span>
                  </div>

                  {/* Actions */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".ico,.png,.jpg,.jpeg,.gif,.svg,.webp"
                        className="hidden"
                      />
                      <Button 
                        onClick={triggerFileInput} 
                        disabled={isLoading}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {isLoading ? 'Uploading...' : 'Upload Image'}
                      </Button>
                      
                      {favicon !== '/vite.svg' && (
                        <Button 
                          onClick={handleRemove} 
                          disabled={isLoading}
                          variant="outline" 
                          className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                          Reset to Default
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                      <p>
                        The favicon is stored in the database and will be visible to all users visiting the application.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default SettingsPage;