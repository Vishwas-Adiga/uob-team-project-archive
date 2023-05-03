import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { User } from "./user.model.js";
import { ReportType } from "./report-type.model.js";

export class Report extends Model<
  InferAttributes<Report>,
  InferCreationAttributes<Report>
> {
  declare reportId: CreationOptional<number>;
  declare readonly reporterId: ForeignKey<User["userId"]>;
  declare readonly reporteeId: ForeignKey<User["userId"]>;
  declare type: ForeignKey<ReportType["typeId"]>;
  declare reason: string;
  declare time: CreationOptional<Date>;
}

export const init = sequelize =>
  Report.init(
    {
      reportId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      reporterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reporteeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    { modelName: "Report", freezeTableName: true, sequelize }
  );
