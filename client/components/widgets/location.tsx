import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Tile } from "@carbon/react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { WidgetProps } from "./index";
import { LocationPayload } from "../../state/widget-state";
import { WidgetHeader } from "../widget-header";
import styles from "./style.module.scss";
import { TextArea, TextInput } from "@carbon/react";

export const Location = (props: WidgetProps<LocationPayload>) => {
  const upstreamPayload: LocationPayload = props.payload ?? {
    title: "",
    description: "",
    latitude: 52.450241978864895,
    longitude: -1.9358069080201434,
  };

  const [location, setLocation] = useState(upstreamPayload);

  const onMove = useCallback(
    (direction: "up" | "down") => {
      props.requestMove(props.widgetId, direction);
    },
    [props]
  );

  const onSave = useCallback(() => {
    props.requestUpdate(
      props.widgetId,
      location,
      props.index,
      props.widgetType
    );
  }, [location]);

  const onDiscard = useCallback(() => {
    if (props.widgetId < 0) {
      props.requestDelete(props.widgetId);
    } else {
      setLocation(upstreamPayload);
      props.requestEdit(props.widgetId, false);
    }
  }, [upstreamPayload]);

  const onTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLocation({ ...location, title: event.target.value });
    },
    [location]
  );
  const onDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setLocation({ ...location, description: event.target.value });
    },
    [location]
  );
  return (
    <div>
      {props.editState !== "view" && (
        <WidgetHeader
          widgetType="Location"
          editState={props.editState}
          reorderButtonsDisabled={
            props.widgetId < 0 ? [true, true] : props.reorderButtonsDisabled
          }
          requestEdit={props.requestEdit.bind(null, props.widgetId, true)}
          requestDelete={props.requestDelete.bind(null, props.widgetId)}
          requestDiscard={onDiscard}
          requestSave={onSave}
          requestMove={onMove}
        />
      )}
      <Tile className={`${styles.widget} ${styles.locationWidget}`}>
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={50}
          zoomControl={true}
          doubleClickZoom={false}
          dragging={true}
          scrollWheelZoom={props.editState === "edit"}
        >
          <MapLayer location={location} setLocation={setLocation} />
        </MapContainer>
        {["view", "editable"].includes(props.editState) && (
          <h4>{location.title}</h4>
        )}

        {props.editState === "edit" && (
          <TextInput
            type="text"
            labelText="Why this place is important to me"
            placeholder=""
            value={location.title}
            onChange={onTitleChange}
          />
        )}

        {["view", "editable"].includes(props.editState) && (
          <p>{location.description}</p>
        )}

        {props.editState === "edit" && (
          <TextArea
            labelText="Description of the place"
            value={location.description}
            onChange={onDescriptionChange}
          />
        )}
      </Tile>
    </div>
  );
};

const MapLayer = (props: { location: LocationPayload; setLocation: any }) => {
  const map = useMap();

  const onMove = useCallback(() => {
    const centre = map.getCenter();
    props.setLocation(location => ({
      ...location,
      latitude: centre.lat,
      longitude: centre.lng,
    }));
  }, [map]);

  useEffect(() => {
    map.on("move", onMove);
    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);
  return (
    <>
      <TileLayer
        // @ts-ignore
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[props.location.latitude, props.location.longitude]} />
    </>
  );
};
