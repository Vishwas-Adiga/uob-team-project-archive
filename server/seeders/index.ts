import { Accommodation, Course, Module, User } from "../models/index.js";
import ACCOMMODATION_DATA from "./accommodation-data.json" assert { type: "json" };
import COURSE_DATA from "./course-data.json" assert { type: "json" };
import MODULE_DATA from "./module-data.json" assert { type: "json" };

export const seed = async () => {
  await User.destroy({ truncate: true });
  await Promise.all([
    Accommodation.destroy({ truncate: true }),
    Course.destroy({ truncate: true }),
    Module.destroy({ truncate: true }),
  ]);
  await Promise.all([
    Accommodation.bulkCreate(ACCOMMODATION_DATA),
    Course.bulkCreate(COURSE_DATA),
    Module.bulkCreate(MODULE_DATA),
  ]);
};
