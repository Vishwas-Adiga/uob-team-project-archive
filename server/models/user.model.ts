import {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Config } from "../configs/config.js";
import { Accommodation } from "./accommodation.model.js";
import { Course } from "./course.model.js";
import { Widget } from "./widget.model.js";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  // Unique integer auto-generated by the db
  declare userId: CreationOptional<number>;
  // Organisation-issued email address
  // Email not used as primary key to mask it from public urls
  declare email: string;
  // Hashed password
  declare password: string;
  // Name
  declare name: string;
  // Privacy mode
  declare privacy: CreationOptional<"Public" | "Local" | "Private">;
  // NFC tag
  declare nfcTag: CreationOptional<string>;
  // Profile picture filename
  declare profilePicture: CreationOptional<string>;
  // Profile banner
  declare profileBanner: CreationOptional<string>;
  // Accommodation
  declare accommodation: ForeignKey<Accommodation["accommId"]>;
  // Course
  declare course: ForeignKey<Course["courseId"]>;

  // Association mixin declarations
  declare getAccommodation: BelongsToGetAssociationMixin<Accommodation>;
  declare setAccommodation: BelongsToSetAssociationMixin<Accommodation, number>;
  declare createAccommodation: BelongsToCreateAssociationMixin<Accommodation>;

  declare getCourse: BelongsToGetAssociationMixin<Course>;
  declare setCourse: BelongsToSetAssociationMixin<Course, number>;
  declare createCourse: BelongsToCreateAssociationMixin<Course>;
  declare getWidgets: HasManyGetAssociationsMixin<Widget>;
}

export const init = sequelize =>
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          is: {
            args: [Config.ORG_EMAIL_REGEX],
            msg: "Email used is not university-issued",
          },
        },
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      course: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      accommodation: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      privacy: {
        type: DataTypes.ENUM("Public", "Local", "Private"),
        defaultValue: "Public",
        allowNull: false,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      nfcTag: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      profilePicture: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      profileBanner: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
    },
    { modelName: "User", freezeTableName: true, sequelize }
  );
