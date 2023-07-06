import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import prisma from "@prisma/index";
import { useEffect, useState } from "react";
import { categoryOptions } from "src/categories";
import { Loading } from "@nextui-org/react";
import { FiArrowLeft } from "react-icons/fi";

export default function EventAdminPage(props) {
  const router = useRouter();
  const toast = useToast();

  const event = props.event[0];
  const [teams, setTeams] = useState([]);
  const [numTeams, setNumTeams] = useState(event.numberOfTeamPicks);
  const [numCategories, setNumCategories] = useState(
    event.numberOfCategoryPicks
  );
  const [areTeamsLoading, setAreTeamsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSetup, setIsSetup] = useState(event.isSetup);

  const getTeamsForEvent = async (eventCode) => {
    setAreTeamsLoading(true);
    const teamFetchRes = await fetch(`/api/event/${eventCode}`, {
      method: "POST",
    });
    const res = await teamFetchRes.json();
    var _teams = res.body;
    if (teams.length === 0) {
      var newTeamsArr = [];
      for (const team of _teams) {
        newTeamsArr.push({ name: team.nickname, number: team.team_number });
      }
      await setTeams(
        newTeamsArr.sort((a, b) => {
          return a.number > b.number ? 1 : -1;
        })
      );
    }
    setAreTeamsLoading(false);
  };

  useEffect(() => {
    getTeamsForEvent(event.eventCode);
  }, []);

  const handleCompleteSetup = async () => {
    setIsSubmitting(true);
    // Get all of the values in the category fields and build a JSON object of them
    const body = {
      numberOfTeamPicks: numTeams,
      numberOfCategoryPicks: numCategories,
    };
    const setupEventRes = await fetch(`/api/event/${event.eventCode}/setup`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (setupEventRes.ok) {
      const res = await setupEventRes.json();
      setIsSetup(res.body.isSetup);
      toast({
        title: "Event Setup Successful!",
        position: "top-right",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Box minH="calc(100vh)">
      <Flex justifyContent="center">
        <Container minW="90%">
          <Button
            variant="link"
            mt="0.5rem"
            leftIcon={<FiArrowLeft />}
            onClick={() => router.push("/admin")}
            color="black"
          >
            Back to Admin Panel
          </Button>
          <Heading
            my="1rem"
            fontSize={{ base: "2xl", sm: "2xl", md: "3xl" }}
            textAlign="center"
          >
            {event.name} Setup
          </Heading>
          <SimpleGrid
            minChildWidth={{ md: "40%" }}
            minWidth="inherit"
            spacingX="40px"
          >
            <VStack>
              <Heading fontSize="2xl">Team List</Heading>
              <HStack>
                {areTeamsLoading && <Loading size="xl" />}
                <VStack
                  minW="50%"
                  alignSelf="self-start"
                  alignItems="self-start"
                >
                  {!areTeamsLoading && (
                    <>
                      {teams
                        .slice(0, Math.ceil(teams.length / 2))
                        .map((item) => {
                          return (
                            <Text key={item.number} fontSize="lg">
                              {item.number} - {item.name}
                            </Text>
                          );
                        })}
                    </>
                  )}
                </VStack>
                <VStack
                  alignItems="self-start"
                  alignSelf="self-start"
                  minW="50%"
                >
                  {!areTeamsLoading && (
                    <>
                      {teams
                        .slice(Math.ceil(teams.length / 2))
                        .map((item, index) => {
                          return (
                            <Text key={item.number} fontSize="lg">
                              {item.number} - {item.name}
                            </Text>
                          );
                        })}
                    </>
                  )}
                </VStack>
              </HStack>
              <Button
                colorScheme="blue"
                onClick={() => getTeamsForEvent(event.eventCode)}
              >
                Refresh Team List
              </Button>
            </VStack>
            <VStack minW="60%" mb="2rem">
              <Heading fontSize="2xl">Categories</Heading>
              {categoryOptions.length !== 0 &&
                categoryOptions.map((item, index) => {
                  return (
                    <Text key={index} fontSize="lg" alignSelf="self-start">
                      {item}
                    </Text>
                  );
                })}
              <HStack w="full" verticalAlign="center">
                <Heading fontSize="xl" textAlign="center" minW="fit-content">
                  Number of teams:
                </Heading>
                <Spacer />
                <NumberInput
                  defaultValue={numTeams}
                  min={1}
                  width="50%"
                  onChange={(value) => setNumTeams(value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
              <HStack w="full" verticalAlign="center">
                <Heading fontSize="xl" textAlign="center" minW="fit-content">
                  Number of categories:
                </Heading>
                <Spacer />
                <NumberInput
                  defaultValue={numCategories}
                  min={1}
                  width="50%"
                  onChange={(value) => setNumCategories(value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
              <Button
                colorScheme="green"
                onClick={handleCompleteSetup}
                isLoading={isSubmitting}
                mt="0.5rem"
              >
                {!isSetup ? "Complete Event Setup" : "Submit Event Edits"}
              </Button>
            </VStack>
          </SimpleGrid>
        </Container>
      </Flex>
    </Box>
  );
}

export async function getServerSideProps(context) {
  // Get and return the event from the DB
  const { eventId } = context.query;
  const event = await prisma.event.findMany({
    where: {
      eventCode: eventId,
    },
  });
  return {
    props: {
      event: event,
    },
  };
}
