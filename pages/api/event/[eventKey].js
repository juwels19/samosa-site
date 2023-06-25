import { tbaEndpoint } from "src/constants";
import moment from "moment";

export default async function handler(req, res) {
  const { eventKey } = req.query;

  if (req.method === "POST") {
    // First query TBA
    const teamsResult = await fetch(
      `${tbaEndpoint}/event/${eventKey}/teams/simple`,
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key": process.env.TBA_READ_KEY,
        },
      }
    );

    if (teamsResult.ok) {
      // Now that we have all of the events, save them to the db
      const body = await teamsResult.json();
      for (const team of body) {
        await prisma.team.create({
          data: {
            createdAt: moment().format(),
            name: team.nickname,
            number: team.team_number,
            events: {
              connect: {
                eventCode: eventKey,
              },
            },
          },
        });
      }
      res.status(200).json({
        message: "Teams successfully fetched and created",
        body: body,
      });
    } else {
      res.status(500).json({ message: "TBA Error - Teams not fetched." });
    }
  } else {
    res.status(500).json({ message: "Request not valid" });
  }
}
