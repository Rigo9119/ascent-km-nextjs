import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function BlogNotFound() {
  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto text-center space-y-8 py-16">
        <Card>
          <CardContent className="p-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900">Artículo No Encontrado</h1>
                <p className="text-lg text-gray-600">
                  El artículo del blog que estás buscando no existe o ha sido movido.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Esto puede suceder si el artículo fue despublicado, la URL fue mal escrita,
                  o el contenido ha sido reubicado.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
                  <Link href="/blogs">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al Blog
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">
                    Ir al Inicio
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
