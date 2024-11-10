import { useState } from 'react';
import { Tabs } from '../../components/profile/Tabs';
import { OfficeSettings } from '../../components/profile/OfficeSettings';
import { ProfileSettings } from '../../components/profile/ProfileSettings';
import { UserManagement } from '../../components/profile/UserManagement';
import { BillingSettings } from '../../components/profile/BillingSettings';

const tabs = [
  { id: 'office', label: 'Office Settings' },
  { id: 'profile', label: 'Profile Settings' },
  { id: 'users', label: 'User Management' },
  { id: 'billing', label: 'Billing' },
];

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('office');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your office settings, profile, and team members
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'office' && <OfficeSettings />}
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'billing' && <BillingSettings />}
      </div>
    </div>
  );
}