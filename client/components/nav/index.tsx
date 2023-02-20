import {
  Button,
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  Search,
  SkipToContent,
} from "@carbon/react";
import { Config } from "../../config";
import styles from "./style.module.scss";
import { UserAvatar } from "@carbon/icons-react";
interface NavProps {
  anonymous: boolean;
}

export const Nav = (props: NavProps) => (
  <Header aria-label={"App header"} className={styles.header}>
    <SkipToContent />
    <HeaderName href="#" prefix="">
      {Config.APP.NAME}
    </HeaderName>
    {!props.anonymous && (
      <HeaderNavigation aria-label="App navigation" className={styles.nav}>
        <Search
          size="sm"
          className={styles.search}
          placeholder="Find students to connect with"
          labelText="Find students to connect with"
        ></Search>
        <HeaderMenuItem isCurrentPage href="#" className={styles.navItem}>
          Connections
        </HeaderMenuItem>
        <HeaderMenuItem href="#" className={styles.navItem}>
          For you
        </HeaderMenuItem>
        <HeaderMenuItem href="#" className={styles.navItem}>
          StudentVerse
        </HeaderMenuItem>
        <Button></Button>
      </HeaderNavigation>
    )}
    <HeaderGlobalBar>
      <HeaderGlobalAction aria-label="Search">
        <UserAvatar size={20} />
      </HeaderGlobalAction>
    </HeaderGlobalBar>
  </Header>
);
