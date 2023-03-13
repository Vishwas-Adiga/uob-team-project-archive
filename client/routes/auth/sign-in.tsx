import { FormEvent, useRef, useState } from "react";
import { Button, InlineNotification, TextInput } from "@carbon/react";
import { PortInput } from "@carbon/icons-react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Helmet } from "react-helmet";
import { Config } from "../../config";
import { get, post } from "../../utils/fetch";
import { Routes } from "../index";
import { userState } from "../../state/user-state";
import styles from "./style.module.scss";

export const SignIn = () => {
  const form = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [formEnabled, setFormEnabled] = useState(true);
  const setUser = useSetRecoilState(userState);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormEnabled(false);

    const body = Object.fromEntries(
      new FormData(form.current ?? undefined).entries()
    );
    const response = await post("auth/sign-in", body);
    if (!response.ok) {
      const errorMsg = (await response.json()).message;
      setError(errorMsg);
      setFormEnabled(true);
      return;
    }

    // If signing-in was successful, store the userId and JWT in local storage
    // to persist it across refreshes
    // The app uses this as the source of truth when attempting to fetch the
    // current user after a page refresh
    const json = await response.json();
    localStorage.setItem(Config.STORAGE.USER_ID_KEY, json.id);
    localStorage.setItem(Config.STORAGE.JWT_TOKEN_KEY, json.token);

    // Fetch the current user and attach to the app's state
    // This will force a re-render and redirect the user away from the auth page
    // TODO: Allow redirecting to last authenticated url
    const userResponse = await get(`users/${json.id}`);
    if (!userResponse.ok) {
      // This should NEVER happen (ideally)
      setError("Could not sign you in. Please try again later");
    }
    setUser(await userResponse.json());
  };

  return (
    <>
      <Helmet>
        <title>Sign into {Config.APP.NAME}</title>
      </Helmet>
      <h2>Sign in</h2>
      <p className={styles.loginInHint}>
        Don't have an account yet?{" "}
        <Link to={Routes.AUTH_SIGN_UP()}>Sign up instead</Link>
      </p>
      <form className={styles.form} onSubmit={submit} ref={form}>
        <TextInput
          id="sign-in__email"
          type="text"
          pattern={Config.ORG.EMAIL_REGEX.source}
          labelText="Email"
          placeholder={Config.ORG.EMAIL_PLACEHOLDER}
          name="email"
          invalid={error !== null}
          required
        />
        <TextInput.PasswordInput
          id="sign-in__password1"
          labelText="Password"
          name="password"
          invalid={error !== null}
          required
        />

        <Button renderIcon={PortInput} type="submit" disabled={!formEnabled}>
          Sign in
        </Button>
        {error && <InlineNotification title={error} hideCloseButton />}
      </form>
    </>
  );
};
