import { HeaderMenuItem } from "@carbon/react";
import { useLocation, useNavigate } from "react-router-dom";
import { Routes } from "../../routes";
import { Config } from "../../config";
import styles from "./style.module.scss";

export const NavItems = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <HeaderMenuItem
        isCurrentPage={location.pathname === Routes.CONNECTIONS()}
        onClick={navigate.bind(null, Routes.CONNECTIONS())}
        className={styles.navItem}
      >
        Connections
      </HeaderMenuItem>
      <HeaderMenuItem
        isCurrentPage={location.pathname === Routes.RECOMMENDATIONS()}
        onClick={navigate.bind(null, Routes.RECOMMENDATIONS())}
        className={styles.navItem}
      >
        For you
      </HeaderMenuItem>
      <HeaderMenuItem
        isCurrentPage={location.pathname === Routes.GRAPH()}
        onClick={navigate.bind(null, Routes.GRAPH())}
        className={styles.navItem}
      >
        {Config.GRAPH.NAME}
      </HeaderMenuItem>
    </>
  );
};
