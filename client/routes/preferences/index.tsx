import { AuthenticatedRoute } from "../../components/conditional-route";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import {
  ContentSwitcher,
  Switch,
  Button,
  TextInput,
  Form,
  FormGroup,
  ComboBox,
} from "@carbon/react";
import { get, patch, postFile } from "../../utils/fetch";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../state/user-state";
import { Config } from "../../config";
import { useData } from "../../utils/use-data";
import { Accommodation, Course } from "../../state/types";
import { Routes } from "../index";
import { useNavigate } from "react-router-dom";
import { scannerState } from "../../state/scanner-state";
import { Helmet } from "react-helmet";

enum accountTypes {
  "Public",
  "Local",
  "Private",
}

const NFC_SUPPORTED = "NDEFReader" in window;
export const Preferences = () => {
  const [profilePicture, setPicture] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [privacy, setPrivacy] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [accommodation, setAccommodation] = useState<Accommodation | null>(
    null
  );
  const [profileBanner, setBanner] = useState(null);
  const user = useRecoilValue(userState);
  const [courses = []] = useData<Array<Course>>("courses");
  const [accommodations = []] = useData<Array<Accommodation>>("accommodations");
  const navigate = useNavigate();
  const setScannerState = useSetRecoilState(scannerState);

  useEffect(() => {
    const fetcher = async () => {
      const response = await get(`users/${user?.userId}`);
      if (!response.ok) navigate(Routes.NOT_FOUND(), { replace: true });
      const resJson = await response.json();
      setName(resJson.name);
      setEmail(resJson.email);
      setPrivacy(resJson.privacy);
      setCourse(resJson.Course);
      setAccommodation(resJson.Accommodation);
    };
    fetcher();
  }, [user, navigate]);

  const handlePictureChange = event => {
    const file = event.target.files[0];
    setPicture(file);
  };

  const handleBannerChange = event => {
    const file = event.target.files[0];
    setBanner(file);
  };

  const handlePrivacy = type => {
    setPrivacy(type);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const updateUser = async () => {
      const response = await patch(`users/${user?.userId}`, {
        name,
        email,
        privacy,
        course: course ? course.courseId : course,
        accommodation: accommodation ? accommodation.accommId : accommodation,
      });
      if (!response.ok) {
        alert("Failed to update profile. Please try again.");
      } else {
        window.alert("Updated profile");
      }
    };
    const updateProfile = async () => {
      if (profilePicture) {
        const response = await postFile(
          `portfolios/profile-picture`,
          profilePicture
        );
        if (!response.ok) {
          alert("Failed to update profile picture. Please try again.");
        }
      }
    };
    const updateBanner = async () => {
      if (profileBanner) {
        const response = await postFile(
          `portfolios/profile-banner`,
          profileBanner
        );
        if (!response.ok) {
          alert("Failed to update profile banner. Please try again.");
        }
      }
    };
    Promise.all([updateUser(), updateProfile(), updateBanner()]);
  };

  return (
    <AuthenticatedRoute>
      <div className={styles.container}>
        <Helmet>
          <title>Profile preferences | {Config.APP.NAME}</title>
        </Helmet>
        <div className={styles.header}>
          <h3>Preferences</h3>
          <h4>Edit your personal details and account preferences</h4>
        </div>

        <div className={`${styles.column} ${styles.fields}`}>
          <h5>Personal info</h5>
          <Form onSubmit={handleSubmit}>
            <FormGroup legendText="">
              <TextInput
                id="name"
                labelText="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup legendText="">
              <TextInput
                id="email"
                labelText="Email"
                type="email"
                value={email}
                pattern={Config.ORG.EMAIL_REGEX.source}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup legendText="">
              <ComboBox
                id="course"
                titleText="Course"
                items={courses}
                itemToString={item => (item ? item.name : "")}
                onChange={e => setCourse(e.selectedItem)}
                selectedItem={course}
                shouldFilterItem={({ item, inputValue }) =>
                  item.name
                    .toLowerCase()
                    .replaceAll(/[^a-zA-Z\d]/gi, "")
                    .includes(
                      inputValue.toLowerCase().replaceAll(/[^a-zA-Z\d]/gi, "")
                    )
                }
              />
            </FormGroup>
            <FormGroup legendText="">
              <ComboBox
                id="accommodation"
                titleText="Accommodation"
                items={accommodations}
                itemToString={item => (item ? item.name : "")}
                onChange={e => setAccommodation(e.selectedItem)}
                selectedItem={accommodation}
              />
            </FormGroup>
            <Button type="submit">Save Changes</Button>
          </Form>
          {NFC_SUPPORTED && (
            <Button
              onClick={setScannerState.bind(null, {
                open: true,
                mode: "register",
              })}
            >
              Link student ID
            </Button>
          )}
        </div>

        <div className={`${styles.column} ${styles.accountTypeSwitcher}`}>
          <h5>Profile visibility</h5>
          <ContentSwitcher
            selectedIndex={Object.values(accountTypes).indexOf(
              privacy ?? "Public"
            )}
            onChange={accountText => {
              handlePrivacy(accountText.text);
            }}
          >
            <Switch name="account-type" text="Public" />
            <Switch name="account-type" text="Local" />
            <Switch name="account-type" text="Private" />
          </ContentSwitcher>
          {privacy === "Public" && (
            <p>
              Public profiles are visible to everyone on the internet, including
              users not signed into {Config.APP.NAME}
            </p>
          )}
          {privacy === "Local" && (
            <p>
              Local profiles are only visible to {Config.APP.NAME} users from{" "}
              {Config.ORG.NAME}
            </p>
          )}
          {privacy === "Private" && (
            <p>Private profiles are only visible to your connections</p>
          )}
        </div>

        <div className={`${styles.column} ${styles.picture}`}>
          <h5>Profile picture and banner</h5>
          <label className={styles.profilePicture}>
            <img
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : `/api/v1/portfolios/${user?.userId}/profile-picture`
              }
              alt="Profile Picture"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
            />
          </label>
          <label className={styles.banner}>
            <img
              src={
                profileBanner
                  ? URL.createObjectURL(profileBanner)
                  : `/api/v1/portfolios/${user?.userId}/profile-banner`
              }
              alt="Profile Banner"
            />
            <input type="file" accept="image/*" onChange={handleBannerChange} />
          </label>
        </div>
      </div>
    </AuthenticatedRoute>
  );
};
