import { UnorderedList, ListItem } from "@carbon/react";
import { Config } from "../../config";
import styles from "./style.module.scss";
export const DataProtectionRights = () => (
  <section id="data-protection-rights">
    <h1>What are your data protection rights?</h1>
    <p className={styles.pSize}>
      {Config.APP.NAME} would like to make sure you are fully aware of all of
      your data protection rights. Every user is entitled to the following:
    </p>
    <UnorderedList>
      <ListItem>
        {" "}
        <span style={{ fontWeight: "bold" }} className={styles.bulletPointSize}>
          The right to access{" "}
        </span>{" "}
        – You have the right to request {Config.APP.NAME} for copies of your
        personal data. We may charge you a small fee for this service.
      </ListItem>
      <ListItem>
        <span style={{ fontWeight: "bold" }} className={styles.bulletPointSize}>
          The right to rectification
        </span>{" "}
        – You have the right to request that {Config.APP.NAME} correct any
        information you believe is inaccurate. You also have the right to
        request Our Company to complete the information you believe is
        incomplete.
      </ListItem>
      <ListItem>
        <span style={{ fontWeight: "bold" }} className={styles.bulletPointSize}>
          The right to erasure{" "}
        </span>{" "}
        – You have the right to request that {Config.APP.NAME} erase your
        personal data, under certain conditions.
      </ListItem>
      <ListItem>
        <span style={{ fontWeight: "bold" }} className={styles.bulletPointSize}>
          The right to restrict processing{" "}
        </span>{" "}
        – You have the right to request that {Config.APP.NAME} restrict the
        processing of your personal data, under certain conditions.
      </ListItem>
      <ListItem>
        <span style={{ fontWeight: "bold" }} className={styles.bulletPointSize}>
          The right to object to processing{" "}
        </span>{" "}
        – You have the right to object to {Config.APP.NAME}'s processing of your
        personal data, under certain conditions.
      </ListItem>
      <ListItem>
        <span style={{ fontWeight: "bold" }} className={styles.bulletPointSize}>
          The right to data portability{" "}
        </span>{" "}
        – You have the right to request that {Config.APP.NAME} transfer the data
        that we have collected to another organisation, or directly to you,
        under certain conditions.
      </ListItem>
      <p>
        <span className={styles.bulletPointSize}>
          If you make a request, we have one month to respond to you. If you
          would like to exercise any of these rights, please contact us at our
          email: axm1798@student.bham.ac.uk
        </span>
      </p>
    </UnorderedList>
  </section>
);
