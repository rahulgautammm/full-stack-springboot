import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 12);
  return null;
};

const MapView = ({ incidents }) => {
  const defaultCenter = [20.5937, 78.9629]; // India Center

  return (
    <MapContainer center={defaultCenter} zoom={5} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {incidents && incidents.length > 0 && <ChangeView center={[incidents[0].latitude, incidents[0].longitude]} />}
      
      {incidents && incidents.map((incident) => (
        <Marker key={incident.id} position={[incident.latitude, incident.longitude]}>
          <Popup>
            <strong>{incident.type}</strong><br/>
            Severity: {incident.severity}<br/>
            Status: {incident.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
