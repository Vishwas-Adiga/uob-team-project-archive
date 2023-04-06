import { FormEvent, useRef, useState } from "react";
import { Button, InlineNotification, TextInput } from "@carbon/react";
import { PortInput } from "@carbon/icons-react";
import { Helmet } from "react-helmet";
import { Config } from "../../config";
import { Link } from "react-router-dom";
import { post } from "../../utils/fetch";
import { Routes } from "../index";
import styles from "./style.module.scss";

type FormError = "password-mismatch" | "duplicate-email" | null;

export const SignUp = () => {
  const form = useRef<HTMLFormElement>(null);
  const passwords = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [error, setError] = useState<FormError>(null);
  const [formEnabled, setFormEnabled] = useState(true);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    // Lock form to prevent multiple submissions
    setFormEnabled(false);

    // Ensure password fields match
    if (passwords[0].current?.value !== passwords[1].current?.value) {
      setError("password-mismatch");
      setFormEnabled(true);
      return;
    }

    // Construct JSON payload from form data and send to server
    const body = Object.fromEntries(
      new FormData(form.current ?? undefined).entries()
    );
    const response = await post("auth/sign-up", body);
    if (response.ok) {
      // Once signed up, ask user to sign in to start session
      window.location.href = Routes.AUTH_SIGN_IN();
      return;
    }
    setError("duplicate-email");
    // Unlock form to re-attempt signing up
    setFormEnabled(true);
  };

  return (
    <>
      <Helmet>
        <title>Get started with {Config.APP.NAME}</title>
      </Helmet>
      <h2>Sign up</h2>
      <p className={styles.loginInHint}>
        Already have an account?{" "}
        <Link to={Routes.AUTH_SIGN_IN()}>Sign in instead</Link>
      </p>
      <form className={styles.form} onSubmit={submit} ref={form}>
        <TextInput
          id="sign-up__name"
          type="text"
          labelText="Full name"
          placeholder="First Last"
          name="name"
          required
        />
        <TextInput
          id="sign-up__email"
          type="text"
          pattern={Config.ORG.EMAIL_REGEX.source}
          labelText="Email"
          placeholder={Config.ORG.EMAIL_PLACEHOLDER}
          name="email"
          invalid={error === "duplicate-email"}
          required
        />
        <TextInput.PasswordInput
          id="sign-up__password1"
          labelText="Password"
          name="password1"
          ref={passwords[0]}
          invalid={error === "password-mismatch"}
          required
        />
        <TextInput.PasswordInput
          id="sign-up__password2"
          labelText="Confirm password"
          name="password2"
          ref={passwords[1]}
          invalid={error === "password-mismatch"}
          required
        />
        <Button renderIcon={PortInput} type="submit" disabled={!formEnabled}>
          Sign up
        </Button>
        {error && (
          <InlineNotification
            title={
              error == "duplicate-email"
                ? "An account with this email already exists. Try signing in instead"
                : "Password fields do not match"
            }
            hideCloseButton
          />
        )}
      </form>
    </>
  );
};
