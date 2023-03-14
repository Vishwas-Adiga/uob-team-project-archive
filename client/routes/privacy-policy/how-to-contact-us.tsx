import { Config } from "../../config";
import styles from "./style.module.scss";
export const HowToContactUs = () => (
  <section id="how-to-contact-us">
    <h1>How to contact us</h1>
    <p className={styles.pSize}>
      If you have any questions about {Config.APP.NAME}’s privacy policy, the
      data we hold on you, or you would like to exercise one of your data
      protection rights, please do not hesitate to contact us.
    </p>
    <p className={styles.pSize}>Email us at: axm1798@student.bham.ac.uk</p>
  </section>
);
