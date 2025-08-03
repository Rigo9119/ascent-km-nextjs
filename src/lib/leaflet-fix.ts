import { Icon } from "leaflet";

const iconUrls = {
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png"
};

let isFixed = false;

export function fixLeafletIcons() {
  if (typeof window === 'undefined' || isFixed) return;

  // Delete the _getIconUrl method to prevent conflicts
  delete (Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;

  // Set the default icon options
  Icon.Default.mergeOptions({
    iconUrl: iconUrls.iconUrl,
    iconRetinaUrl: iconUrls.iconRetinaUrl,
    shadowUrl: iconUrls.shadowUrl,
  });

  isFixed = true;
}

export function createLocationIcon() {
  if (typeof window === 'undefined') return null;

  fixLeafletIcons();

  return new Icon({
    iconUrl: iconUrls.iconUrl,
    iconRetinaUrl: iconUrls.iconRetinaUrl,
    shadowUrl: iconUrls.shadowUrl,
    iconSize: [35, 57],
    iconAnchor: [17, 57],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: "location-detail-marker",
  });
}

export function createDefaultIcon() {
  if (typeof window === 'undefined') return null;

  fixLeafletIcons();

  return new Icon({
    iconUrl: iconUrls.iconUrl,
    iconRetinaUrl: iconUrls.iconRetinaUrl,
    shadowUrl: iconUrls.shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

export function createFeaturedIcon() {
  if (typeof window === 'undefined') return null;

  fixLeafletIcons();

  return new Icon({
    iconUrl: iconUrls.iconUrl,
    iconRetinaUrl: iconUrls.iconRetinaUrl,
    shadowUrl: iconUrls.shadowUrl,
    iconSize: [35, 57],
    iconAnchor: [17, 57],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: "featured-marker",
  });
}
