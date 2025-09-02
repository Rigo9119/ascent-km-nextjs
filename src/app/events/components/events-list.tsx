"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/lib/types/supabase";
import { useRouter } from "next/navigation";
import { useJoinEvent } from "@/hooks/use-join-event";
import AuthRequiredModal from "@/components/auth-required-modal";
import ShareButton from "@/components/share-button";
import { Share2 } from "lucide-react";

interface EventsListProps {
  events: Tables<"events_with_details_v2">[];
  loading?: boolean;
}

export default function EventsList({ events, loading = false }: EventsListProps) {
  const router = useRouter();
  const { showAuthModal, handleJoinEvent, closeAuthModal } = useJoinEvent({
    onJoin: async (eventId) => {
      // TODO: Implement actual join event logic here
      console.log('User is joining event:', eventId);
    }
  });

  if (loading) {
    return (
      <div className="lg:col-span-3">
        <div className="text-center py-8">Cargando eventos...</div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Próximos Eventos</h1>
          <p className="text-muted-foreground">
            {events.length} evento{events.length !== 1 ? "s" : ""} encontrado{events.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {events?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron eventos
          </div>
        ) : (
          events?.map((event, index) => (
            <Card key={event.event_id || index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{event.event_name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>📅 {event.date ? new Date(event.date).toLocaleDateString() : 'Fecha por definir'}</span>
                      <span>📍 {event.location_name || 'Ubicación por definir'}</span>
                      {event.is_free && <span>💰 Gratis</span>}
                    </div>
                  </div>
                  <Badge variant="secondary">{event.category_name}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{event.event_description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button 
                      className="bg-emerald-500 hover:bg-emerald-600" 
                      size="sm"
                      onClick={() => handleJoinEvent(event.event_id || '')}
                    >
                      Unirse al Evento
                    </Button>
                    <Button 
                      className="border-emerald-500 text-emerald-500 hover:text-emerald-500" 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/events/${event.event_id}`)}
                    >
                      Saber Más
                    </Button>
                  </div>
                  <ShareButton
                    url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/events/${event.event_id}`}
                    title={event.event_name || ''}
                    description={event.event_description || ''}
                    size="sm"
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-700"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        title="Unirse al Evento"
        description="Crea una cuenta para unirte a eventos y conectar con la comunidad."
      />
    </div>
  );
}