import {
  WidgetPayload,
  WidgetInfo,
  WidgetType,
} from "../../state/widget-state";
import { Ref } from "react";

type HasRef = {
  refs: Ref<HTMLDivElement>;
};

export interface WidgetProps<T extends WidgetPayload>
  extends WidgetInfo<T>,
    HasRef {
  requestUpdate: (
    widgetId: number,
    payload: T,
    index?: number,
    widgetType?: WidgetType
  ) => void;
  requestDelete: (widgetId: number) => void;
  requestEdit: (widgetId: number, editing: boolean) => void;
  requestMove: (widgetId: number, direction: "up" | "down") => void;
}
