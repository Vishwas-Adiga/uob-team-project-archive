import { Button } from "@carbon/react";
import {
  Bullhorn,
  Catalog,
  LocationHeartFilled,
  LogoDiscord,
  LogoGithub,
  LogoInstagram,
  LogoLinkedin,
  LogoSnapchat,
  LogoTwitter,
} from "@carbon/icons-react";
import styles from "./style.module.scss";
import { useCallback, useState } from "react";
import { NewWidgetSelectorModal } from "./new-widget-selector-modal";
import { WidgetType } from "../../state/widget-state";

const getSocialIcon = () =>
  [
    LogoInstagram,
    LogoDiscord,
    LogoGithub,
    LogoLinkedin,
    LogoSnapchat,
    LogoTwitter,
  ][Math.round(Math.random() * 5)];

export interface NewWidgetToolbarProps {
  onRequestCreate: (widgetType: WidgetType) => void;
}

export const NewWidgetToolbar = (props: NewWidgetToolbarProps) => {
  const [widgetSelectorModalOpen, setWidgetSelectorModalOpen] = useState(false);
  const widgetCreateCallback = useCallback(
    widgetType => {
      setWidgetSelectorModalOpen(false);
      props.onRequestCreate(widgetType);
    },
    [props.onRequestCreate]
  );
  return (
    <div className={styles.newWidgetToolbar}>
      <NewWidgetSelectorModal
        open={widgetSelectorModalOpen}
        onRequestClose={setWidgetSelectorModalOpen.bind(null, false)}
        onRequestCreate={widgetCreateCallback}
      />
      <div className={styles.quickActions}>
        <Button size="lg" kind="secondary" renderIcon={Bullhorn}>
          Make an announcement
        </Button>
        <Button size="lg" kind="secondary" renderIcon={getSocialIcon()}>
          Link my socials
        </Button>
        <Button
          size="lg"
          kind="secondary"
          renderIcon={Catalog}
          onClick={props.onRequestCreate.bind(null, "Module")}
        >
          List my modules
        </Button>
        <Button size="lg" kind="secondary" renderIcon={LocationHeartFilled}>
          Pin a location
        </Button>
      </div>
      <Button
        size="lg"
        kind="primary"
        onClick={setWidgetSelectorModalOpen.bind(null, true)}
      >
        ...or add something else
      </Button>
    </div>
  );
};
