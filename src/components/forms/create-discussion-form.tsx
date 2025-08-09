'use client'
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import FormInput from "./form-components/form-input";
import FormTextarea from "./form-components/form-textarea";
import { MessageSquare, Link2, ArrowLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface CreateDiscussionFormProps {
  communityId: string;
  userId: string;
  onCancel?: () => void;
}

export default function CreateDiscussionForm({ communityId, userId, onCancel }: CreateDiscussionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const createDiscussionForm = useForm({
    defaultValues: {
      id: uuidv4(),
      community_id: communityId,
      user_id: userId,
      title: "",
      content: "",
      link_url: "",
      link_title: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);

      try {
        console.log('Submitting discussion data:', value);

        const response = await fetch('/api/discussions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error Response:', errorData);
          throw new Error(errorData.error || 'Failed to create discussion:', errorData.message);
        }

        const result = await response.json();
        console.log('Discussion created successfully:', result);

        toast.success('Discussion created successfully!', {
          style: { background: '#10b981', color: 'white' }
        });

        router.push(`/communities/discussions/${result.discussion.id}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create discussion. Please try again.';

        toast.error(errorMessage, {
          style: { background: '#ef4444', color: 'white' }
        });
        console.error('Create discussion error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    createDiscussionForm.handleSubmit();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCancel ? onCancel() : router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-emerald-500" />
          <h1 className="text-2xl font-bold">Start a Discussion</h1>
        </div>
      </div>

      <form onSubmit={(event) => handleSubmit(event)} className="space-y-6">
        {/* Main Discussion Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Discussion Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <createDiscussionForm.Field
              name="title"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'Discussion title is required' : undefined,
              }}
            >
              {(field) => (
                <FormInput
                  field={field}
                  label="Title"
                  placeholder="What would you like to discuss?"
                  name={field.name}
                  value={field.state.value}
                  type="text"
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </createDiscussionForm.Field>

            <createDiscussionForm.Field
              name="content"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'Discussion content is required' : undefined,
              }}
            >
              {(field) => (
                <FormTextarea
                  field={field}
                  label="Content"
                  placeholder="Share your thoughts, questions, or ideas with the community..."
                  value={field.state.value}
                  name={field.name}
                  rows={6}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </createDiscussionForm.Field>
          </CardContent>
        </Card>

        {/* Optional Link Attachment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Attach Link (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <createDiscussionForm.Field name="link_title">
              {(field) => (
                <FormInput
                  field={field}
                  label="Link Title"
                  placeholder="Give your link a descriptive title"
                  name={field.name}
                  value={field.state.value}
                  type="text"
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </createDiscussionForm.Field>

            <createDiscussionForm.Field name="link_url">
              {(field) => (
                <FormInput
                  field={field}
                  label="Link URL"
                  placeholder="https://example.com"
                  name={field.name}
                  value={field.state.value}
                  type="url"
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </createDiscussionForm.Field>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onCancel ? onCancel() : router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <createDiscussionForm.Subscribe>
            {({ isSubmitting: formSubmitting }) => (
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600"
                disabled={isSubmitting || formSubmitting}
              >
                {isSubmitting || formSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Create Discussion
                  </>
                )}
              </Button>
            )}
          </createDiscussionForm.Subscribe>
        </div>
      </form>
    </div>
  );
}
