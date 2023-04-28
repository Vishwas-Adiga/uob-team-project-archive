import { Response } from "express";
import { ValidatedRequest } from "../middleware/jwt.middleware.js";
import { UserConnection } from "../models/index.js";
import { Op } from "sequelize";

export const getConnections =
  (accepted?: boolean) => async (req: ValidatedRequest, res: Response) => {
    // if user id doesn't match then you do not have permissions to access connections & requests
    const data = await UserConnection.findAll({
      where: {
        [Op.or]: [
          { srcUserId: req.resourceRequesterId },
          { dstUserId: req.resourceRequesterId },
        ],
        accepted: { [accepted ? Op.not : Op.is]: null },
      },
    });
    const allConnections = await Promise.all(
      data.map(d => {
        if (d.srcUserId === req.resourceRequesterId) {
          return d.getAcceptor();
        } else {
          return d.getInitiator();
        }
      })
    );
    const connectionInfo = allConnections.map((f, i) => {
      return {
        userId: f.userId,
        name: f.name,
        profilePic: f.profilePicture,
        accepted: data[i].accepted,
      };
    });
    return res.status(200).send(connectionInfo);
  };
export const deleteConnection = async (
  req: ValidatedRequest,
  res: Response
) => {
  await UserConnection.destroy({
    where: {
      [Op.or]: [
        {
          [Op.and]: [
            { dstUserId: req.resourceRequesterId },
            { srcUserId: req.params.uid },
          ],
        },
        {
          [Op.and]: [
            { srcUserId: req.resourceRequesterId },
            { dstUserId: req.params.uid },
          ],
        },
      ],
    },
  });

  return res.status(200).send();
};
export const updateConnections = async (
  req: ValidatedRequest,
  res: Response
) => {
  const dateTime = new Date();
  await UserConnection.update(
    {
      accepted: dateTime,
    },
    {
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { dstUserId: req.resourceRequesterId },
              { srcUserId: req.params.uid },
            ],
          },
          {
            [Op.and]: [
              { srcUserId: req.resourceRequesterId },
              { dstUserId: req.params.uid },
            ],
          },
        ],
      },
    }
  );
};
