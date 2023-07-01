import { tbaEndpoint } from "src/constants";
import moment from "moment";
import prisma from "@prisma/index";

export default async function handler(req, res) {
  const { eventKey } = req.query;

  if (req.method === "POST") {
    // This will handle the post request for when an admin wants to submit the event setup
    const body = await JSON.parse(req.body);

    var arrayOfStrings = [];
    for (const category of body.categories) {
      arrayOfStrings.push(JSON.stringify(category));
    }

    // Update the event in the DB
    const updateRes = await prisma.event.update({
      where: {
        eventCode: eventKey,
      },
      data: {
        isSetup: true,
        categories: arrayOfStrings,
        numberOfTeamPicks: parseInt(body.numberOfTeamPicks),
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
