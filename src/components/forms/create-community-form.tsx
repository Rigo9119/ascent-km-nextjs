'use client'

import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "./form-components/form-input";
import FormTextarea from "./form-components/form-textarea";
import FormSelect from "./form-components/form-select";
import { Users, ArrowLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { CommunityType } from "@/types/community";
import { CommunitiesService } from "@/services/communities-service";
import { createSupabaseClient } from "@/lib/supabase/client";

interface CreateCommunityFormProps {
  userId: string;
  onCancel?: () => void;
}

export default function CreateCommunityForm({ userId, onCancel }: CreateCommunityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [communityTypes, setCommunityTypes] = useState<CommunityType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCommunityTypes = async () => {
      try {
        const supabase = createSupabaseClient();
        const communitiesService = new CommunitiesService(supabase);
        const types = await communitiesService.getAllCommunityTypes();
        setCommunityTypes(types || []);
      } catch (error) {
        console.error('Error fetching community types:', error);
        toast.error('Error al cargar los tipos de comunidad');
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchCommunityTypes();
  }, []);

  const createCommunityForm = useForm({
    defaultValues: {
      id: uuidv4(),
      name: "",
      description: "",
      long_description: "",
      community_type_id: "",
      is_public: true,
      organizer_id: userId,
      tags: [] as string[],
      rules: [] as string[],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/communities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });

        if (!response.ok) {
          const errorData = await response.json();

          throw new Error(errorData.error || 'Failed to create community');
        }

        const result = await response.json();

        toast.success('¡Comunidad creada exitosamente!', {
          style: { background: '#10b981', color: 'white' }
        });

        router.push(`/communities/${result.community.id}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al crear la comunidad. Por favor intenta de nuevo.';

        toast.error(errorMessage, {
          style: { background: '#ef4444', color: 'white' }
        });
        console.error('Create community error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    createCommunityForm.handleSubmit();
  };

  const communityTypeOptions = communityTypes.map(type => ({
    value: type.id,
    label: type.name
  }));

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
          Volver
        </Button>
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Crear Nueva Comunidad</h1>
        </div>
      </div>

      <form onSubmit={(event) => handleSubmit(event)} className="space-y-6">
        {/* Basic Information */}
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Users className="w-5 h-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <createCommunityForm.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'El nombre de la comunidad es requerido' : undefined,
              }}
            >
              {(field) => (
                <FormInput
                  field={field}
                  label="Nombre de la Comunidad"
                  placeholder="Introduce el nombre de tu comunidad"
                  name={field.name}
                  value={field.state.value}
                  type="text"
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </createCommunityForm.Field>

            <createCommunityForm.Field
              name="description"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'La descripción es requerida' : undefined,
              }}
            >
              {(field) => (
                <FormTextarea
                  field={field}
                  label="Descripción Corta"
                  placeholder="Una breve descripción de tu comunidad"
                  value={field.state.value}
                  name={field.name}
                  rows={3}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </createCommunityForm.Field>

            <createCommunityForm.Field name="community_type_id">
              {(field) => (
                <FormSelect
                  field={field}
                  label="Tipo de Comunidad"
                  value={field.state.value}
                  placeholder={loadingTypes ? "Cargando tipos..." : "Selecciona un tipo"}
                  options={communityTypeOptions}
                  onValueChange={(value) => field.handleChange(value)}
                />
              )}
            </createCommunityForm.Field>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Información Detallada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <createCommunityForm.Field name="long_description">
              {(field) => (
                <FormTextarea
                  field={field}
                  label="Descripción Completa"
                  placeholder="Proporciona una descripción detallada de tu comunidad, sus objetivos y actividades"
                  value={field.state.value}
                  name={field.name}
                  rows={6}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </createCommunityForm.Field>
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
            Cancelar
          </Button>

          <createCommunityForm.Subscribe>
            {({ isSubmitting: formSubmitting }) => (
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                disabled={isSubmitting || formSubmitting}
              >
                {isSubmitting || formSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Crear Comunidad
                  </>
                )}
              </Button>
            )}
          </createCommunityForm.Subscribe>
        </div>
      </form>
    </div>
  );
}
