import { useCallback, useEffect, useRef, useState } from "react";
import { Tab, Tabs, TabList } from "@carbon/react";
import { SecureProfile } from "@carbon/pictograms-react";
import { Helmet } from "react-helmet";
import styles from "./style.module.scss";
import { AtAGlance } from "./at-a-glance";
import { Overview } from "./overview/overview";
import { DataWeCollect } from "./data-we-collect";
import { HowWeCollect } from "./how-we-collect";
import { HowWeUse } from "./how-we-use";
import { HowWeStore } from "./how-we-store";
import { Marketing } from "./marketing";
import { DataProtectionRights } from "./data-protection-rights";
import { Cookies } from "./cookies";
import { HowDoWeUseCookies } from "./how-do-we-use-cookies";
import { TypesOfCookiesWeUse } from "./types-of-cookies-we-use";
import { ManagingYourCookies } from "./managing-your-cookies";
import { OtherWebsitePolicies } from "./other-website-policies";
import { PolicyChanges } from "./policy-changes";
import { HowToContactUs } from "./how-to-contact-us";
import { HowToContactTheAppropriateAuthorities } from "./how-to-contact-the-appropriate-authorities";

// 1-1 mapping with section IDs
const SECTIONS = [
  "at-a-glance",
  "overview",
  "data-we-collect",
  "how-we-collect",
  "how-we-use",
  "how-we-store",
  "marketing",
  "data-protection-rights",
  "cookies",
  "how-we-use-cookies",
  "types-of-cookies-we-use",
  "managing-your-cookies",
  "other-website-policies",
  "policy-changes",
  "how-to-contact-us",
  "how-to-contact-the-appropriate-authorities",
];

export const PrivacyPolicy = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollToSection = useCallback(({ selectedIndex }) => {
    window.location.hash = SECTIONS[selectedIndex];
    setSelectedIndex(selectedIndex);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const offset = containerRef.current?.scrollTop ?? 0;
      // TODO: Replace getElementById calls with refs
      setSelectedIndex(
        SECTIONS.map(s => document.getElementById(s)?.offsetTop ?? 0).reduce(
          (i, s, j) => (offset + 50 > s ? j : i),
          0
        )
      );
    };
    containerRef.current?.addEventListener("scroll", onScroll, {
      passive: true,
    });
    return () => containerRef.current?.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <Helmet>
        <title>Privacy policy</title>
      </Helmet>
      <div className={styles.hero}>
        <h1>Privacy policy</h1>
        <SecureProfile className={styles.heroImage} />
        <span className={styles.divider}></span>
      </div>
      <Tabs onChange={scrollToSection} selectedIndex={selectedIndex}>
        <TabList
          aria-label="Sections in privacy policy notice"
          contained
          className={styles.tabs}
        >
          <Tab>At a glance</Tab>
          <Tab>Overview</Tab>
          <Tab>Data we collect</Tab>
          <Tab>How we collect your data</Tab>
          <Tab>How we use your data</Tab>
          <Tab>How we store your data</Tab>
          <Tab>Marketing</Tab>
          <Tab>Your data protection rights</Tab>
          <Tab>Cookies</Tab>
          <Tab>How we use cookies</Tab>
          <Tab>Types of cookies we use</Tab>
          <Tab>Managing your cookies</Tab>
          <Tab>Other website policies</Tab>
          <Tab>Policy changes</Tab>
          <Tab>Contact us</Tab>
          <Tab>Contact the appropriate authorities</Tab>
        </TabList>
      </Tabs>
      <main id="main-content" className={styles.main}>
        <AtAGlance />
        <Overview />
        <DataWeCollect />
        <HowWeCollect />
        <HowWeUse />
        <HowWeStore />
        <Marketing />
        <DataProtectionRights />
        <Cookies />
        <HowDoWeUseCookies />
        <TypesOfCookiesWeUse />
        <ManagingYourCookies />
        <OtherWebsitePolicies />
        <PolicyChanges />
        <HowToContactUs />
        <HowToContactTheAppropriateAuthorities />
      </main>
    </div>
  );
};
