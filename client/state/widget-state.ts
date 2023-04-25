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
