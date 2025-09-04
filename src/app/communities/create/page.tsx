'use client'

import { PageContainer } from "@/components/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function CreateCommunityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth');
      return;
    }
    
    setIsLoading(true);
    // TODO: Implement community creation logic
    setIsLoading(false);
  };

  if (!user) {
    router.push('/auth');
    return null;
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Crear Nueva Comunidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  Nombre de la comunidad
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Introduce el nombre de tu comunidad"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe de qué trata tu comunidad"
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">
                  Tipo de comunidad
                </Label>
                <Select name="type">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="tech">Tecnología</SelectItem>
                    <SelectItem value="sports">Deportes</SelectItem>
                    <SelectItem value="arts">Arte y Cultura</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isLoading ? 'Creando...' : 'Crear Comunidad'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}