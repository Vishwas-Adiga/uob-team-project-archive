import { IconButton, Tag } from "@carbon/react";
import { WidgetEditState, WidgetType } from "../../state/widget-state";
import styles from "./style.module.scss";
import { Checkmark, CloseOutline, Edit, TrashCan } from "@carbon/icons-react";

export interface WidgetHeaderProps {
  editState: WidgetEditState;
  widgetType: WidgetType;
  onRequestEdit: () => void;
  onRequestDelete: () => void;
  onRequestSave: () => void;
  onRequestDiscard: () => void;
}

type UserFacingWidgetNames = { [key in WidgetType]?: string };
const USER_FACING_WIDGET_NAMES: UserFacingWidgetNames = {
  Module: "My modules",
};

export const WidgetHeader = (props: WidgetHeaderProps) => {
  return (
    <div className={styles.container}>
      <Tag type="green" size="sm">
        {USER_FACING_WIDGET_NAMES[props.widgetType]}
      </Tag>
      <span />
      {props.editState === "editable" && (
        <IconButton kind="secondary" label="Edit" onClick={props.onRequestEdit}>
          <Edit />
        </IconButton>
      )}
      {props.editState === "editable" && (
        <IconButton
          kind="danger--tertiary"
          label="Delete"
          onClick={props.onRequestDelete}
        >
          <TrashCan />
        </IconButton>
      )}
      {props.editState === "edit" && (
        <IconButton label="Save changes" onClick={props.onRequestSave}>
          <Checkmark />
        </IconButton>
      )}
      {props.editState === "edit" && (
        <IconButton
          kind="secondary"
          label="Discard changes"
          onClick={props.onRequestDiscard}
        >
          <CloseOutline />
        </IconButton>
      )}
    </div>
  );
};
