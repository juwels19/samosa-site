import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  Heading,
  VStack,
  useToast,
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";
import EventCard from "@components/EventCard";
import prisma from "@prisma/index";
import moment from "moment";
import { useState } from "react";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { useRouter } from "next/router";

export default function Admin(props) {
  const { currentSeason, events, year } = props;

  const bg = useColorModeValue("#FFFFFF", "#121212");
  const textColor = useColorModeValue("#FFFFFF", "#FFFFFF");

  const [isLoading, setIsLoading] = useState(false);

  const [_currentSeason, setCurrentSeason] = useState(currentSeason);
  const [_events, setEvents] = useState(events);

  const toast = useToast();
  const router = useRouter();

  const displayToast = (message, type) => {
    toast({
      title: message,
      status: type,
      duration: 5000,
      position: "top-right",
    });
  };

  const createEventsForSeason = async (districtKey, seasonId) => {
    const eventFetchRes = await fetch(
      `/api/tba/districts/${districtKey}/events`,
      { method: "GET" }
    );
    const res = await eventFetchRes.json();
    const events = res.body;

    const newEventsBody = {
      events: [],
    };
    for (const event of events) {
      newEventsBody.events.push({
        name: event.name,
        seasonId: seasonId,
        eventCode: event.key,
        startDate: event.start_date,
        endDate: event.end_date,
      });
    }
    const eventCreateRes = await fetch(`api/events/new`, {
      method: "POST",
      body: JSON.stringify(newEventsBody),
    });
    if (eventCreateRes.ok) {
      const res = await eventCreateRes.json();
      return res.body;
    }
    return [];
  };

  const onCreateSeasonClick = async () => {
    setIsLoading(true);
    const districtsRes = await fetch(`/api/tba/districts/fetch/${year}`, {
      method: "GET",
    });
    if (districtsRes.ok) {
      const res = await districtsRes.json();
      const districts = res.body;

      for (const district of districts) {
        if (district.abbreviation === "ont") {
          const seasonBody = {
            year: year,
            district: district.display_name,
            districtKey: district.key,
          };
          const seasonRes = await fetch("api/seasons/new", {
            method: "POST",
            body: JSON.stringify(seasonBody),
          });
          if (seasonRes.ok) {
            const _season = await seasonRes.json();
            const events = await createEventsForSeason(
              _season.body.districtKey,
              _season.body.id
            );
            if (events.length !== 0) {
              setCurrentSeason(_season.body);
              setEvents(events.body);
              displayToast("Season created successfully", "success");
            } else {
              displayToast(
                "Something happened with the database... Ask Julian to fix this shit",
                "error"
              );
            }
          } else {
            displayToast(
              "Something happened with the database... Ask Julian to fix this shit",
              "error"
            );
          }
          break;
        }
      }
    } else {
      displayToast(
        "Something happened with TBA... Ask Julian to fix this shit",
        "error"
      );
    }
    setIsLoading(false);
  };

  return (
    <Box minH="calc(100vh)">
      <Container minW="90%" mt="2rem" centerContent>
        {_currentSeason.length === 0 ? (
          <VStack>
            <Heading
              textAlign="center"
              fontSize={{ base: "2xl", sm: "2xl", md: "3xl" }}
            >
              Rishi wtf, the {moment().year()} season has not been created
              yet...
            </Heading>
            <Button
              colorScheme="blue"
              size="lg"
              isLoading={isLoading}
              onClick={onCreateSeasonClick}
            >
              Click to create season
            </Button>
            {isLoading && (
              <Text>This might take a while, so go eat some samosas...</Text>
            )}
          </VStack>
        ) : (
          <>
            <Heading
              justifySelf="center"
              fontSize={{ base: "2xl", sm: "2xl", md: "3xl" }}
              mb="1rem"
            >
              {_currentSeason[0].year} {_currentSeason[0].district} District
              Events
            </Heading>
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                lg: "repeat(2, 1fr)",
              }}
              mb="2rem"
              rowGap={4}
              columnGap={8}
            >
              {_events.map((event) => {
                return (
                  <GridItem key={event.name}>
                    <EventCard
                      name={event.name}
                      startDate={event.startDate}
                      endDate={event.endDate}
                      eventCode={event.eventCode}
                      isAdminCard
                    />
                  </GridItem>
                );
              })}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const { userId } = getAuth(context.req);
  const user = await clerkClient.users.getUser(userId);
  if (!user.privateMetadata.admin) {
    return {
      redirect: {
        destination: "/dashboard?status=error",
        permanent: true,
      },
    };
  }
  const year = moment().year();
  const currentSeason = await prisma.season.findMany({
    where: {
      year: year,
    },
  });

  var seasonId = -1;
  var events = [];
  if (currentSeason.length !== 0) {
    seasonId = currentSeason[0].id;
    events = await prisma.event.findMany({
      where: {
        season: {
          is: {
            id: seasonId,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });
  }
  return {
    props: {
      currentSeason: currentSeason,
      seasonId: seasonId,
      events: events,
      year: year,
    },
  };
}
