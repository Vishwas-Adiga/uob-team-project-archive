import {
  Button,
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  OverflowMenu,
  OverflowMenuItem,
  Search,
  SkipToContent,
} from "@carbon/react";
import { QrCode, UserAvatar } from "@carbon/icons-react";
import { Config } from "../../config";
import styles from "./style.module.scss";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userState } from "../../state/user-state";
import { scannerState } from "../../state/scanner-state";
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Routes } from "../../routes";

export const Nav = () => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useRecoilState(userState);
  const setScanner = useSetRecoilState(scannerState);
  const navigate = useNavigate();
  const location = useLocation();

  const signOut = useCallback(() => {
    localStorage.clear();
    setUser(null);
  }, [setUser]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && query.trim().length > 0) {
        navigate(Routes.SEARCH(query));
      }
    },
    [navigate, query]
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    [setQuery]
  );

  return (
    <Header aria-label={"App header"} className={styles.header}>
      <SkipToContent />
      <HeaderName
        prefix=""
        onClick={navigate.bind(null, Routes.PORTFOLIO(user?.userId.toString()))}
      >
        {Config.APP.NAME}
      </HeaderName>
      {user && (
        <HeaderNavigation aria-label="App navigation" className={styles.nav}>
          <Search
            size="sm"
            className={styles.search}
            placeholder="Find students to connect with"
            labelText="Find students to connect with"
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            value={query}
          ></Search>
          <HeaderMenuItem
            isCurrentPage={location.pathname === Routes.CONNECTIONS()}
            onClick={navigate.bind(null, Routes.CONNECTIONS())}
            className={styles.navItem}
          >
            Connections
          </HeaderMenuItem>
          <HeaderMenuItem
            isCurrentPage={location.pathname === Routes.RECOMMENDATIONS()}
            onClick={navigate.bind(null, Routes.RECOMMENDATIONS())}
            className={styles.navItem}
          >
            For you
          </HeaderMenuItem>
          <HeaderMenuItem
            isCurrentPage={location.pathname === Routes.GRAPH()}
            onClick={navigate.bind(null, Routes.GRAPH())}
            className={styles.navItem}
          >
            {Config.GRAPH.NAME}
          </HeaderMenuItem>
        </HeaderNavigation>
      )}
      {user && (
        <HeaderGlobalBar>
          <Button
            renderIcon={QrCode}
            onClick={setScanner.bind(null, { open: true })}
          >
            Connect
          </Button>
          <OverflowMenu size="lg" flipped renderIcon={UserAvatar}>
            <OverflowMenuItem
              className={styles.signedInUserInfo}
              onClick={navigate.bind(
                null,
                Routes.PORTFOLIO(user.userId.toString())
              )}
              itemText={
                <>
                  <h5>{user.name}</h5>
                  Signed in as {user.email}
                </>
              }
            />
            <OverflowMenuItem
              disabled
              itemText={`${Config.APP.NAME}, for ${Config.ORG.NAME}`}
            />
            <OverflowMenuItem
              hasDivider
              itemText="Sign out"
              onClick={signOut}
            />
          </OverflowMenu>
        </HeaderGlobalBar>
      )}
    </Header>
  );
};
