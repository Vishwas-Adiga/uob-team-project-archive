import { Config } from "../../config";
import styles from "./style.module.scss";

export const TypesOfCookiesWeUse = () => (
  <section id="types-of-cookies-we-use">
    <h1>Types of Cookies We Use</h1>
    <p className={styles.pSize}>
      {Config.APP.NAME} uses these cookies so that we recognise you on our
      website and remember your previously selected preferences.
    </p>
  </section>
);
