import { SummaryItem, SummaryItemProps } from "./summary-item";
import {
  Cookie,
  EarthEuropeAfrica,
  Email,
  IbmCloudAppId,
  Information,
  Time,
} from "@carbon/icons-react";
import styles from "./style.module.scss";
import { Config } from "../../config";

const ITEMS: SummaryItemProps[] = [
  {
    title: "Server location",
    text: "EU West",
    description:
      "Your data is stored in servers located in the European Union and is regulated by the GDPR",
    icon: <EarthEuropeAfrica />,
    section: "how-we-store",
  },
  {
    title: "Data retention",
    text: "30 days",
    description:
      "Your data will be securely erased from our systems within 30 days of receipt of a deletion request",
    icon: <Time />,
    section: "how-we-store",
  },
  {
    title: "PII collected",
    text: "Uni credentials",
    description: `${Config.APP.NAME} collects personal identification information like your uni email address and student ID`,
    icon: <Information />,
    section: "data-we-collect",
  },
  {
    title: "Cookie policy",
    text: "Essential only",
    description: `Cookies are only used to keep you signed in. ${Config.APP.NAME} does not use third-party or tracking cookies`,
    icon: <Cookie />,
    section: "how-we-use-cookies",
  },
  {
    title: "Your rights",
    text: "GDPR User Rights",
    description:
      "You are entitled to several user data protection rights as part of the GDPR",
    icon: <IbmCloudAppId />,
    section: "data-protection-rights",
  },
  {
    title: "Redressal",
    text: "Contact our DPO",
    description:
      "If you have a grievance or query, write to our Data Protection Officer at axm1798@student.bham.ac.uk",
    icon: <Email />,
    section: "how-to-contact-us",
  },
];

export const AtAGlance = () => (
  <>
    <h1 id="at-a-glance">At a glance</h1>
    <section className={styles.atAGlance}>
      {ITEMS.map((item, i) => (
        <SummaryItem {...item} key={i} />
      ))}
    </section>
  </>
);
