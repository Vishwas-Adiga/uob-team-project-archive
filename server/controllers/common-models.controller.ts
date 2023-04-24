import { Request, Response } from "express";
import { Model, ModelStatic } from "sequelize";

export const getCommonModel =
  <T extends Model>(model: ModelStatic<T>) =>
  async (req: Request, res: Response) => {
    return res.status(200).send(
      await model.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      })
    );
  };
