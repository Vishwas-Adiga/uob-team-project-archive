import { Config } from "../../../config";
import { UnorderedList, ListItem } from "@carbon/react";
import styles from "./style.module.scss";

export const Overview = () => (
  <section id="overview">
    <h1>Overview</h1>
    <p className={styles.txt}>
      This privacy policy will explain how {Config.APP.NAME} uses the personal
      data we collect from you when you use our website. It will cover the
      following topics:
    </p>
    <UnorderedList>
      <ListItem>
        <span className={styles.li}>What data do we collect?</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>How do we collect your data?</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>How will we use your data?</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>How do we store your data?</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>Marketing</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>What are your data protection rights?</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>What are cookies?</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>How do we use cookies?</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>What types of cookies do we use?</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>How to manage your cookies</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>Privacy policies of other websites</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>Changes to our privacy policy</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>How to contact us</span>
      </ListItem>
      <ListItem>
        <span className={styles.li}>
          How to contact the appropriate authorities
        </span>
      </ListItem>
    </UnorderedList>
  </section>
);
