import {WidgetPayload, WidgetInfo, WidgetType } from "../../state/widget-state";

export interface WidgetProps<T extends WidgetPayload> extends WidgetInfo<T> {
  requestUpdate: (widgetId: number, payload: T, index?: number, widgetType?: WidgetType) => void;
  requestDelete: (widgetId: number) => void;
  requestMove: (widgetId: number, index: number) => void;
  requestEdit: (widgetId: number ,editing: boolean) => void;
}
