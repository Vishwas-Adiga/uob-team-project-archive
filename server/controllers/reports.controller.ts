import { Report } from "../models/report.model.js";
import { ReportType } from "../models/report-type.model.js";
import { ValidatedRequest } from "../middleware/jwt.middleware.js";
import { Response } from "express";

export const createReport = async (req: ValidatedRequest, res: Response) => {
  try {
    const report = await Report.create({
      type: req.body.type,
      reason: req.body.reason,
      reporterId: req.resourceRequesterId!,
      reporteeId: req.body.userId,
    });

    return res.status(201).send({ report });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Unable to create report" });
  }
};

export const getReportById = async (req: ValidatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const report = await Report.findByPk(id, { include: [ReportType] });
    if (!report) {
      return res.status(404).send({ error: "Report not found" });
    }
    return res.status(200).send({ report });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Unable to fetch report" });
  }
};

export const getAllReports = async (req: ValidatedRequest, res: Response) => {
  try {
    const reports = await Report.findAll({ include: [ReportType] });
    return res.status(200).send({ reports });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Unable to fetch reports" });
  }
};
