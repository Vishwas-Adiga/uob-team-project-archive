import React from "react";
import { Tile } from "@carbon/react";
import styles from "./style.module.scss";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

interface WidgetLocationProps {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
}

export const WidgetLocation = (props: WidgetLocationProps) => (
  <Tile className={styles.container}>
    <MapContainer
      className={styles.map}
      center={[props.latitude, props.longitude]}
      zoom={12}
      zoomControl={false}
      doubleClickZoom={false}
      dragging={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        // @ts-ignore
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
    <div>Where I'm from</div>
    <h3 style={{ fontWeight: "bold" }}>{props.title}</h3>
  </Tile>
);
