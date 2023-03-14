import { UnorderedList, ListItem } from "@carbon/react";
import { Config } from "../../config";
import styles from "./style.module.scss";

export const HowWeCollect = () => (
  <section id="how-we-collect">
    <h1>How do we collect your data?</h1>
    <p className={styles.pSize}>
      You directly provide {Config.APP.NAME} with most of the data we collect.
      We collect data and process data when you:
    </p>
    <UnorderedList>
      <ListItem>
        <span className={styles.bulletPointSize}>Register for the service</span>
      </ListItem>
      <ListItem>
        <span className={styles.bulletPointSize}>Login to the service</span>
      </ListItem>
      <ListItem>
        <span className={styles.bulletPointSize}>
          Use the website via your browser's cookies
        </span>
      </ListItem>
      <ListItem>
        <span className={styles.bulletPointSize}>
          Edit or view your profile
        </span>
      </ListItem>
      <ListItem>
        <span className={styles.bulletPointSize}>
          Add or remove connections
        </span>
      </ListItem>
    </UnorderedList>
  </section>
);
