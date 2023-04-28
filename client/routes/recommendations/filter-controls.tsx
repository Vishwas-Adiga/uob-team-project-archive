import { useCallback } from "react";
import { Checkbox, FilterableMultiSelect, Slider } from "@carbon/react";
import { useRecoilValue } from "recoil";
import { Filter } from "./index";
import { useData } from "../../utils/use-data";
import { userState } from "../../state/user-state";
import styles from "./style.module.scss";
import { Accommodation, Course } from "../../state/types";

interface FilterControlsProps {
  setFilter: (filter: Filter) => void;
  filter: Filter;
}

export const FilterControls = (props: FilterControlsProps) => {
  const user = useRecoilValue(userState);
  const [courses = []] = useData<Array<Course>>("courses");
  const [accoms = []] = useData<Array<Accommodation>>("accommodations");

  const setMinMutuals = useCallback(
    ({ value }) => props.setFilter({ ...props.filter, minMutuals: value }),
    [props]
  );

  const setMinSimilarity = useCallback(
    ({ value }) => props.setFilter({ ...props.filter, minSimilarity: value }),
    [props]
  );

  const setCourses = useCallback(
    ({ selectedItems }) =>
      props.setFilter({
        ...props.filter,
        courses: selectedItems,
      }),
    [props, courses]
  );

  const setCourseToSelf = useCallback(
    (_, { checked }) => {
      if (!user) return;
      props.setFilter({
        ...props.filter,
        courses: checked ? [user.Course] : [],
      });
    },
    [props, user, courses]
  );

  const setAccoms = useCallback(
    ({ selectedItems }) =>
      props.setFilter({
        ...props.filter,
        accommodations: selectedItems,
      }),
    [props]
  );

  const setAccomToSelf = useCallback(
    (_, { checked }) => {
      if (!user) return;
      props.setFilter({
        ...props.filter,
        accommodations: checked ? [user.Accommodation] : [],
      });
    },
    [props, user]
  );

  return (
    <div className={styles.filterControls}>
      <Slider
        labelText="Minimum mutual connections"
        value={props.filter.minMutuals}
        min={0}
        max={20}
        step={1}
        stepMultiplier={1}
        noValidate
        onChange={setMinMutuals}
      />
      <Slider
        labelText="Minimum similarity score"
        value={props.filter.minSimilarity}
        min={0}
        max={100}
        step={1}
        stepMultiplier={1}
        noValidate
        onChange={setMinSimilarity}
      />
      <Checkbox
        labelText={`Same course as me`}
        id="recs-filter-course"
        checked={
          props.filter.courses.length === 1 &&
          props.filter.courses.find(
            c => c.courseId === user?.Course.courseId
          ) !== undefined
        }
        onChange={setCourseToSelf}
      />
      <FilterableMultiSelect
        id="recs-filter-all-course"
        disabled={
          props.filter.courses.length === 1 &&
          props.filter.courses.find(c => c.courseId === 142) !== undefined
        }
        titleText="Course"
        hideHelperText
        items={courses}
        selectedItems={props.filter.courses}
        itemToString={item => item.name}
        selectionFeedback="top"
        onChange={setCourses}
      />
      <Checkbox
        labelText={`Same accommodation as me`}
        id="recs-filter-accom"
        checked={
          props.filter.accommodations.length === 1 &&
          props.filter.accommodations.find(
            a => a.accommId === user?.Accommodation.accommId
          ) !== undefined
        }
        onChange={setAccomToSelf}
      />
      <FilterableMultiSelect
        id="recs-filter-all-accom"
        disabled={
          props.filter.accommodations.length === 1 &&
          props.filter.accommodations.find(
            a => a.accommId === user?.Accommodation.accommId
          ) !== undefined
        }
        titleText="Accommodation"
        hideHelperText
        items={accoms}
        selectedItems={props.filter.accommodations}
        itemToString={item => item.name}
        selectionFeedback="top"
        onChange={setAccoms}
      />
    </div>
  );
};
