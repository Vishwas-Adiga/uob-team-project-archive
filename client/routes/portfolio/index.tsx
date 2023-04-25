import { useEffect, useState } from "react";
import { Loading, Tile } from "@carbon/react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { AuthenticatedRoute } from "../../components/conditional-route";
import { Portfolio as PortfolioState } from "../../state/portfolio-state";
import { get } from "../../utils/fetch";
import { Routes } from "../index";
import { PortfolioInfo } from "./portfolio-info";
import placeholderBanner from "../../assets/placeholders/profile_banner.jpg";
import { NewWidgetToolbar } from "./new-widget-toolbar";
import { Module } from "../../components/widgets/module";
import styles from "./style.module.scss";

export const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const { pid } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPortfolio = async () => {
      const response = await get(`portfolios/${pid}`);
      if (!response.ok) navigate(Routes.NOT_FOUND(), { replace: true });
      const json = await response.json();
      setPortfolio(json);
    };
    fetchPortfolio();
  }, [pid, navigate]);
  return (
    // TODO Make route public
    <AuthenticatedRoute>
      <>
        <Helmet>
          <title>
            {portfolio ? `${portfolio.name}'s portfolio` : "Loading portfolio"}
          </title>
        </Helmet>
        {portfolio && (
          <div className={styles.container}>
            <div className={styles.hero}>
              <p>{portfolio?.name ?? "Max Gater"}</p>
              <img alt="" src={portfolio?.profileBanner ?? placeholderBanner} />
              <span role="none" className={styles.scrim} />
              <span role="none" className={styles.textScrim} />
            </div>
            <main className={styles.main}>
              <PortfolioInfo {...portfolio} />
              <NewWidgetToolbar />
              <div className={styles.leftTrack}>
                <Module widgetId={1} index={1} editState={"edit"} />
                <Tile style={{ height: 200 }} />
                <Tile style={{ height: 400 }} />
                <Tile style={{ height: 200 }} />
              </div>
              <div className={styles.rightTrack}>
                <Tile style={{ height: 400 }} />
                <Tile style={{ height: 100 }} />
                <Tile style={{ height: 200 }} />
                <Tile style={{ height: 350 }} />
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
    </AuthenticatedRoute>
  );
};
