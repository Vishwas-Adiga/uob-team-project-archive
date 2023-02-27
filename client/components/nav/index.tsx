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
import { QrCode, UserAvatar } from "@carbon/icons-react";
import { Config } from "../../config";
import styles from "./style.module.scss";
import { useRecoilState } from "recoil";
import { userState } from "../../state/userState";

export const Nav = () => {
  const [user, setUser] = useRecoilState(userState);
  const signOut = () => {
    localStorage.clear();
    setUser(null);
  };
  return (
    <Header aria-label={"App header"} className={styles.header}>
      <SkipToContent />
      <HeaderName href="#" prefix="">
        {Config.APP.NAME}
      </HeaderName>
      {user && (
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
        </HeaderNavigation>
      )}
      {user && (
        <HeaderGlobalBar>
          <Button renderIcon={QrCode}>Scan ID</Button>
          <HeaderGlobalAction aria-label="Search" onClick={signOut}>
            <UserAvatar size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      )}
    </Header>
  );
};
