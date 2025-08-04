'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Save, Shield, Eye, EyeOff, Lock, Key, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UserSettings {
  id: string;
  full_name: string;
  username: string;
}

interface PrivacySettingsProps {
  userId: string;
  userSettings: UserSettings;
}

export default function PrivacySettings({ userId, userSettings }: PrivacySettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: 'public', // public, friends, private
    contact_visibility: 'friends', // public, friends, private
    activity_tracking: true,
    data_collection: true,
    marketing_emails: false,
    search_indexing: true,
    location_sharing: false
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePrivacyChange = (key: string, value: boolean | string) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePrivacy = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          settings: privacySettings
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update privacy settings');
      }

      toast.success('Privacy settings updated!', {
        style: {
          background: '#10b981',
          color: 'white',
        }
      });
    } catch (error) {
      toast.error('Failed to update privacy settings.', {
        style: {
          background: '#ef4444',
          color: 'white',
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match.', {
        style: { background: '#ef4444', color: 'white' }
      });
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long.', {
        style: { background: '#ef4444', color: 'white' }
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          currentPassword: passwordData.current_password,
          newPassword: passwordData.new_password
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      
      toast.success('Password updated successfully!', {
        style: {
          background: '#10b981',
          color: 'white',
        }
      });
    } catch (error) {
      toast.error('Failed to update password. Please check your current password.', {
        style: {
          background: '#ef4444',
          color: 'white',
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch(`/api/settings/export-data?userId=${userId}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${userSettings.username}-data-export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Data export started. Download will begin shortly.', {
        style: { background: '#10b981', color: 'white' }
      });
    } catch (error) {
      toast.error('Failed to export data.', {
        style: { background: '#ef4444', color: 'white' }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Profile Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profile_visibility">Profile Visibility</Label>
              <Select 
                value={privacySettings.profile_visibility} 
                onValueChange={(value) => handlePrivacyChange('profile_visibility', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can view</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private - Only me</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contact_visibility">Contact Info Visibility</Label>
              <Select 
                value={privacySettings.contact_visibility} 
                onValueChange={(value) => handlePrivacyChange('contact_visibility', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="search_indexing">Search Engine Indexing</Label>
                <p className="text-sm text-gray-500">Allow search engines to index your profile</p>
              </div>
              <Switch
                id="search_indexing"
                checked={privacySettings.search_indexing}
                onCheckedChange={(value) => handlePrivacyChange('search_indexing', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="location_sharing">Location Sharing</Label>
                <p className="text-sm text-gray-500">Share your location for event recommendations</p>
              </div>
              <Switch
                id="location_sharing"
                checked={privacySettings.location_sharing}
                onCheckedChange={(value) => handlePrivacyChange('location_sharing', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="activity_tracking">Activity Tracking</Label>
              <p className="text-sm text-gray-500">Track your activity to improve recommendations</p>
            </div>
            <Switch
              id="activity_tracking"
              checked={privacySettings.activity_tracking}
              onCheckedChange={(value) => handlePrivacyChange('activity_tracking', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data_collection">Anonymous Data Collection</Label>
              <p className="text-sm text-gray-500">Help us improve the platform with anonymous usage data</p>
            </div>
            <Switch
              id="data_collection"
              checked={privacySettings.data_collection}
              onCheckedChange={(value) => handlePrivacyChange('data_collection', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing_emails">Marketing Communications</Label>
              <p className="text-sm text-gray-500">Receive marketing emails and promotional content</p>
            </div>
            <Switch
              id="marketing_emails"
              checked={privacySettings.marketing_emails}
              onCheckedChange={(value) => handlePrivacyChange('marketing_emails', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Password & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Password & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <Label htmlFor="current_password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.current_password}
                  onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="new_password">New Password</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.new_password}
                  onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirm_password}
                  onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handlePasswordUpdate} 
              disabled={isLoading || !passwordData.current_password || !passwordData.new_password}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              <Key className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two_factor">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <Switch
                id="two_factor"
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Export Your Data</h4>
              <p className="text-sm text-gray-500">Download a copy of all your data</p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Buttons */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSavePrivacy} 
          disabled={isLoading}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Privacy Settings'}
        </Button>
      </div>
    </div>
  );
}