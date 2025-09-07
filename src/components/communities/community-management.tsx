'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Settings,
  Users,
  Trash2,
  Save,
  UserMinus,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Community } from '@/types/community';
import { CommunityMember } from './community-header';
import { toast } from 'sonner';

interface CommunityManagementProps {
  community: Community;
  members: CommunityMember[];
  currentUser: User;
}

export default function CommunityManagement({
  community,
  members,
  currentUser
}: CommunityManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [formData, setFormData] = useState({
    name: community.name || '',
    description: community.description || '',
    long_description: community.long_description || '',
    is_public: community.is_public || false,
    rules: community.rules || []
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/communities/${community.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update community');
      }

      toast.success('Community settings updated successfully!');
    } catch (error) {
      console.error('Error updating community:', error);
      toast.error('Failed to update community settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const response = await fetch(`/api/communities/${community.id}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      toast.success('Member removed successfully');
      // Refresh the page to update member list
      window.location.reload();
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  };

  const handleDeleteCommunity = async () => {
    if (deleteConfirmText !== community.name) {
      toast.error(`Please type "${community.name}" to confirm deletion`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/communities/${community.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete community');
      }

      toast.success('Community deleted successfully');
      window.location.href = '/communities';
    } catch (error) {
      console.error('Error deleting community:', error);
      toast.error('Failed to delete community');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setDeleteConfirmText('');
    }
  };

  const handleDeleteModalOpen = () => {
    setShowDeleteModal(true);
    setDeleteConfirmText('');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="danger" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Danger Zone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Community Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter community name"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => handleInputChange('is_public', checked)}
                  />
                  <Label htmlFor="is_public">Public Community</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of your community"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="long_description">Detailed Description</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) => handleInputChange('long_description', e.target.value)}
                  placeholder="Detailed description of your community"
                  rows={5}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.profiles?.avatar_url || ''} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-600">
                          {member.profiles?.full_name?.slice(0, 2) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.profiles?.full_name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">@{member.profiles?.username}</p>
                      </div>
                      {member.role && (
                        <Badge variant={member.role === 'organizer' ? 'default' : 'secondary'}>
                          <Shield className="w-3 h-3 mr-1" />
                          {member.role}
                        </Badge>
                      )}
                    </div>
                    
                    {member.user_id !== currentUser.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMember(member.user_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserMinus className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="mt-6">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="font-medium text-red-800 mb-2">Delete Community</h3>
                  <p className="text-sm text-red-600 mb-4">
                    This action cannot be undone. This will permanently delete your community,
                    all discussions, and remove all members.
                  </p>
                  <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={handleDeleteModalOpen}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Community
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Community</DialogTitle>
                        <DialogDescription className="text-gray-600">
                          This action cannot be undone. This will permanently delete the{' '}
                          <span className="font-semibold text-gray-900">{community.name}</span> community,
                          all its discussions, and remove all members.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4">
                        <Label htmlFor="delete-confirm" className="text-sm font-medium text-gray-700">
                          To confirm deletion, please type the community name exactly:
                        </Label>
                        <div className="mt-2 mb-3">
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                            {community.name}
                          </code>
                        </div>
                        <Input
                          id="delete-confirm"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="Enter community name"
                          className="w-full"
                          autoComplete="off"
                        />
                      </div>

                      <DialogFooter className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteModal(false)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteCommunity}
                          disabled={isLoading || deleteConfirmText !== community.name}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Community
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}