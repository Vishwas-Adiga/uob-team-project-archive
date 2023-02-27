import { Button } from "@carbon/react";
import { Outlet } from "react-router-dom";
import { AnonymousRoute } from "../../components/conditional-route";
import authBackground from "./../../assets/auth_bg.jpg";
import styles from "./style.module.scss";
export const Auth = () => {
  return (
    <AnonymousRoute>
      <div className={styles.container}>
        <main id="main-content" className={styles.main}>
          <h1>Express your authentic self at uni</h1>
          <span className={styles.divider} />
          <div>
            <Outlet />
          </div>
          <Button kind="ghost" size="sm">
            Privacy policy
          </Button>
        </main>
        <span
          role="img"
          className={styles.background}
          style={{ backgroundImage: `url(${authBackground})` }}
        />
      </div>
    </AnonymousRoute>
  );
};
