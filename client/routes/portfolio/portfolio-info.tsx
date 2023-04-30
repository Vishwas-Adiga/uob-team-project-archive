import { Button, Tile } from "@carbon/react";
import { Portfolio } from "../../state/types";
import styles from "./style.module.scss";
export const PortfolioInfo = (props: Portfolio) => (
  <Tile className={styles.portfolioInfo}>
    <img className={styles.profilePhoto} src={props.profilePicture} alt="" />
    <Button className={styles.connectButton}>
      Connect with {splitName(props.name)}
    </Button>
    <h1>{props.name}</h1>
    <p className={styles.portfolioDescription}>
      Studying politics
      <br />
      Jarratt Hall
    </p>
    <p className={styles.portfolioAction}>:</p>
  </Tile>
);

const splitName = (fullName: string) => fullName.split(" ")[0];
