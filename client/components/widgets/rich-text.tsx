import { FormLabel, TextInput, Tile } from "@carbon/react";
import { WidgetProps } from "./index";
import styles from "./style.module.scss";
import { WidgetHeader } from "../widget-header";
import { ChangeEvent, useCallback, useState } from "react";
import { RichTextPayload } from "../../state/widget-state";
import MDEditor from "@uiw/react-md-editor";

export const RichText = (props: WidgetProps<RichTextPayload>) => {
  const upstreamPayload = props.payload ?? {
    title: "Some text",
    content: "And some more",
  };

  const [richText, setRichText] = useState(upstreamPayload);

  const onMove = useCallback(
    (direction: "up" | "down") => {
      props.requestMove(props.widgetId, direction);
    },
    [props]
  );

  const onSave = useCallback(() => {
    props.requestUpdate(
      props.widgetId,
      richText,
      props.index,
      props.widgetType
    );
  }, [richText]);

  const onDiscard = useCallback(() => {
    if (props.widgetId < 0) {
      props.requestDelete(props.widgetId);
    } else {
      setRichText(upstreamPayload);
      props.requestEdit(props.widgetId, false);
    }
  }, [upstreamPayload]);
  const onTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRichText({ ...richText, title: event.target.value });
    },
    [richText]
  );
  const onContentChange = useCallback(
    (value: string) => {
      setRichText({ ...richText, content: value });
    },
    [richText]
  );

  return (
    <div ref={props.refs}>
      {props.editState !== "view" && (
        <WidgetHeader
          widgetType="RichText"
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
      <Tile className={`${styles.widget} ${styles.richTextWidget}`}>
        {["view", "editable"].includes(props.editState) && (
          <h4>{richText.title}</h4>
        )}
        {props.editState === "edit" && (
          <TextInput
            type="text"
            labelText="Title"
            placeholder="Some text"
            value={richText.title}
            onChange={onTitleChange}
          />
        )}
        {["view", "editable"].includes(props.editState) && (
          <MDEditor.Markdown source={richText.content} />
        )}
        {props.editState === "edit" && <FormLabel>Content</FormLabel>}
        {props.editState === "edit" && (
          <MDEditor
            value={richText.content}
            preview="edit"
            onChange={onContentChange}
          />
        )}
      </Tile>
    </div>
  );
};
