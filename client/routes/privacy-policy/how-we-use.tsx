import { ListItem, UnorderedList } from "@carbon/react";
import { Config } from "../../config";
import styles from "./style.module.scss";

export const HowWeUse = () => (
  <section id="how-we-use">
    <h1>How will we use your data?</h1>
    <p className={styles.pSize}>
      {Config.APP.NAME} collects your data so that we can:
    </p>
    <UnorderedList>
      <ListItem>
        {" "}
        <span className={styles.bulletPointSize}>
          Recommend your account to other users
        </span>
      </ListItem>
    </UnorderedList>
  </section>
);
