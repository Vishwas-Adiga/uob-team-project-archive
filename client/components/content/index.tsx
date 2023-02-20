import { PropsWithChildren } from "react";
import styles from "./style.module.scss";
interface ContentProps extends PropsWithChildren {}
export const Content = (props: ContentProps) => (
  <div className={styles.content}>
    <span className={styles.separator} />
    {props.children}
  </div>
);
