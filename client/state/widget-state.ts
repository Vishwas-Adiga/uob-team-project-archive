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

export interface Module {
  moduleId: number;
  name: string;
  description: string;
}

export type ModulesPayload = Array<number>;

export type WidgetPayload = ModulesPayload;

export interface WidgetInfo<T extends WidgetPayload = WidgetPayload> {
  widgetId: number;
  widgetType: WidgetType;
  editState: WidgetEditState;
  index: number;
  payload?: T;
}