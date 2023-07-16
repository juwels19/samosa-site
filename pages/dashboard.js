import EventCard from "@components/EventCard";
import {
  Box,
  Center,
  Container,
  Hide,
  Heading,
  Show,
  Text,
  VStack,
  Flex,
  useToast,
  HStack,
  Grid,
  GridItem,
  Button,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import prisma from "@prisma/index";
import moment from "moment";

export default function Dashboard(props) {
  const toast = useToast();
  const toastId = "toast";
  const router = useRouter();
  const { status } = router.query;
  const setupEvents = props.setupEvents;
  const completeEvents = props.completeEvents;

  useEffect(() => {
    if (status) {
      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          title: "You are unable to view that page",
          status: "error",
          duration: 5000,
          position: "top-right",
        });
      }
    }
  }, []);

  return (
    <Box minH="calc(100vh)">
      <Flex justifyContent="center">
        <Container minW="90%" my="1rem">
          {props.isAdmin && (
            <Flex justifyContent="end">
              <Button
                colorScheme="blue"
                rightIcon={<FiArrowRight />}
                onClick={() => router.push("/admin")}
              >
                Go to Admin Panel
              </Button>
            </Flex>
          )}
          <Heading
            mb="1rem"
            mt={props.isAdmin ? "1rem" : ""}
            fontSize={{ base: "2xl", sm: "2xl", md: "3xl" }}
            textAlign="center"
          >
            Submit these forms you lazy ass:
          </Heading>
          <Flex
            flexDirection={{ base: "column", sm: "row" }}
            mb="2rem"
            gap={4}
            justify="center"
          >
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                lg: "repeat(2, 1fr)",
              }}
              mb="2rem"
              rowGap={4}
              columnGap={8}
            >
              {setupEvents.map((event) => {
                return (
                  <GridItem key={event.name}>
                    <EventCard
                      name={event.name}
                      startDate={event.startDate}
                      endDate={event.endDate}
                      eventCode={event.eventCode}
                      isComplete={false}
                      isSubmissionClosed={event.isSubmissionClosed}
                    />
                  </GridItem>
                );
              })}
            </Grid>
          </Flex>
          <Heading
            mb="1rem"
            fontSize={{ base: "2xl", sm: "2xl", md: "3xl" }}
            textAlign="center"
          >
            Wow, you did something useful:
          </Heading>
          <Flex
            flexDirection={{ base: "column", sm: "row" }}
            mb="2rem"
            gap={4}
            justify="center"
          >
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                lg: "repeat(2, 1fr)",
              }}
              mb="2rem"
              rowGap={4}
              columnGap={8}
            >
              {completeEvents.map((event) => {
                return (
                  <GridItem key={event.name}>
                    <EventCard
                      name={event.name}
                      startDate={event.startDate}
                      endDate={event.endDate}
                      eventCode={event.eventCode}
                      isComplete={true}
                      isSubmissionClosed={event.isSubmissionClosed}
                    />
                  </GridItem>
                );
              })}
            </Grid>
          </Flex>
        </Container>
      </Flex>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const { userId } = getAuth(context.req);
  const user = await clerkClient.users.getUser(userId);
  const season = await prisma.season.findMany({
    where: { year: parseInt(moment().year()) },
  });
  const setupEvents = await prisma.event.findMany({
    where: {
      season: season.id,
      isSetup: true,
      isComplete: false,
    },
    orderBy: {
      startDate: "asc",
    },
  });
  const completeEvents = await prisma.event.findMany({
    where: {
      season: season.id,
      isComplete: true,
    },
  });
  return {
    props: {
      isAdmin: user.privateMetadata.admin ? true : false,
      setupEvents: setupEvents,
      completeEvents: completeEvents,
    },
  };
}
