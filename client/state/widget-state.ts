export const WIDGET_TYPES = [
  "Announcement",
  "File",
  "Link",
  "Location",
  "Module",
  "RichText",
  "Social",
] as const;

export type WidgetType = (typeof WIDGET_TYPES)[number];
export type WidgetEditState = "view" | "editable" | "edit";

export type AnnouncementPayload = {
  title: string;
  content: string;
  expiry: Date;
};

export type ModulesPayload = Array<number>;

export type RichTextPayload = {
  title: string;
  content: string;
};

export type SocialPlatform =
  | "bereal"
  | "discord"
  | "instagram"
  | "github"
  | "linkedin"
  | "reddit"
  | "snapchat"
  | "twitter";
export type SocialPayload = {
  platform: SocialPlatform;
  username: string;
};

export type WidgetPayload =
  | AnnouncementPayload
  | ModulesPayload
  | SocialPayload
  | RichTextPayload;

export interface WidgetInfo<T extends WidgetPayload = WidgetPayload> {
  widgetId: number;
  widgetType: WidgetType;
  editState: WidgetEditState;
  index: number;
  payload?: T;
  reorderButtonsDisabled: [boolean, boolean];
}
