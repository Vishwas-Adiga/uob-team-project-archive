import {
  InlineNotification,
  Select,
  SelectItem,
  TextArea,
  TextInput,
  Tile,
} from "@carbon/react";
import { WidgetProps } from "./index";
import styles from "./style.module.scss";
import { WidgetHeader } from "../widget-header";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { AnnouncementPayload } from "../../state/widget-state";
import { Bullhorn } from "@carbon/icons-react";
import { Config } from "../../config";

const EXPIRY_OPTIONS = [
  {
    duration: "1d",
    name: "Expire tomorrow",
    getDate: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    duration: "3d",
    name: "Expire in 3 days",
    getDate: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    duration: "1w",
    name: "Expire in a week",
    getDate: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
];

export const Announcement = (props: WidgetProps<AnnouncementPayload>) => {
  const [defaultExpiry] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  const upstreamPayload = props.payload ?? {
    title: "New announcement",
    content: "",
    expiry: defaultExpiry,
  };

  const [announcement, setAnnouncement] = useState(upstreamPayload);
  const selectRef = useRef<HTMLSelectElement>(null);
  const expiryDate = new Date(announcement.expiry);
  const hasExpired = expiryDate.getTime() < Date.now();

  const onMove = useCallback(
    (direction: "up" | "down") => {
      props.requestMove(props.widgetId, direction);
    },
    [props]
  );

  const onSave = useCallback(() => {
    const expiry =
      EXPIRY_OPTIONS.find(
        x => x.duration === selectRef.current?.value
      )?.getDate() ?? defaultExpiry;
    props.requestUpdate(
      props.widgetId,
      {
        ...announcement,
        expiry:
          expiryDate.getTime() === defaultExpiry.getTime()
            ? expiry
            : expiryDate,
      },
      props.index,
      props.widgetType
    );
  }, [announcement]);

  const onDiscard = useCallback(() => {
    if (props.widgetId < 0) {
      props.requestDelete(props.widgetId);
    } else {
      setAnnouncement(upstreamPayload);
      props.requestEdit(props.widgetId, false);
    }
  }, [upstreamPayload]);
  const onTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAnnouncement({ ...announcement, title: event.target.value });
    },
    [announcement]
  );
  const onContentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAnnouncement({ ...announcement, content: event.target.value });
    },
    [announcement]
  );

  if (props.editState === "view" && hasExpired) {
    return <span className={styles.expiredAnnouncementWidgetPlaceholder} />;
  }

  return (
    <div>
      {props.editState !== "view" && (
        <WidgetHeader
          widgetType="Announcement"
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
      <Tile className={`${styles.widget} ${styles.announcementWidget}`}>
        {["view", "editable"].includes(props.editState) && (
          <div className={styles.announcementWidgetTitle}>
            <Bullhorn size={24} />
            <h4>{announcement.title}</h4>
          </div>
        )}
        {props.editState === "edit" && (
          <TextInput
            type="text"
            labelText="Announcement title"
            placeholder="Announcement title"
            value={announcement.title}
            onChange={onTitleChange}
          />
        )}
        {["view", "editable"].includes(props.editState) && (
          <p>{announcement.content}</p>
        )}
        {props.editState === "edit" && (
          <TextArea
            labelText="Content"
            value={announcement.content}
            onChange={onContentChange}
          />
        )}
        {props.editState === "edit" &&
          expiryDate.getTime() === defaultExpiry.getTime() && (
            <Select
              id={`announcement-${props.widgetId}`}
              size="sm"
              labelText="Expiry"
              defaultValue="1w"
              ref={selectRef}
            >
              {EXPIRY_OPTIONS.map(x => (
                <SelectItem key={x.duration} value={x.duration} text={x.name} />
              ))}
            </Select>
          )}
      </Tile>
      {props.editState === "edit" &&
        !hasExpired &&
        expiryDate.getTime() !== defaultExpiry.getTime() && (
          <InlineNotification
            hideCloseButton
            lowContrast
            kind="info"
            subtitle={`This announcement expires on ${expiryDate.toLocaleString()} after which it will not be shown on your ${
              Config.APP.NAME
            }`}
          />
        )}
      {["editable", "edit"].includes(props.editState) && hasExpired && (
        <InlineNotification
          hideCloseButton
          lowContrast
          subtitle={`This announcement expired on ${expiryDate.toLocaleString()} and will not be shown on your ${
            Config.APP.NAME
          }`}
        />
      )}
    </div>
  );
};
