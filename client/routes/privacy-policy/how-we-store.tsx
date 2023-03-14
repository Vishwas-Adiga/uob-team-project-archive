import { UnorderedList } from "@carbon/react";
import { Config } from "../../config";
import styles from "./style.module.scss";

export const HowWeStore = () => (
  <section id="how-we-store">
    <h1>How do we store your data?</h1>
    <p className={styles.pSize}>
      {Config.APP.NAME} securely stores your data in servers located in the
      European Union.
    </p>
    <p className={styles.pSize}>
      {Config.APP.NAME} will keep your data for as long as you have an account.
      If you choose to close your account or request removal of your data, we
      will delete your data within 30 days of receipt of your request.
    </p>
    <p className={styles.pSize}>
      Your data will consequently be erased from our servers and databases.
    </p>
  </section>
);
