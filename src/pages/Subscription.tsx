
import React from 'react';
import AppLayout from '@/components/AppLayout';
import SubscriptionTiers from '@/components/SubscriptionTiers';

const Subscription = () => {
  return (
    <AppLayout activeTab="discover">
      <div className="p-4">
        <SubscriptionTiers />
      </div>
    </AppLayout>
  );
};

export default Subscription;
