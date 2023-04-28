import { useCallback, useEffect, useState } from "react";
import { Loading, Tile } from "@carbon/react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { del, get, patch, post } from "../../utils/fetch";
import { Portfolio as PortfolioState } from "../../state/types";
import { Routes } from "../index";
import { PortfolioInfo } from "./portfolio-info";
import placeholderBanner from "../../assets/placeholders/profile_banner.jpg";
import { NewWidgetToolbar } from "./new-widget-toolbar";
import { Module } from "../../components/widgets/module";
import styles from "./style.module.scss";
import {
  WidgetPayload,
  WidgetInfo,
  WidgetType,
} from "../../state/widget-state";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/user-state";

export const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const user = useRecoilValue(userState);
  const { pid } = useParams();
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState<Array<WidgetInfo>>([]);
  useEffect(() => {
    const fetcher = async () => {
      const fetchPortfolioHeader = async () => {
        const response = await get(`portfolios/${pid}/header`);
        if (!response.ok) navigate(Routes.NOT_FOUND(), { replace: true });
        return await response.json();
      };
      const fetchPortfolio = async () => {
        const response = await get(`portfolios/${pid}`);
        if (response.status === 403) {
          return null;
        }
        if (!response.ok) navigate(Routes.NOT_FOUND(), { replace: true });
        return await response.json();
      };
      const fetchWidgets = async () => {
        const response = await get(`portfolios/${pid}/widgets`);
        if (response.status === 403) {
          return null;
        }
        if (!response.ok) navigate(Routes.NOT_FOUND(), { replace: true });
        return await response.json();
      };
      const [portfolio, portfolioHeader, widgets] = await Promise.all([
        fetchPortfolio(),
        fetchPortfolioHeader(),
        fetchWidgets(),
      ]);
      setPortfolio(portfolio ?? portfolioHeader);
      if (widgets) {
        setWidgets(
          widgets.map(w => ({
            ...w,
            editState:
              parseInt(pid!, 10) === user?.userId ? "editable" : "view",
            reorderButtonsDisabled: [w.index === 1, w.index === widgets.length],
          }))
        );
      }
    };
    fetcher();
  }, [pid, navigate]);
  const instantiateWidget = (info: WidgetInfo) => {
    switch (info.widgetType) {
      case "Module":
        return (
          <Module
            key={info.widgetId}
            widgetId={info.widgetId}
            widgetType={info.widgetType}
            index={info.index}
            editState={info.editState}
            payload={info.payload}
            requestUpdate={updateWidgetCallback}
            requestDelete={deleteWidgetCallback}
            requestEdit={requestEditCallback}
            requestMove={moveWidgetCallback}
            reorderButtonsDisabled={info.reorderButtonsDisabled}
          />
        );
      default:
        return info.widgetType;
    }
  };
  const requestEditCallback = useCallback(
    (widgetId: number, editing: boolean) => {
      setWidgets(widgets =>
        widgets.map(w => {
          if (w.widgetId !== widgetId) {
            return w;
          }
          return { ...w, editState: editing ? "edit" : "editable" };
        })
      );
    },
    [widgets]
  );
  const updateWidgetCallback = useCallback(
    async (
      widgetId: number,
      payload: WidgetPayload,
      index?: number,
      widgetType?: WidgetType
    ) => {
      requestEditCallback(widgetId, false);
      let response;
      let newWidgetId;
      if (widgetId < 0) {
        if (!index || !widgetType) {
          return;
        }
        response = await post(`widgets`, {
          payload: payload,
          index: index,
          type: widgetType,
        });
        newWidgetId = (await response.json()).widgetId;
      } else {
        response = await patch(`widgets/${widgetId}`, { payload: payload });
        newWidgetId = widgetId;
      }
      // TODO show a proper notification (VXA)
      if (!response.ok) {
        return;
      }
      setWidgets(widgets =>
        widgets.map(w => {
          if (w.widgetId !== widgetId) {
            return w;
          }
          return { ...w, payload, widgetId: newWidgetId };
        })
      );
    },
    [widgets, requestEditCallback]
  );
  const deleteWidgetCallback = useCallback(
    async (widgetId: number) => {
      if (widgetId > 0) {
        const response = await del(`widgets/${widgetId}`);
        // TODO show a proper notification (VXA)
        if (!response.ok) {
          return;
        }
      }
      setWidgets(widgets => widgets.filter(w => w.widgetId !== widgetId));
    },
    [widgets]
  );
  const moveWidgetCallback = useCallback(
    async (widgetId: number, direction: "up" | "down") => {
      const oldIndex = widgets.find(w => w.widgetId === widgetId)?.index ?? 0;
      const newIndexCandidate = oldIndex + (direction === "up" ? -1 : 1);
      const newIndex = Math.min(widgets.length, Math.max(1, newIndexCandidate));
      const response = await patch(`widgets/${widgetId}`, { index: newIndex });
      if (!response.ok) {
        return;
      }
      setWidgets(widgets => {
        const m = (w, i) => ({
          ...w,
          index: i + 1,
          reorderButtonsDisabled: [i + 1 === 1, i + 1 === widgets.length],
        });
        if (newIndex - oldIndex > 0) {
          return widgets
            .slice(0, oldIndex - 1)
            .concat(widgets.slice(oldIndex, newIndex))
            .concat(widgets[oldIndex - 1])
            .concat(widgets.slice(newIndex))
            .map(m);
        } else {
          return widgets
            .slice(0, newIndex - 1)
            .concat(widgets[oldIndex - 1])
            .concat(widgets.slice(newIndex - 1, oldIndex - 1))
            .concat(widgets.slice(oldIndex))
            .map(m);
        }
      });
    },
    [widgets]
  );
  const createWidgetCallback = useCallback(
    (widgetType: WidgetType) => {
      const index = widgets.length + 1;
      const widgetId = -(widgets.length + 1);
      const widget: WidgetInfo = {
        widgetId,
        widgetType,
        index,
        editState: "edit",
        reorderButtonsDisabled: [index === 1, index === widgets.length],
      };
      setWidgets(widgets => [...widgets, widget]);
    },
    [widgets]
  );

  return (
    <>
      <Helmet>
        <title>
          {portfolio ? `${portfolio.name}'s portfolio` : "Loading portfolio"}
        </title>
      </Helmet>
      {portfolio && (
        <div
          className={`${styles.container} ${
            parseInt(pid ?? "", 10) === user?.userId && styles.selfContainer
          }`}
        >
          <div className={styles.hero}>
            <p>{portfolio?.name}</p>
            <img alt="" src={portfolio?.profileBanner ?? placeholderBanner} />
            <span role="none" className={styles.scrim} />
            <span role="none" className={styles.textScrim} />
          </div>
          <main className={styles.main}>
            <PortfolioInfo {...portfolio} />
            {parseInt(pid ?? "0") === user?.userId && (
              <NewWidgetToolbar onRequestCreate={createWidgetCallback} />
            )}
            <div className={styles.leftTrack}>
              {widgets?.filter(({ index }) => index % 2).map(instantiateWidget)}
            </div>
            <div className={styles.rightTrack}>
              {widgets
                ?.filter(({ index }) => index % 2 === 0)
                .map(instantiateWidget)}
            </div>
          </main>
        </div>
      )}
      {!portfolio && (
        <div className={styles.loadingContainer}>
          <Loading description="Loading portfolio" withOverlay={false} />
        </div>
      )}
    </>
  );
};
