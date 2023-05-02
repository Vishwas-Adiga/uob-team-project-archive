import {
  Button,
  Header,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderSideNavItems,
  OverflowMenu,
  OverflowMenuItem,
  Search,
  SideNav,
  SideNavItems,
  SkipToContent,
} from "@carbon/react";
import { Login, QrCode, UserAvatar } from "@carbon/icons-react";
import { Config } from "../../config";
import styles from "./style.module.scss";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userState } from "../../state/user-state";
import { scannerState } from "../../state/scanner-state";
import { ChangeEvent, KeyboardEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes";
import { NavItems } from "./nav-items";

export const Nav = () => {
  const [query, setQuery] = useState("");
  const [sideNavExpanded, setSideNavExpanded] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const setScanner = useSetRecoilState(scannerState);
  const navigate = useNavigate();

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

  const onClickSideNavExpand = useCallback(() => {
    setSideNavExpanded(e => !e);
  }, [sideNavExpanded]);

  const [notificationAnswered, setNotificationAnswered] = useState(false);

  const enableNotifications = useCallback(() => {
    Notification.requestPermission((result: string) => {
      if (result !== "default") {
        setNotificationAnswered(true);
      }
      if (result === "granted") {
        console.log("Enabling WS!");
        const token = localStorage.getItem(Config.STORAGE.JWT_TOKEN_KEY);
        if (!token) return null;
        const sock = new WebSocket(
          `wss://${window.location.host}/socket?token=${token}`
        );
        sock.addEventListener("message", event => {
          const payload = JSON.parse(event.data);
          let title;
          let body;
          if (payload.type !== "Announcement") {
            return;
          }
          title = `${payload.username} : Porfolio update`;
          if (payload.event === "create") {
            body = `New ${payload.type} from ${payload.username}`;
          }
          new Notification(title, { body });
        });
      }
    });
  }, []);

  return (
    <Header aria-label={"App header"} className={styles.header}>
      <SkipToContent />
      {user && (
        <HeaderMenuButton
          aria-label={sideNavExpanded ? "Close menu" : "Open menu"}
          onClick={onClickSideNavExpand}
          isActive={sideNavExpanded}
        />
      )}
      <HeaderName
        prefix=""
        onClick={navigate.bind(
          null,
          user
            ? Routes.PORTFOLIO(user.userId.toString())
            : Routes.AUTH_SIGN_IN()
        )}
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
          <NavItems />
        </HeaderNavigation>
      )}
      {user && (
        <HeaderGlobalBar>
          <Button
            renderIcon={QrCode}
            onClick={setScanner.bind(null, { open: true, mode: "read" })}
          >
            Connect
          </Button>
          <OverflowMenu
            size="lg"
            flipped
            renderIcon={UserAvatar}
            ariaLabel="Sign out menu"
          >
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
              itemText="Enable notifications"
              onClick={enableNotifications}
              disabled={notificationAnswered}
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
      {!user && (
        <HeaderGlobalBar>
          <Button
            renderIcon={Login}
            onClick={navigate.bind(null, Routes.AUTH_SIGN_IN())}
          >
            Sign in
          </Button>
        </HeaderGlobalBar>
      )}
      <SideNav
        aria-label="Side navigation"
        expanded={sideNavExpanded}
        isPersistent={false}
      >
        <SideNavItems>
          <HeaderSideNavItems>
            <Search
              size="sm"
              className={styles.searchMobile}
              placeholder="Find students to connect with"
              labelText="Find students to connect with"
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              value={query}
            ></Search>
            <NavItems />
          </HeaderSideNavItems>
        </SideNavItems>
      </SideNav>
    </Header>
  );
};
