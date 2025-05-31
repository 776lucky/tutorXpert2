import React, { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useToast } from "@/components/ui/use-toast";

// ✅ 修复 Leaflet 默认图标路径
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

// ✅ 用户定位后飞过去
const FlyToUser = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (
      Array.isArray(position) &&
      typeof position[0] === "number" &&
      typeof position[1] === "number"
    ) {
      map.flyTo(position, 10, { duration: 1.5 });
    }
  }, [position, map]);

  return null;
};

// ✅ 地图事件监听组件（代替 whenCreated）
const MapEvents = ({ onBoundsChange }) => {
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const newBounds = {
        north: ne.lat,
        south: sw.lat,
        east: ne.lng,
        west: sw.lng,
      };
      console.log("📦 地图边界变更触发，收到参数:", newBounds);
      onBoundsChange?.(newBounds);
    },
  });

  return null;
};

const MapView = ({ tutors = [], onTutorClick, onBoundsChange }) => {
  const defaultCenter = [-33.87, 151.21]; // Sydney center
  const [userPosition, setUserPosition] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { lat, lng } = pos.coords;
          if (typeof lat === "number" && typeof lng === "number") {
            setUserPosition([lat, lng]);
          }
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
          toast({
            title: "Location Access Denied",
            description: "We couldn't access your location. You can still browse tutors manually.",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);

  const tutorMarkers = useMemo(() => {
    return tutors.map((tutor) => {
      const validCoords =
        typeof tutor.lat === "number" && typeof tutor.lng === "number";

      if (!validCoords) return null;

      return (
        <Marker
          key={tutor.id}
          position={[tutor.lat, tutor.lng]}
          eventHandlers={{
            click: () => onTutorClick?.(tutor.id),
          }}
        >
          <Popup>
            <strong>{tutor.name}</strong>
            <br />
            {tutor.subjects?.[0]}
            <br />
            {tutor.address}
          </Popup>
        </Marker>
      );
    });
  }, [tutors, onTutorClick]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      scrollWheelZoom={true}
      className="w-full h-full min-h-[600px] z-0 rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapEvents onBoundsChange={onBoundsChange} />

      {userPosition && <FlyToUser position={userPosition} />}

      {userPosition && (
        <Marker position={userPosition}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {tutorMarkers}
    </MapContainer>
  );
};

export default MapView;
