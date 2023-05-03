import { ReactElement, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bullhorn,
  Catalog,
  CharacterSentenceCase,
  DocumentImport,
  Link,
  LocationHeart,
  LogoInstagram,
} from "@carbon/icons-react";
import { Modal, RadioTile, TileGroup } from "@carbon/react";
import { Config } from "../../config";
import { WidgetType } from "../../state/widget-state";
import styles from "./style.module.scss";

export interface NewWidgetSelectorModalProps {
  open: boolean;
  onRequestClose: () => void;
  onRequestCreate: (widgetType: WidgetType) => void;
}
interface WidgetInfo {
  type: WidgetType;
  title: string;
  icon: ReactElement;
  description: string;
}

const WIDGET_INFOS: Array<WidgetInfo> = [
  {
    type: "Announcement",
    title: "Make an announcement",
    icon: <Bullhorn size={24} />,
    description:
      "Hosting an event? Got an internship? Make a short-lived announcement to let everyone know what you're up to",
  },
  {
    type: "Social",
    title: "Link socials",
    icon: <LogoInstagram size={24} />,
    description: `Link to your social media accounts so everyone knows where to find you (besides on ${Config.APP.NAME}, that is)`,
  },
  {
    type: "Module",
    title: "List modules",
    icon: <Catalog size={24} />,
    description: "List the modules you're taking this semester",
  },
  {
    type: "Location",
    title: "Pin a location",
    icon: <LocationHeart size={24} />,
    description:
      "Showcase your hometown, where you went to school, or any other place that's important to you",
  },
  {
    type: "RichText",
    title: "Add some text",
    icon: <CharacterSentenceCase size={24} />,
    description:
      "Tell everyone a bit about yourself or write a review about the last Starbucks you visited. Use this space to express yourself freely!",
  },
  {
    type: "File",
    title: "Upload a file",
    icon: <DocumentImport size={24} />,
    description:
      "Perfect for sharing your notes or slides from your lectures. Or perhaps even a panoramic shot of the Avon room",
  },
  {
    type: "Link",
    title: "Link to a URL",
    icon: <Link size={24} />,
    description:
      "Found an interesting research paper online that you'd like to share? Or a viral Tweet of yours? Add a link to any URL",
  },
];

const WIP: Array<WidgetType> = ["Link", "File"];

export const NewWidgetSelectorModal = (props: NewWidgetSelectorModalProps) => {
  const [selectedType, setSelectedType] = useState<WidgetType>("Announcement");
  const submitType = useCallback(
    () => props.onRequestCreate(selectedType),
    [selectedType, props.onRequestCreate]
  );
  return createPortal(
    <Modal
      open={props.open}
      onRequestClose={props.onRequestClose}
      onRequestSubmit={submitType}
      size="md"
      modalHeading="Add to portfolio"
      primaryButtonText="Add"
      secondaryButtonText="Cancel"
    >
      <TileGroup
        defaultSelected={WIDGET_INFOS[0].type}
        legend=""
        name="widget type group"
        className={styles.widgetInfoGrid}
        onChange={setSelectedType}
      >
        {WIDGET_INFOS.filter(w => !WIP.includes(w.type)).map(widgetType => (
          <RadioTile
            id={widgetType.type}
            key={widgetType.type}
            value={widgetType.type}
            className={styles.widgetInfoTile}
          >
            {widgetType.icon}
            <h4>{widgetType.title}</h4>
            <p>{widgetType.description}</p>
          </RadioTile>
        ))}
      </TileGroup>
    </Modal>,
    document.body
  );
};
