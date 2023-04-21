import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Widget } from "./widget.model.js";

export class RichText extends Model<
  InferAttributes<RichText>,
  InferCreationAttributes<RichText>
> {
  // Foreign key that identifies this widget among all widgets of all types
  declare widgetId: ForeignKey<Widget["widgetId"]>;
  // Title
  declare title: string;
  // Content
  declare content: string;
}

export const init = sequelize =>
  RichText.init(
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
        allowNull: false,
      },
    },
    { modelName: "RichText", freezeTableName: true, sequelize }
  );
