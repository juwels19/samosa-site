import { tbaEndpoint } from "src/constants";
import moment from "moment";
import prisma from "@prisma/index";

export default async function handler(req, res) {
  const { eventKey } = req.query;

  if (req.method === "POST") {
    // This will handle the post request for when an admin wants to submit the event setup
    const body = await JSON.parse(req.body);

    // Update the event in the DB
    const updateRes = await prisma.event.update({
      where: {
        eventCode: eventKey,
      },
      data: {
        isSetup: true,
        numberOfTeamPicks: parseInt(body.numberOfTeamPicks),
        numberOfCategoryPicks: parseInt(body.numberOfCategoryPicks),
      },
    });

    if (updateRes) {
      res.status(200).json({
        message: "Event successfully setup",
        body: updateRes,
      });
    } else {
      res.status(500).json({ message: "Prisma error - event not setup" });
    }
  } else {
    res.status(500).json({ message: "Request not valid" });
  }
}
