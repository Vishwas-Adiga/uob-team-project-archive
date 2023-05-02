import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Widget } from "./widget.model.js";

const PLATFORMS = [
  "bereal",
  "discord",
  "instagram",
  "github",
  "linkedin",
  "reddit",
  "snapchat",
  "twitter",
] as const;
export type SocialPlatform = (typeof PLATFORMS)[number];

export class Social extends Model<
  InferAttributes<Social>,
  InferCreationAttributes<Social>
> {
  // Foreign key that identifies this widget among all widgets of all types
  declare readonly widgetId: ForeignKey<Widget["widgetId"]>;
  // Name of the social media platform
  declare platform: SocialPlatform;
  // Username on the platform
  declare username: string;
}

export const init = sequelize =>
  Social.init(
    {
      widgetId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      platform: {
        // leaving this as TEXT and not ENUM(PLATFORMS)
        // as sequelize will   brickie otherwise
        type: DataTypes.TEXT,
        allowNull: false,
      },
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { modelName: "Social", freezeTableName: true, sequelize }
  );
