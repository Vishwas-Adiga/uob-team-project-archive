import React, { PropsWithChildren } from "react";
import { Tile } from "@carbon/react";
import styles from "./style.module.scss";
interface RichTextProps extends PropsWithChildren {
  title: string;
  content: string;
}
export const RichText = (props: RichTextProps) => {
  return (
    <div className={styles.container}>
      <Tile id="tile1">
        <h1>{props.title}</h1>
        <p>{props.content}</p>
      </Tile>
    </div>
  );
};
