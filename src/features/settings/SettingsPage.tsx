import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { User, CreditCard, Camera } from 'phosphor-react';
import { selectProfile, selectBilling, updateProfile, updateBilling } from './settingsSlice';
import { Button } from '../../shared/components/layout/ui/button';

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const billing = useAppSelector(selectBilling);
  
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);

  const handleNameSave = () => {
    dispatch(updateProfile({ name: tempName }));
    setEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(profile.name);
    setEditingName(false);
  };

  const handlePlanChange = (plan: 'free' | 'pro' | 'premium') => {
    const planPricing = { free: 0, pro: 29, premium: 59 };
    dispatch(updateBilling({ 
      plan, 
      amount: planPricing[plan],
      nextBillingDate: plan === 'free' ? '' : '2024-08-15'
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <User size={24} className="text-gray-700" />
          <h2 className="text-xl font-semibold text-black">Profile</h2>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-500">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            {editingName ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <Button variant="default" size="sm" onClick={handleNameSave}>
                  Save
                </Button>
                <Button variant="secondary" size="sm" onClick={handleNameCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{profile.name}</span>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setEditingName(true)}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Billing Section */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <CreditCard size={24} className="text-gray-700" />
          <h2 className="text-xl font-semibold text-black">Billing</h2>
        </div>

        <div className="space-y-6">
          {/* Current Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Current Plan</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { plan: 'free', name: 'Free', price: 0, features: ['Basic features', '5 practice tests'] },
                { plan: 'pro', name: 'Pro', price: 29, features: ['All features', 'Unlimited tests', 'Progress tracking'] },
                { plan: 'premium', name: 'Premium', price: 59, features: ['Everything in Pro', 'Personal tutor', 'Priority support'] }
              ].map(({ plan, name, price, features }) => (
                <div
                  key={plan}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    billing.plan === plan
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePlanChange(plan as any)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{name}</h3>
                    <span className="text-lg font-bold">${price}</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {features.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Info */}
          {billing.plan !== 'free' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Billing Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Next billing date: {billing.nextBillingDate}</p>
                <p>Amount: ${billing.amount}/month</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;