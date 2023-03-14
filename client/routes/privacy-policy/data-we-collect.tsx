import { Config } from "../../config";
import { UnorderedList, ListItem } from "@carbon/react";
import styles from "./style.module.scss";

export const DataWeCollect = () => (
  <section id="data-we-collect">
    <h1>What data do we collect?</h1>
    <p className={styles.pSize}>
      In order to operate, {Config.APP.NAME} collects the following data:
    </p>
    <UnorderedList>
      <ListItem>
        <span className={styles.bulletPointSize}>
          Personal identification information (Name, email, university ID,
          address)
        </span>
      </ListItem>
      <ListItem>
        <span className={styles.bulletPointSize}>
          Information you provide directly to the service (for example photos,
          links to other accounts)
        </span>
      </ListItem>
    </UnorderedList>
  </section>
);
