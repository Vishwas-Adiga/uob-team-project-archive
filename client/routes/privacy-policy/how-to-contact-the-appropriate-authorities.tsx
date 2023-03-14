import { Config } from "../../config";
import styles from "./style.module.scss";
export const HowToContactTheAppropriateAuthorities = () => (
  <section id="how-to-contact-the-appropriate-authorities">
    <h1>How to contact the appropriate authorities</h1>
    <p className={styles.pSize}>
      Should you wish to report a complaint or if you feel that{" "}
      {Config.APP.NAME} has not addressed your concern in a satisfactory
      manner,you may contact the Information Commissioner’s Office.
    </p>
    <p className={styles.pSize}>Telephone: 0303 123 1113</p>
    <p className={styles.pSize}>Address:</p>
    <address className={styles.pSize}>
      <span>Information Commissioner's Office</span>
      <br />
      <span>Wycliffe House</span>
      <br />
      <span>Water Lane</span>
      <br />
      <span>Wilmslow</span>
      <br />
      <span>Cheshire</span>
      <br />
      <span>SK9 5AF</span>
    </address>
  </section>
);
