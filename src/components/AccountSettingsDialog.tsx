import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { LogOut, Trash2, Bell, Users, CreditCard, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AccountSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountSettingsDialog: React.FC<AccountSettingsDialogProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for the notifications, contacts and subscription sections
  const [notificationSettings, setNotificationSettings] = useState({
    eventInvites: true,
    newFollowers: true,
    eventReminders: true,
    directMessages: true,
    newsAndUpdates: false,
    emailNotifications: true
  });
  
  const recentContacts: { id: string; name: string; lastContact: string }[] = [];
  
  const currentSubscription = {
    plan: 'Thrivvo+ Basic',
    status: 'Active',
    renewDate: '2025-05-15',
    price: '$4.99/month'
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
      
      onOpenChange(false);
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would ideally call a secure server endpoint
      // that handles user deletion safely with proper authorization
      
      // For demo purposes, we're showing the flow but not implementing actual deletion
      // since Supabase doesn't expose a direct API for this in the client
      
      toast({
        title: "Account deletion requested",
        description: "Your account will be deleted shortly. You'll be signed out now."
      });
      
      // Sign out after requesting deletion
      await supabase.auth.signOut();
      
      setDeleteDialogOpen(false);
      onOpenChange(false);
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error deleting account",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Notification settings updated",
      description: `${key} notifications have been ${notificationSettings[key] ? 'disabled' : 'enabled'}.`
    });
  };
  
  const handleContactClick = (userId: string) => {
    onOpenChange(false);
    navigate(`/profile/${userId}`);
  };
  
  const handleUpgradeSubscription = () => {
    onOpenChange(false);
    navigate('/subscription');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>
            
            {/* General Tab */}
            <TabsContent value="general" className="space-y-4 py-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                  <span>Sign out of your account</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isLoading}
                >
                  Sign Out
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="text-destructive">Delete your account</span>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-y-0.5">
                  <div className="flex flex-col">
                    <Label htmlFor="event-invites" className="mb-1">Event Invites</Label>
                    <span className="text-xs text-muted-foreground">Receive notifications when invited to events</span>
                  </div>
                  <Switch 
                    id="event-invites" 
                    checked={notificationSettings.eventInvites}
                    onCheckedChange={() => handleNotificationChange('eventInvites')}
                  />
                </div>
                
                <div className="flex items-center justify-between space-y-0.5">
                  <div className="flex flex-col">
                    <Label htmlFor="new-followers" className="mb-1">New Followers</Label>
                    <span className="text-xs text-muted-foreground">Get notified when someone follows you</span>
                  </div>
                  <Switch 
                    id="new-followers" 
                    checked={notificationSettings.newFollowers}
                    onCheckedChange={() => handleNotificationChange('newFollowers')}
                  />
                </div>
                
                <div className="flex items-center justify-between space-y-0.5">
                  <div className="flex flex-col">
                    <Label htmlFor="event-reminders" className="mb-1">Event Reminders</Label>
                    <span className="text-xs text-muted-foreground">Get reminders for upcoming events</span>
                  </div>
                  <Switch 
                    id="event-reminders" 
                    checked={notificationSettings.eventReminders}
                    onCheckedChange={() => handleNotificationChange('eventReminders')}
                  />
                </div>
                
                <div className="flex items-center justify-between space-y-0.5">
                  <div className="flex flex-col">
                    <Label htmlFor="direct-messages" className="mb-1">Direct Messages</Label>
                    <span className="text-xs text-muted-foreground">Get notified for new messages</span>
                  </div>
                  <Switch 
                    id="direct-messages" 
                    checked={notificationSettings.directMessages}
                    onCheckedChange={() => handleNotificationChange('directMessages')}
                  />
                </div>
                
                <div className="flex items-center justify-between space-y-0.5">
                  <div className="flex flex-col">
                    <Label htmlFor="news-updates" className="mb-1">News & Updates</Label>
                    <span className="text-xs text-muted-foreground">Receive news and feature updates</span>
                  </div>
                  <Switch 
                    id="news-updates" 
                    checked={notificationSettings.newsAndUpdates}
                    onCheckedChange={() => handleNotificationChange('newsAndUpdates')}
                  />
                </div>
                
                <div className="pt-2 border-t flex items-center justify-between space-y-0.5">
                  <div className="flex flex-col">
                    <Label htmlFor="email-notifications" className="mb-1">Email Notifications</Label>
                    <span className="text-xs text-muted-foreground">Receive notifications via email</span>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationChange('emailNotifications')}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Contacts Tab */}
            <TabsContent value="contacts" className="py-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Recent Contacts</h3>
                
                {recentContacts.length > 0 ? (
                  <div className="space-y-2">
                    {recentContacts.map(contact => (
                      <div 
                        key={contact.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => handleContactClick(contact.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">Last contacted {contact.lastContact}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No contacts yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Start connecting with other users to build your network</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Subscription Tab */}
            <TabsContent value="subscription" className="py-4">
              <div className="space-y-4">
                <div className="bg-primary/5 border rounded-md p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{currentSubscription.plan}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Status: <span className="text-green-600 font-medium">{currentSubscription.status}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">Renews on {currentSubscription.renewDate}</p>
                      <p className="text-xs text-muted-foreground">Price: {currentSubscription.price}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-sm"
                    onClick={handleUpgradeSubscription}
                  >
                    Upgrade Plan
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-destructive hover:text-destructive"
                    onClick={() => {
                      toast({
                        title: "Subscription cancelled",
                        description: "Your subscription will remain active until the end of the billing period.",
                      });
                    }}
                  >
                    Cancel Subscription
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Billing History</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Apr 11, 2025</TableCell>
                        <TableCell>$4.99</TableCell>
                        <TableCell className="text-right">Paid</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Mar 11, 2025</TableCell>
                        <TableCell>$4.99</TableCell>
                        <TableCell className="text-right">Paid</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AccountSettingsDialog;
