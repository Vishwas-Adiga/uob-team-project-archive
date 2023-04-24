import pg from "pg";
import { Sequelize } from "sequelize";
import { DbConfig } from "../configs/db.config.js";
import { init as initUser } from "./user.model.js";
import { init as initAccommodation } from "./accommodation.model.js";
import { init as initCourse } from "./course.model.js";
import { init as initAnnouncement } from "./announcement.model.js";
import { init as initLocation } from "./location.model.js";
import { init as initRichtext } from "./richtext.model.js";
import { init as initUserConnection } from "./user-connection.model.js";
import { init as initWidget } from "./widget.model.js";
import { init as initModule } from "./module.model.js";
import { init as initModuleInWidget } from "./module-in-widget.model.js";

let db: Sequelize;
if (process.env.NODE_ENV === "production") {
  if (!DbConfig.database || !DbConfig.user || !DbConfig.password) {
    throw new Error(
      "Production mode selected with database undefined: Set the database environment variables"
    );
  }
  db = new Sequelize(DbConfig.database, DbConfig.user, DbConfig.password, {
    host: DbConfig.host,
    port: DbConfig.port,
    dialect: "postgres",
    dialectModule: pg,
  });
} else {
  db = new Sequelize({
    dialect: "sqlite",
    storage: "dev.db",
  });
}

export const sequelize = db;

export const User = initUser(sequelize);
export const Accommodation = initAccommodation(sequelize);
export const Course = initCourse(sequelize);
export const Widget = initWidget(sequelize);
export const Announcement = initAnnouncement(sequelize);
export const RichText = initRichtext(sequelize);
export const Location = initLocation(sequelize);
export const UserConnection = initUserConnection(sequelize);
export const Module = initModule(sequelize);
export const ModuleInWidget = initModuleInWidget(sequelize);

Accommodation.hasMany(User, {
  foreignKey: "accommodation",
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
});
User.belongsTo(Accommodation, { foreignKey: "accommodation" });

Course.hasMany(User, {
  foreignKey: "course",
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
});
User.belongsTo(Course, { foreignKey: "course" });

User.hasMany(Widget, {
  foreignKey: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "widgets",
});
Widget.belongsTo(User, { foreignKey: "user", as: "owner" });

Widget.hasOne(Location, {
  foreignKey: "widgetId",
  onDelete: "CASCADE",
});
Location.belongsTo(Widget, { foreignKey: "widgetId" });

Widget.hasOne(RichText, {
  foreignKey: "widgetId",
  onDelete: "CASCADE",
});
RichText.belongsTo(Widget, { foreignKey: "widgetId" });

Widget.hasOne(Announcement, {
  foreignKey: "widgetId",
  onDelete: "CASCADE",
});
Announcement.belongsTo(Widget, { foreignKey: "widgetId" });

User.hasMany(UserConnection, {
  foreignKey: "srcUserId",
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
});
UserConnection.belongsTo(User, { foreignKey: "srcUserId", as: "initiator" });

User.hasMany(UserConnection, {
  foreignKey: "dstUserId",
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
});
UserConnection.belongsTo(User, { foreignKey: "dstUserId", as: "acceptor" });

Widget.belongsToMany(Module, {
  through: ModuleInWidget,
  foreignKey: "widgetId",
});
Module.belongsToMany(Widget, {
  through: ModuleInWidget,
  foreignKey: "moduleId",
});
