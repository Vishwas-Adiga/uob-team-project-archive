import { Config } from "../../config";
import styles from "./style.module.scss";

export const PolicyChanges = () => (
  <section id="policy-changes">
    <h1>Changes to our privacy policy</h1>
    <p className={styles.pSize}>
      {Config.APP.NAME} keeps its privacy policy under regular review and places
      any updates on this web page. This privacy policy was last updated on 13
      February 2023.
    </p>
  </section>
);
