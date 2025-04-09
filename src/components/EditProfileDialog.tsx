
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProfile: any;
  onProfileUpdate: () => void;
}

const interestOptions = [
  'music', 'food', 'travel', 'art', 'fitness', 'technology', 
  'coffee', 'gaming', 'photography', 'hiking', 'cooking', 
  'meditation', 'design', 'nutrition'
];

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ 
  open, 
  onOpenChange, 
  currentProfile,
  onProfileUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    bio: '',
    location: '',
    interests: [] as string[],
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currentProfile) {
      setProfileData({
        username: currentProfile.username || '',
        bio: currentProfile.bio || '',
        location: currentProfile.location || '',
        interests: currentProfile.interests || [],
      });
      
      if (currentProfile.avatar_url) {
        setAvatarPreview(currentProfile.avatar_url);
      }
    }
  }, [currentProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (interest: string) => {
    setProfileData(prev => {
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
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return currentProfile.avatar_url || null;

    try {
      // Delete existing avatar if present
      if (currentProfile.avatar_url) {
        const oldPath = currentProfile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      // Generate a unique file name to avoid conflicts
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
      // Upload new avatar
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('You must be logged in to update your profile');
      }
      
      const userId = sessionData.session.user.id;
      
      // Upload avatar if changed
      const avatarUrl = await uploadAvatar(userId);
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          bio: profileData.bio,
          location: profileData.location,
          interests: profileData.interests,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated successfully!",
        description: "Your profile has been updated with the new information."
      });
      
      onProfileUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            {avatarPreview ? (
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback>{profileData.username?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={clearAvatar}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-full">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="avatar">Profile Picture</Label>
              <Input 
                id="avatar" 
                type="file" 
                accept="image/*"
                onChange={handleAvatarChange}
                className="cursor-pointer"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="username">Display Name</Label>
            <Input
              id="username"
              name="username"
              value={profileData.username}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={profileData.location}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <Badge 
                  key={interest}
                  variant={profileData.interests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer select-none"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                  {profileData.interests.includes(interest) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
