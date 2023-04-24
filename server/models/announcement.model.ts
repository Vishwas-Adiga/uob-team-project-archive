import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Widget } from "./widget.model.js";

export class Announcement extends Model<
  InferAttributes<Announcement>,
  InferCreationAttributes<Announcement>
> {
  // Foreign key that identifies this widget among all widgets of all types
  declare readonly widgetId: ForeignKey<Widget["widgetId"]>;
  // Title of the announcement
  declare title: string;
  // Description of the announcement
  declare content?: string;
  // Datetime after which this announcement must not appear on a portfolio
  declare expiry: Date;
}

export const init = sequelize =>
  Announcement.init(
    {
      widgetId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
      },
      expiry: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { modelName: "Announcement", freezeTableName: true, sequelize }
  );
