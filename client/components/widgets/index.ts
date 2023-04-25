import { WidgetEditState } from "../../state/widget-state";

export interface WidgetProps {
  widgetId: number;
  index: number;
  editState: WidgetEditState;
}
