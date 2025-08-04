'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  CreditCard, 
  AlertTriangle, 
  Trash2, 
  Mail, 
  Calendar,
  Download,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface UserSettings {
  id: string;
  full_name: string;
  username: string;
  created_at: string;
}

interface AccountSettingsProps {
  userId: string;
  userEmail: string;
  userSettings: UserSettings;
}

export default function AccountSettings({ userId, userEmail, userSettings }: AccountSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [newEmail, setNewEmail] = useState(userEmail);
  const [confirmationText, setConfirmationText] = useState('');
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  
  const handleEmailUpdate = async () => {
    if (newEmail === userEmail) {
      toast.error('Please enter a different email address.', {
        style: { background: '#ef4444', color: 'white' }
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newEmail
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update email');
      }

      toast.success('Email update initiated! Please check your new email for confirmation.', {
        style: {
          background: '#10b981',
          color: 'white',
        }
      });
    } catch (error) {
      toast.error('Failed to update email. Please try again.', {
        style: {
          background: '#ef4444',
          color: 'white',
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (confirmationText !== userSettings.username) {
      toast.error('Please type your username exactly to confirm.', {
        style: { background: '#ef4444', color: 'white' }
      });
      return;
    }

    setIsDeactivating(true);
    try {
      const response = await fetch('/api/settings/deactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          confirmation: confirmationText
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate account');
      }

      toast.success('Account deactivated successfully. You will be redirected shortly.', {
        style: {
          background: '#10b981',
          color: 'white',
        }
      });

      // Redirect to home page after deactivation
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      toast.error('Failed to deactivate account. Please try again.', {
        style: {
          background: '#ef4444',
          color: 'white',
        }
      });
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleDataExport = async () => {
    try {
      const response = await fetch(`/api/settings/export?userId=${userId}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${userSettings.username}-account-data.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Account data exported successfully!', {
        style: { background: '#10b981', color: 'white' }
      });
    } catch (error) {
      toast.error('Failed to export account data.', {
        style: { background: '#ef4444', color: 'white' }
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Username</Label>
              <div className="flex items-center gap-2">
                <Input value={userSettings.username} disabled />
                <Badge variant="secondary">Fixed</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">Username cannot be changed</p>
            </div>
            
            <div>
              <Label>Member Since</Label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{formatDate(userSettings.created_at)}</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
              />
              <Button 
                onClick={handleEmailUpdate} 
                disabled={isLoading || newEmail === userEmail}
                variant="outline"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Updating...' : 'Update'}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              You'll receive a confirmation email at your new address
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Subscription & Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription & Billing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Free Plan</h4>
              <p className="text-sm text-gray-500">Access to basic features</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Upgrade to Premium</h4>
              <p className="text-sm text-gray-500">Unlock advanced features and priority support</p>
            </div>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <ExternalLink className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Download Your Data</h4>
              <p className="text-sm text-gray-500">Export all your account data and activity</p>
            </div>
            <Button variant="outline" onClick={handleDataExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Data Processing</h4>
              <p className="text-sm text-gray-500">Request data deletion or correction</p>
            </div>
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Account deactivation is permanent and cannot be undone. All your data will be deleted.
            </AlertDescription>
          </Alert>

          {!showDeactivateConfirm ? (
            <Button 
              variant="outline" 
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setShowDeactivateConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Deactivate Account
            </Button>
          ) : (
            <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-medium text-red-800">Confirm Account Deactivation</h4>
              <p className="text-sm text-red-700">
                This action cannot be undone. Type your username "<strong>{userSettings.username}</strong>" to confirm:
              </p>
              
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={`Type "${userSettings.username}" to confirm`}
                className="border-red-200"
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeactivateConfirm(false);
                    setConfirmationText('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDeactivateAccount}
                  disabled={isDeactivating || confirmationText !== userSettings.username}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeactivating ? 'Deactivating...' : 'Deactivate Account'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}