import { Config } from "../../config";
import styles from "./style.module.scss";
import { UnorderedList, ListItem } from "@carbon/react";
export const HowDoWeUseCookies = () => (
  <section id="how-we-use-cookies">
    <h1>How do we use cookies?</h1>

    <p className={styles.pSize}>
      {Config.APP.NAME} uses cookies to improve your experience on our website,
      mainly to keep you signed in.
    </p>
  </section>
);
