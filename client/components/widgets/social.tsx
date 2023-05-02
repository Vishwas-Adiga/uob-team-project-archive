import { Select, SelectItem, TextInput, Tile } from "@carbon/react";
import { WidgetProps } from "./index";
import styles from "./style.module.scss";
import { WidgetHeader } from "../widget-header";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { SocialPayload, SocialPlatform } from "../../state/widget-state";
import discordIcon from "../../assets/social_icons/discord.svg";
import instagramIcon from "../../assets/social_icons/instagram.svg";
import githubIcon from "../../assets/social_icons/github.svg";
import linkedinIcon from "../../assets/social_icons/linkedin.svg";
import redditIcon from "../../assets/social_icons/reddit.svg";
import snapchatIcon from "../../assets/social_icons/snapchat.svg";
import twitterIcon from "../../assets/social_icons/twitter.svg";
import { Bullhorn } from "@carbon/icons-react";

const SOCIAL_PLATFORMS: {
  [key in SocialPlatform]: {
    name: string;
    caption: string;
    generateUrl: (username: string) => string;
    icon: string;
  };
} = {
  bereal: {
    name: "BeReal",
    caption: "Add me on BeReal",
    generateUrl: username => `bere.al/@${username}`,
    icon: "",
  },
  discord: {
    name: "Discord",
    caption: "Add me as a Discord friend",
    generateUrl: username => `discord.com`,
    icon: discordIcon,
  },
  instagram: {
    name: "Instagram",
    caption: "Follow me on Instagram",
    generateUrl: username => `https://www.instagram.com/${username}/`,
    icon: instagramIcon,
  },
  github: {
    name: "GitHub",
    caption: "Follow me on GitHub",
    generateUrl: username => `https://github.com/${username}`,
    icon: githubIcon,
  },
  linkedin: {
    name: "LinkedIn",
    caption: "Let's connect on LinkedIn",
    generateUrl: username => `https://www.linkedin.com/in/${username}`,
    icon: linkedinIcon,
  },
  reddit: {
    name: "Reddit",
    caption: "Follow me on Reddit",
    generateUrl: username => `https://www.reddit.com/user/${username}`,
    icon: redditIcon,
  },
  snapchat: {
    name: "Snapchat",
    caption: "Add me on Snapchat",
    generateUrl: username => `https://www.snapchat.com/add/${username}`,
    icon: snapchatIcon,
  },
  twitter: {
    name: "Twitter",
    caption: "Follow me on Twitter",
    generateUrl: username => `https://twitter.com/${username}`,
    icon: twitterIcon,
  },
};
export const Social = (props: WidgetProps<SocialPayload>) => {
  const upstreamPayload = props.payload ?? {
    platform: "instagram",
    username: "",
  };

  const [social, setSocial] = useState(upstreamPayload);
  const platformCaption = SOCIAL_PLATFORMS[social.platform].caption;
  const platformUrl = SOCIAL_PLATFORMS[social.platform].generateUrl(
    social.username
  );
  const displayUrl = platformUrl
    .replaceAll("https://", "")
    .replaceAll("www.", "");
  const platformIcon = SOCIAL_PLATFORMS[social.platform].icon;
  const selectRef = useRef<HTMLSelectElement>(null);

  const onMove = useCallback(
    (direction: "up" | "down") => {
      props.requestMove(props.widgetId, direction);
    },
    [props]
  );

  const onSave = useCallback(() => {
    const platform =
      (selectRef.current?.value as SocialPlatform) ||
      SOCIAL_PLATFORMS.instagram;
    props.requestUpdate(
      props.widgetId,
      {
        ...social,
        platform,
      },
      props.index,
      props.widgetType
    );
  }, [social]);

  const onDiscard = useCallback(() => {
    if (props.widgetId < 0) {
      props.requestDelete(props.widgetId);
    } else {
      setSocial(upstreamPayload);
      props.requestEdit(props.widgetId, false);
    }
  }, [upstreamPayload]);

  const onUsernameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSocial(social => ({
        ...social,
        username: event.target.value.trim().replaceAll("@", ""),
      }));
    },
    [social]
  );

  const onPlatformChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      console.log(event);
      setSocial(social => ({
        ...social,
        platform: event.target.value as SocialPlatform,
      }));
    },
    [social]
  );

  return (
    <div>
      {props.editState !== "view" && (
        <WidgetHeader
          widgetType="Social"
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
      <Tile className={`${styles.widget} ${styles.socialWidget}`}>
        {["view", "editable"].includes(props.editState) && (
          <div className={styles.socialWidgetTitle}>
            <span
              role="img"
              aria-label={`${SOCIAL_PLATFORMS[social.platform].name}`}
              style={{
                mask: `url(${platformIcon})`,
                WebkitMask: `url(${platformIcon})`,
              }}
            ></span>
            <p>{platformCaption}</p>
          </div>
        )}
        {props.editState === "edit" && (
          <Select
            id={`social-${props.widgetId}`}
            size="sm"
            labelText="Platform"
            value={social.platform}
            ref={selectRef}
            onChange={onPlatformChange}
          >
            {Object.keys(SOCIAL_PLATFORMS).map(x => (
              <SelectItem key={x} value={x} text={SOCIAL_PLATFORMS[x].name} />
            ))}
          </Select>
        )}
        {["view", "editable"].includes(props.editState) && (
          <h4>
            <a href={platformUrl} target="_blank" rel="noreferrer">
              {displayUrl}
            </a>
          </h4>
        )}
        {props.editState === "edit" && (
          <TextInput
            id={`social-username-${props.widgetId}`}
            type="text"
            labelText="Username"
            value={social.username}
            onChange={onUsernameChange}
          />
        )}
      </Tile>
    </div>
  );
};
