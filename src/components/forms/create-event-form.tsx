'use client'

import { User } from "@supabase/supabase-js";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";

// Form Components
import { FormInput } from "./form-components/form-input";
import FormTextarea from "./form-components/form-textarea";
import { FormDatePicker } from "./form-components/form-date-picker";
import FormSelect from "./form-components/form-select";
import FormFileInput from "./form-components/form-file-input";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  DollarSign,
  Upload,
  Save,
  X
} from "lucide-react";

interface CreateEventFormProps {
  user: User;
  locations?: Array<{ id: string; name: string }>;
  categories?: Array<{ id: string; name: string }>;
  eventTypes?: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateEventForm({
  user,
  locations = [],
  categories = [],
  eventTypes = [],
  onSuccess,
  onCancel
}: CreateEventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(user)
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      long_description: '',
      date: undefined as Date | undefined,
      time: '',
      location_id: '',
      category_id: '',
      event_type_id: '',
      is_free: true,
      price: 0,
      max_participants: 50,
      contact_email: user.email || '',
      contact_phone: '',
      website: '',
      image_url: '',
      is_featured: false,
      requirements: [] as string[],
      highlights: [] as string[],
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);

      try {
        const eventData = {
          ...value,
          organizer_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'draft'
        };

        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          throw new Error('Failed to create event');
        }

        toast.success('Event created successfully!', {
          style: { background: '#10b981', color: 'white' }
        });

        onSuccess?.();
      } catch (error) {
        toast.error('Failed to create event. Please try again.', {
          style: { background: '#ef4444', color: 'white' }
        });
        console.error('Create event error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const locationOptions = locations.map((location) => ({
    value: location.id,
    label: location.name
  }));

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name
  }));

  const eventTypeOptions = eventTypes.map((type) => ({
    value: type.id,
    label: type.name
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 px-4"
    >
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Event title is required' : undefined,
            }}
          >
            {(field) => (
              <FormInput
                field={field}
                label="Event Title"
                name={field.name}
                type="text"
                placeholder="Enter event title"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <FormTextarea
                field={field}
                label="Short Description"
                name={field.name}
                placeholder="Brief description of your event"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                rows={3}
              />
            )}
          </form.Field>

          <form.Field name="long_description">
            {(field) => (
              <FormTextarea
                field={field}
                label="Detailed Description"
                name={field.name}
                placeholder="Provide detailed information about your event"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                rows={6}
              />
            )}
          </form.Field>
        </CardContent>
      </Card>

      {/* Date, Time & Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Date, Time & Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="date"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'Event date is required' : undefined,
              }}
            >
              {(field) => (
                <FormDatePicker
                  field={field}
                  label="Event Date"
                  placeholder="Select event date"
                  value={field.state.value}
                  onChange={(date) => field.handleChange(date)}
                />
              )}
            </form.Field>

            <form.Field name="time">
              {(field) => (
                <FormInput
                  field={field}
                  label="Event Time"
                  name={field.name}
                  type="time"
                  placeholder="Select event time"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
          </div>

          <form.Field name="location_id">
            {(field) => (
              <FormSelect
                field={field}
                label="Location"
                placeholder="Select a location"
                value={field.state.value}
                options={locationOptions}
                onValueChange={(value) => field.handleChange(value)}
              />
            )}
          </form.Field>
        </CardContent>
      </Card>

      {/* Categories & Type */}
      <Card>
        <CardHeader>
          <CardTitle>Categories & Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field name="category_id">
              {(field) => (
                <FormSelect
                  field={field}
                  label="Category"
                  placeholder="Select a category"
                  value={field.state.value}
                  options={categoryOptions}
                  onValueChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>

            <form.Field name="event_type_id">
              {(field) => (
                <FormSelect
                  field={field}
                  label="Event Type"
                  placeholder="Select event type"
                  value={field.state.value}
                  options={eventTypeOptions}
                  onValueChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Capacity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing & Capacity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form.Field name="is_free">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_free"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
                <Label htmlFor="is_free">This is a free event</Label>
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field name="price">
              {(field) => (
                <FormInput
                  field={field}
                  label="Price ($)"
                  name={field.name}
                  type="number"
                  placeholder="0.00"
                  value={field.state.value.toString()}
                  onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>

            <form.Field name="max_participants">
              {(field) => (
                <FormInput
                  field={field}
                  label="Maximum Participants"
                  name={field.name}
                  type="number"
                  placeholder="50"
                  value={field.state.value.toString()}
                  onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field name="contact_email">
              {(field) => (
                <FormInput
                  field={field}
                  label="Contact Email"
                  name={field.name}
                  type="email"
                  placeholder="contact@example.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>

            <form.Field name="contact_phone">
              {(field) => (
                <FormInput
                  field={field}
                  label="Contact Phone"
                  name={field.name}
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
          </div>

          <form.Field name="website">
            {(field) => (
              <FormInput
                field={field}
                label="Website (Optional)"
                name={field.name}
                type="url"
                placeholder="https://example.com"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            )}
          </form.Field>
        </CardContent>
      </Card>

      {/* Requirements & Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements & Highlights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Requirements */}
          <form.Field name="requirements" mode="array">
            {(field) => (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Requirements</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => field.pushValue('')}
                  >
                    Add Requirement
                  </Button>
                </div>

                <div className="space-y-2">
                  {field.state.value.map((_, i) => (
                    <form.Field key={i} name={`requirements[${i}]`}>
                      {(subField) => (
                        <div className="flex gap-2">
                          <FormInput
                            field={subField}
                            label=""
                            name={subField.name}
                            type="text"
                            placeholder="Enter requirement"
                            value={subField.state.value}
                            onChange={(e) => subField.handleChange(e.target.value)}
                            onBlur={subField.handleBlur}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.removeValue(i)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </form.Field>
                  ))}
                </div>

                {field.state.value.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">No requirements added yet.</p>
                )}
              </div>
            )}
          </form.Field>

          {/* Highlights */}
          <form.Field name="highlights" mode="array">
            {(field) => (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Highlights</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => field.pushValue('')}
                  >
                    Add Highlight
                  </Button>
                </div>

                <div className="space-y-2">
                  {field.state.value.map((_, i) => (
                    <form.Field key={i} name={`highlights[${i}]`}>
                      {(subField) => (
                        <div className="flex gap-2">
                          <FormInput
                            field={subField}
                            label=""
                            name={subField.name}
                            type="text"
                            placeholder="Enter highlight"
                            value={subField.state.value}
                            onChange={(e) => subField.handleChange(e.target.value)}
                            onBlur={subField.handleBlur}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.removeValue(i)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </form.Field>
                  ))}
                </div>

                {field.state.value.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">No highlights added yet.</p>
                )}
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Event Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form.Field name="image_url">
            {(field) => (
              <FormFileInput
                field={field}
                label="Event Image"
                id={field.name}
                name={field.name}
                src={field.state.value || ""}
                alt="Event image"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            )}
          </form.Field>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </Button>
      </div>
    </form>

  );
}
