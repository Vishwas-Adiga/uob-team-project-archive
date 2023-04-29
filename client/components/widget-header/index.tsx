import { IconButton, Tag } from "@carbon/react";
import { WidgetEditState, WidgetType } from "../../state/widget-state";
import styles from "./style.module.scss";
import {
  ArrowDown,
  ArrowUp,
  Checkmark,
  CloseOutline,
  Edit,
  TrashCan,
} from "@carbon/icons-react";

export interface WidgetHeaderProps {
  editState: WidgetEditState;
  widgetType: WidgetType;
  reorderButtonsDisabled: [boolean, boolean];
  requestEdit: () => void;
  requestDelete: () => void;
  requestSave: () => void;
  requestDiscard: () => void;
  requestMove: (direction: "up" | "down") => void;
}

type UserFacingWidgetNames = {
  [key in WidgetType]: { name: string; colour: string };
};
const USER_FACING_WIDGET_NAMES: UserFacingWidgetNames = {
  Announcement: { name: "Announcement", colour: "magenta" },
  File: { name: "File", colour: "purple" },
  Link: { name: "Link", colour: "teal" },
  Location: { name: "Location", colour: "cyan" },
  Module: { name: "My modules", colour: "green" },
  RichText: { name: "Text", colour: "warm-gray" },
  Social: { name: "Socials", colour: "red" },
};

export const WidgetHeader = (props: WidgetHeaderProps) => {
  return (
    <div className={styles.container}>
      <Tag type={USER_FACING_WIDGET_NAMES[props.widgetType].colour} size="sm">
        {USER_FACING_WIDGET_NAMES[props.widgetType].name}
      </Tag>
      <span />
      <IconButton
        kind="ghost"
        label="Move up"
        onClick={props.requestMove.bind(null, "up")}
        disabled={props.reorderButtonsDisabled[0]}
      >
        <ArrowUp />
      </IconButton>
      <IconButton
        kind="ghost"
        label="Move down"
        onClick={props.requestMove.bind(null, "down")}
        disabled={props.reorderButtonsDisabled[1]}
      >
        <ArrowDown />
      </IconButton>
      {props.editState === "editable" && (
        <IconButton kind="ghost" label="Edit" onClick={props.requestEdit}>
          <Edit />
        </IconButton>
      )}
      {props.editState === "editable" && (
        <IconButton
          kind="danger--tertiary"
          label="Delete"
          onClick={props.requestDelete}
        >
          <TrashCan />
        </IconButton>
      )}
      {props.editState === "edit" && (
        <IconButton
          kind="ghost"
          label="Discard changes"
          onClick={props.requestDiscard}
        >
          <CloseOutline />
        </IconButton>
      )}
      {props.editState === "edit" && (
        <IconButton label="Save changes" onClick={props.requestSave}>
          <Checkmark />
        </IconButton>
      )}
    </div>
  );
};
