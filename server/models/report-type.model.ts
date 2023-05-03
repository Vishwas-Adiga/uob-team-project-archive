import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

export class ReportType extends Model<
  InferAttributes<ReportType>,
  InferCreationAttributes<ReportType>
> {
  // Unique integer auto-generated by the db
  declare typeId: CreationOptional<number>;
  // Type of report
  declare description: string;
}

export const init = sequelize =>
  ReportType.init(
    {
      typeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { modelName: "ReportType", freezeTableName: true, sequelize }
  );