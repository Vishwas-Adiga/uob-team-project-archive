import styles from "./style.module.scss";
import { Config } from "../../config";
export const Marketing = () => (
  <section id="marketing">
    <h1>Marketing</h1>
    <p className={styles.pSize}>
      {Config.APP.NAME} will not send you any promotional information about our
      products and services.
    </p>
  </section>
);
