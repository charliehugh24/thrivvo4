import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Upload, ChevronRight } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type ProfileData = Tables<'profiles'>;

const Welcome = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    location: '',
    interests: [] as string[],
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const interestOptions = [
    'music', 'food', 'travel', 'art', 'fitness', 'technology', 
    'coffee', 'gaming', 'photography', 'hiking', 'cooking', 
    'meditation', 'design', 'nutrition'
  ];
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
      } else {
        navigate('/auth');
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleInterest = (interest: string) => {
    setProfile(prev => {
      const interests = [...prev.interests];
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...interests, interest] };
      }
    });
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  };
  
  const handleCompleteSetup = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const avatarUrl = await uploadAvatar(userId);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          bio: profile.bio,
          location: profile.location,
          interests: profile.interests,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Setup complete!",
        description: "Your profile has been set up successfully."
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error completing setup",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Welcome to THRIVVO</h2>
            <p className="text-center text-muted-foreground">
              Let's set up your profile so you can start connecting with others and discovering events!
            </p>
            <div className="flex justify-center py-8">
              <img 
                src="/lovable-uploads/130ab7bf-f6ad-4a28-8c87-4a266c70a707.png" 
                alt="THRIVVO Logo" 
                className="h-20" 
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Create Your Profile</h2>
            
            <div className="flex flex-col items-center gap-4 mb-6">
              <div onClick={() => document.getElementById('avatar-input')?.click()} className="cursor-pointer">
                {avatarPreview ? (
                  <div className="relative h-24 w-24 rounded-full overflow-hidden">
                    <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-24 h-24 bg-muted rounded-full">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <input 
                id="avatar-input" 
                type="file" 
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('avatar-input')?.click()}
              >
                {avatarPreview ? 'Change Photo' : 'Add Profile Photo'}
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Display Name</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="How should we call you?"
                  value={profile.username}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us a bit about yourself..."
                  value={profile.bio}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Where are you based?"
                  value={profile.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Select Your Interests</h2>
            <p className="text-center text-muted-foreground">
              What are you passionate about? Select interests to help us recommend events for you.
            </p>
            
            <div className="flex flex-wrap gap-2 py-4 justify-center">
              {interestOptions.map((interest) => (
                <Badge 
                  key={interest}
                  variant={profile.interests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer select-none text-sm py-1.5 px-2.5"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <p className="text-sm text-muted-foreground">
                Selected: {profile.interests.length} / {interestOptions.length}
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-r from-thrivvo-teal/10 to-thrivvo-orange/10">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePreviousStep}
                disabled={loading}
              >
                Back
              </Button>
            )}
            
            {step < 3 ? (
              <Button 
                type="button" 
                className="ml-auto bg-thrivvo-teal hover:bg-thrivvo-teal/90"
                onClick={handleNextStep}
                disabled={loading}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button" 
                className="ml-auto bg-thrivvo-teal hover:bg-thrivvo-teal/90"
                onClick={handleCompleteSetup}
                disabled={loading}
              >
                {loading ? "Finishing Setup..." : "Finish Setup"}
              </Button>
            )}
          </div>
          
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`h-2 w-2 rounded-full ${s === step ? 'bg-thrivvo-teal' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;
