import { Response } from "express";
import { ValidatedRequest } from "../middleware/jwt.middleware.js";
import { Widget, User, sequelize } from "../models/index.js";
import { Widget as WidgetT } from "../models/widget.model.js";
import { Op } from "sequelize";

import { wsClients } from "../main.js";
import { calculateAllConnections } from "./user-connection.controller.js";

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

export const getAllWidgets = async (req: ValidatedRequest, res: Response) => {
  const user = await User.findByPk(req.resourceOwnerId);
  if (!user) {
    return res.status(500).send();
  }
  // lazy loading as eager loading causes ts issues
  const payloads = await Promise.all(
    (
      await user.getWidgets({ order: [["index", "ASC"]] })
    ).map(w => {
      return w.getPayload();
    })
  );
  if (payloads.some(p => !p)) {
    return res.status(500).send();
  }
  return res.status(200).send(payloads);
};

export const createWidget = async (req: ValidatedRequest, res: Response) => {
  // widget type
  // {type: "type", "data": {...}, "index": 0}
  const user = await User.findByPk(req.resourceRequesterId);
  if (!user) {
    return res.status(500).send();
  }
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
      await widget?.createPayload(req.body.payload, { transaction: t });
      return widget;
    });

    const allConnections = (
      await calculateAllConnections(req.resourceRequesterId!, true)
    ).map(f => f.userId);
    for (const [k, v] of wsClients) {
      if (allConnections.includes(k)) {
        v.send(
          JSON.stringify({
            event: "create",
            type: req.body.type,
            username: user.name,
          })
        );
      }
    }

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
    if ("index" in req.body) {
      await moveWidget(widget, req.body.index - widget.index);
    }
    if (widget.widgetType === "Module") {
      if ("payload" in req.body) {
        await sequelize.transaction(async t => {
          // @ts-ignore
          await widget.setModules([], { transaction: t });
          await widget.createPayload(req.body.payload, { transaction: t });
        });
      }
    } else {
      for (const key in req.body.payload) {
        if (key === "widgetId") continue;
        payload[key] = req.body.payload[key];
      }
      await sequelize.transaction(async t => {
        await (
          await widget[`get${widget.widgetType}`]({ transaction: t })
        ).destroy({ transaction: t });
        // @ts-ignore
        await widget.createPayload(payload, { transaction: t });
      });
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
  const index = widget.index;
  const owner = widget.user;
  await sequelize.transaction(async t => {
    await widget.destroy({ transaction: t });
    await Widget.decrement(
      {
        index: 1,
      },
      {
        where: { index: { [Op.gt]: index }, user: owner },
        transaction: t,
      }
    );
  });
  return res.status(200).send();
};

const moveWidget = async (widget: WidgetT, delta: number) => {
  if (delta === 0) return;
  const oldIndex = widget.index;
  const newIndex = oldIndex + delta;
  if (isNaN(oldIndex) || isNaN(newIndex))
    throw new Error("Bad arguments to delta: Expected number, got ???");

  await sequelize.transaction(async t => {
    // Move widget out of the way
    widget.index = -1;
    await widget.save({ transaction: t });
    // Move all widgets up by 1
    if (delta > 0) {
      await Widget.decrement(
        {
          index: 1,
        },
        {
          where: {
            index: { [Op.between]: [oldIndex, newIndex] },
            user: widget.user,
          },
          transaction: t,
        }
      );
    } else {
      // Moving widgets down by 1 isn't as trivial unfortunately
      // It's not possible to shift by 1 in a single query without violating
      // constraints. Instead, we start from the bottom where we assuredly have
      // a hole available and move upwards
      const widgets = await Widget.findAll({
        where: {
          index: { [Op.between]: [newIndex, oldIndex] },
          user: widget.user,
        },
        transaction: t,
      });
      const reversedWidgets = widgets.reverse();
      for (const w of reversedWidgets) {
        w.index++;
        await w.save({ transaction: t });
      }
    }
    // Restore widget
    widget.index = oldIndex + delta;
    await widget.save({ transaction: t });
  });
};
