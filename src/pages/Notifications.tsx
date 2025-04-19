import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  
  // TODO: Replace with real data from API
  const notifications: any[] = [];
  
  return (
    <AppLayout activeTab="notifications">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={index} className="p-4 bg-muted/40 rounded-lg">
                {notification.message}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No notifications</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Notifications;
