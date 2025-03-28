
import React from 'react';
import { User } from '@/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface UsersNearbyProps {
  users: User[];
}

const UsersNearby: React.FC<UsersNearbyProps> = ({ users }) => {
  const handleConnect = (user: User) => {
    toast({
      title: "Request sent!",
      description: `We've let ${user.name} know you want to hang out`,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Who's Down?</h2>
        <span className="text-sm text-muted-foreground">{users.length} nearby</span>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap pb-1">
        <div className="flex gap-3">
          {users.map((user) => (
            <Card key={user.id} className="w-[180px] flex-shrink-0">
              <CardContent className="p-3 space-y-3">
                <div className="flex justify-between items-start">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <Badge variant="outline" className="text-xs font-normal bg-thrivvo-light-purple text-thrivvo-deep-purple">
                    {user.distance}mi
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.interests.slice(0, 2).map((interest, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs font-normal"
                      >
                        {interest}
                      </Badge>
                    ))}
                    {user.interests.length > 2 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs font-normal"
                      >
                        +{user.interests.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button 
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleConnect(user)}
                >
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
};

export default UsersNearby;
