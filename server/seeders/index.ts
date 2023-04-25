import {
  Accommodation,
  Course,
  Module,
  User,
  sequelize,
} from "../models/index.js";
import ACCOMMODATION_DATA from "./accommodation-data.json" assert { type: "json" };
import COURSE_DATA from "./course-data.json" assert { type: "json" };
import MODULE_DATA from "./module-data.json" assert { type: "json" };
import ADMIN_USER from "./demo-user.json" assert { type: "json" };
import { User as UserT } from "../models/user.model.js";

export const seed = async () => {
  await sequelize.sync({ force: true });
  await Promise.all([
    Accommodation.bulkCreate(ACCOMMODATION_DATA),
    Course.bulkCreate(COURSE_DATA),
    Module.bulkCreate(MODULE_DATA),
    User.create(ADMIN_USER as UserT),
  ]);
};
