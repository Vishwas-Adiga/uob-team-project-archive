import styles from "./style.module.scss";

export const Cookies = () => (
  <section id="cookies">
    <h1>Cookies</h1>
    <p className={styles.pSize}>
      Cookies are text files placed on your computer to collect standard
      Internet log information and visitor behavior information. When you visit
      our websites, we may collect information from you automatically through
      cookies or similar technology
    </p>
    <p className={styles.pSize}>
      For further information, visit allaboutcookies.org.
    </p>
  </section>
);
