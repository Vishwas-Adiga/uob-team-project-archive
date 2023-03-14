import { Config } from "../../config";
import styles from "./style.module.scss";

export const OtherWebsitePolicies = () => (
  <section id="other-website-policies">
    <h1>Privacy policy of other websites</h1>
    <p className={styles.pSize}>
      The {Config.APP.NAME} website contains links to other websites. Our
      privacy policy applies only to our website, so if you click on a link to
      another website, you should read their privacy policy.
    </p>
  </section>
);
