"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, StarIcon, ExternalLinkIcon, PhoneIcon, ClockIcon, GlobeIcon } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Tables } from "@/lib/types/supabase";

// Dynamically import the map to avoid SSR issues
const LocationMap = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface LocationDetailClientProps {
  location: Tables<"locations">;
}

export default function LocationDetailClient({ location }: LocationDetailClientProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative">
        {location.image_url && (
          <div className="h-64 md:h-96 w-full rounded-lg overflow-hidden mb-6">
            <Image
              height={400}
              width={800}
              src={location.image_url}
              alt={location.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {location.tags && location.tags.length > 0 && (
                <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
                  {location.tags[0]}
                </Badge>
              )}
              {location.is_featured && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <StarIcon className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {location.name}
            </h1>
            {location.description && (
              <p className="text-lg text-gray-600 mb-6">
                {location.description}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
              <MapPinIcon className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
            {location.website && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open(location.website!, '_blank')}
              >
                <ExternalLinkIcon className="w-4 h-4 mr-2" />
                Visit Website
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">{location.address || 'Address not available'}</p>
                  </div>
                </div>

                {location.phone && (
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">{location.phone}</p>
                    </div>
                  </div>
                )}

                {location.open_hour && location.close_hour && (
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">Hours</p>
                      <p className="text-gray-600">
                        {location.open_hour}:00 - {location.close_hour}:00
                      </p>
                    </div>
                  </div>
                )}

                {location.website && (
                  <div className="flex items-center gap-3">
                    <GlobeIcon className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a
                        href={location.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Map Section */}
          {location.lat && location.lng && (
            <Card>
              <CardHeader>
                <CardTitle>Location on Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full rounded-lg overflow-hidden">
                  <LocationMap location={location} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* About Section */}
          {location.best_time && (
            <Card>
              <CardHeader>
                <CardTitle>About This Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Best time to visit:</strong> {location.best_time}
                  </p>
                  {location.tips && location.tips.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Tips:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {location.tips.map((tip, index) => (
                          <li key={index} className="text-gray-700">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {location.tags && location.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {location.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rating Card */}

          <Card>
            <CardHeader>
              <CardTitle>Rating & Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(location.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold">{location.rating}</span>
              </div>
              <p className="text-gray-600">Based on {location.review_count} reviews</p>
            </CardContent>
          </Card>


          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {location.price && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price Range</span>
                  <span className="font-medium">{location.price}</span>
                </div>
              )}

              {location.days_open && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Days Open</span>
                  <span className="font-medium">{location.days_open}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Added</span>
                <span className="font-medium">
                  {location.created_at ? new Date(location.created_at).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-emerald-800">
                  Plan Your Visit
                </h3>
                <Button size="lg" className="w-full bg-emerald-500 hover:bg-emerald-600">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
                <p className="text-sm text-emerald-700">
                  {location.is_featured ? 'Featured location - highly recommended!' : 'Discover this amazing location'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
