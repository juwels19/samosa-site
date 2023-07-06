import moment from "moment";
import prisma from "@prisma/index";

export default async function handler(req, res) {
  const { eventKey } = req.query;

  if (req.method === "POST") {
  } else {
    res.status(500).json({ message: "Request not valid" });
  }
}
