import { Response } from "express";
import { ValidatedRequest } from "../middleware/jwt.middleware.js";
import { Widget, sequelize } from "../models/index.js";

export const getWidget = async (req: ValidatedRequest, res: Response) => {
  const widget = await Widget.findByPk(parseInt(req.params.wid, 10));
  if (!widget) {
    return res.status(500).send();
  }
  const payload = await widget.getPayload();
  if (!payload) {
    return res.status(500).send();
  }
  return res.status(200).send(payload);
};

export const createWidget = async (req: ValidatedRequest, res: Response) => {
  // widget type
  // {type: "type", "data": {...}, "index": 0}
  try {
    const widget = await sequelize.transaction(async t => {
      const widget = await Widget.create(
        {
          index: req.body.index,
          widgetType: req.body.type,
          user: req.resourceRequesterId,
        },
        { transaction: t }
      );
      await widget?.createPayload(req.body.data, { transaction: t });
      return widget;
    });
    return res.status(200).send(await widget.getPayload());
  } catch (error) {
    return res.status(400).send();
  }
};

export const updateWidget = async (req: ValidatedRequest, res: Response) => {
  try {
    const widget = await Widget.findByPk(parseInt(req.params.wid, 10));
    if (!widget) {
      return res.status(500).send();
    }
    const payload = await widget.getPayload();
    if (!payload) {
      return res.status(500).send();
    }
    if (widget.widgetType === "Module") {
      await sequelize.transaction(async t => {
        // @ts-ignore
        await widget.setModules([], { transaction: t });
        await widget.createPayload(req.body.modules, { transaction: t });
      });
    } else {
      for (const key in req.body) {
        if (key === "widgetId") continue;
        payload[key] = req.body[key];
      }
      // @ts-ignore
      await payload.save();
    }
    return res.status(200).send();
  } catch (error) {
    return res.status(400).send();
  }
};

export const deleteWidget = async (req: ValidatedRequest, res: Response) => {
  const widget = await Widget.findByPk(parseInt(req.params.wid, 10));
  if (!widget) {
    return res.status(500).send();
  }
  await widget.destroy();
  return res.status(200).send();
};
