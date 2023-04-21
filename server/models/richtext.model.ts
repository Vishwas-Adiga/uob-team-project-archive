import { DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { Widget } from "./widget.model.js";

export class RichText extends Widget<
  InferAttributes<RichText>,
  InferCreationAttributes<RichText>
> {
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
        autoIncrement: true,
        primaryKey: true,
      },
      user: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
