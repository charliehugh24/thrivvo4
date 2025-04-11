
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface FollowersListProps {
  title: string;
  followers: { id: string; name: string; avatar: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FollowersList: React.FC<FollowersListProps> = ({ 
  title, 
  followers, 
  open, 
  onOpenChange 
}) => {
  const navigate = useNavigate();
  
  const getInitial = (name: string | null | undefined) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  const handleProfileClick = (userId: string) => {
    // Ensure consistent ID format for navigation
    const formattedId = userId.startsWith('user') && !userId.includes('-') 
      ? `user-${userId.slice(4)}` 
      : userId;
    
    onOpenChange(false);
    navigate(`/profile/${formattedId}`);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {followers.length > 0 ? (
            <div className="space-y-3 py-2">
              {followers.map((follower) => (
                <div 
                  key={follower.id} 
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                  onClick={() => handleProfileClick(follower.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={follower.avatar} />
                      <AvatarFallback>{getInitial(follower.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{follower.name}</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No {title.toLowerCase()} yet.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersList;
