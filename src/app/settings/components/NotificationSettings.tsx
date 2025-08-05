'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Bell, Mail, Calendar, Users } from "lucide-react";
import { toast } from "sonner";

interface NotificationSettingsProps {
  userId: string;
}

export default function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Email Notifications
    email_events: true,
    email_communities: true,
    email_discussions: true,
    email_marketing: false,
    email_security: true,

    // Push Notifications
    push_events: true,
    push_communities: true,
    push_discussions: true,
    push_messages: true,

    // Frequency Settings
    digest_frequency: 'weekly', // daily, weekly, monthly, never
    event_reminders: '1_day', // 1_hour, 1_day, 1_week, never

    // Privacy
    activity_visibility: 'public', // public, friends, private
    online_status: true
  });

  const handleSwitchChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          settings
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      toast.success('Notification settings updated!', {
        style: {
          background: '#10b981',
          color: 'white',
        }
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to update settings. Please try again.', {
        style: {
          background: '#ef4444',
          color: 'white',
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email_events">Event Updates</Label>
              <p className="text-sm text-gray-500">Get notified about new events and updates</p>
            </div>
            <Switch
              id="email_events"
              checked={settings.email_events}
              onCheckedChange={(value) => handleSwitchChange('email_events', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email_communities">Community Activity</Label>
              <p className="text-sm text-gray-500">New posts and activity in your communities</p>
            </div>
            <Switch
              id="email_communities"
              checked={settings.email_communities}
              onCheckedChange={(value) => handleSwitchChange('email_communities', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email_discussions">Discussion Replies</Label>
              <p className="text-sm text-gray-500">Replies to your discussions and comments</p>
            </div>
            <Switch
              id="email_discussions"
              checked={settings.email_discussions}
              onCheckedChange={(value) => handleSwitchChange('email_discussions', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email_marketing">Marketing & Promotions</Label>
              <p className="text-sm text-gray-500">Special offers and platform updates</p>
            </div>
            <Switch
              id="email_marketing"
              checked={settings.email_marketing}
              onCheckedChange={(value) => handleSwitchChange('email_marketing', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email_security">Security Alerts</Label>
              <p className="text-sm text-gray-500">Important security and account updates</p>
            </div>
            <Switch
              id="email_security"
              checked={settings.email_security}
              onCheckedChange={(value) => handleSwitchChange('email_security', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push_events">Event Reminders</Label>
              <p className="text-sm text-gray-500">Reminders for upcoming events</p>
            </div>
            <Switch
              id="push_events"
              checked={settings.push_events}
              onCheckedChange={(value) => handleSwitchChange('push_events', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push_communities">Community Updates</Label>
              <p className="text-sm text-gray-500">New activity in your communities</p>
            </div>
            <Switch
              id="push_communities"
              checked={settings.push_communities}
              onCheckedChange={(value) => handleSwitchChange('push_communities', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push_discussions">Discussion Activity</Label>
              <p className="text-sm text-gray-500">New replies and mentions</p>
            </div>
            <Switch
              id="push_discussions"
              checked={settings.push_discussions}
              onCheckedChange={(value) => handleSwitchChange('push_discussions', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push_messages">Direct Messages</Label>
              <p className="text-sm text-gray-500">New private messages</p>
            </div>
            <Switch
              id="push_messages"
              checked={settings.push_messages}
              onCheckedChange={(value) => handleSwitchChange('push_messages', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Frequency & Timing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Frequency & Timing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="digest_frequency">Email Digest Frequency</Label>
              <Select
                value={settings.digest_frequency}
                onValueChange={(value) => handleSelectChange('digest_frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="event_reminders">Event Reminder Timing</Label>
              <Select
                value={settings.event_reminders}
                onValueChange={(value) => handleSelectChange('event_reminders', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_hour">1 Hour Before</SelectItem>
                  <SelectItem value="1_day">1 Day Before</SelectItem>
                  <SelectItem value="1_week">1 Week Before</SelectItem>
                  <SelectItem value="never">No Reminders</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Activity & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="activity_visibility">Activity Visibility</Label>
            <Select
              value={settings.activity_visibility}
              onValueChange={(value) => handleSelectChange('activity_visibility', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Everyone can see</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Private - Only me</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="online_status">Show Online Status</Label>
              <p className="text-sm text-gray-500">Let others see when you are online</p>
            </div>
            <Switch
              id="online_status"
              checked={settings.online_status}
              onCheckedChange={(value) => handleSwitchChange('online_status', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
