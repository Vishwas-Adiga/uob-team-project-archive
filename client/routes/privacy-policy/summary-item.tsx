import { ReactNode, useCallback } from "react";
import { Button, Tile } from "@carbon/react";
import styles from "./style.module.scss";
import { ArrowRight } from "@carbon/icons-react";

export interface SummaryItemProps {
  title: string;
  icon: ReactNode;
  text: string;
  description: string;
  section: string;
}

export const SummaryItem = (props: SummaryItemProps) => {
  const navigateToSection = useCallback(
    () => (window.location.hash = props.section),
    [props.section]
  );
  return (
    <Tile className={styles.summaryItem}>
      {props.icon}
      <h4 className={styles.summaryItemTitle}>{props.title}</h4>
      <p className={styles.summaryItemText}>{props.text}</p>
      <p className={styles.summaryItemDesc}>{props.description}</p>
      <span className={styles.summaryItemDivider} />
      <Button
        className={styles.summaryItemButton}
        kind="tertiary"
        size="md"
        renderIcon={ArrowRight}
        onClick={navigateToSection}
      >
        Read more
      </Button>
    </Tile>
  );
};
