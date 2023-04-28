import { AuthenticatedRoute } from "../../components/conditional-route";
import { useCallback, useState } from "react";
import styles from "./style.module.scss";
import profilePictureDefault from "../../assets/placeholders/profile_picture.png";
import profileBannerDefault from "../../assets/placeholders/profile_banner.jpg";
import {
  ContentSwitcher,
  Switch,
  Button,
  TextInput,
  Form,
  FormGroup,
  ComboBox,
} from "@carbon/react";
import { patch } from "../../utils/fetch";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/user-state";
import { Config } from "../../config";
import { useData } from "../../utils/use-data";
import { Accommodation, Course } from "../../state/types";

enum accountTypes {
  "Public",
  "Private",
  "Local",
}

export const Preferences = () => {
  const [profilePicture, setPicture] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [privacy, setPrivacy] = useState("Public");
  const [course, setCourse] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [profileBanner, setBanner] = useState(null);
  const user = useRecoilValue(userState);
  const [courses = []] = useData<Array<Course>>("courses");
  const [accommodations = []] = useData<Array<Accommodation>>("accommodations");

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

  const handleSubmit = async () => {
    const response = await patch(`users/${user?.userId}`, {
      name,
      email,
      privacy,
      course,
      accommodation,
    });
    if (response.ok) {
      alert("Profile updated successfully!");
    } else {
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <AuthenticatedRoute>
      <>
        <h1>Preferences</h1>
        <div className={styles.container}>
          <div className={styles.picture}>
            <label>
              Profile Picture:
              <img
                src={
                  profilePicture
                    ? URL.createObjectURL(profilePicture)
                    : profilePictureDefault
                }
                alt="Profile Picture"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
              />
            </label>
          </div>

          <div className={styles.accountTypeSwitcher}>
            <ContentSwitcher
              selectedIndex={Object.values(accountTypes).indexOf(privacy)}
              onChange={accountText => {
                handlePrivacy(accountText.text);
              }}
            >
              <Switch name="account-type" text="Public" />
              <Switch name="account-type" text="Private" />
              <Switch name="account-type" text="Local" />
            </ContentSwitcher>
          </div>

          <div className={styles.fields}>
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
          </div>

          <div className={styles.banner}>
            <label>
              Banner:
              <img
                src={
                  profileBanner
                    ? URL.createObjectURL(profileBanner)
                    : profileBannerDefault
                }
                alt="Profile Banner"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
              />
            </label>
          </div>
        </div>
      </>
    </AuthenticatedRoute>
  );
};
