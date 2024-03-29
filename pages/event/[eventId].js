import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Text,
  IconButton,
  SimpleGrid,
  VStack,
  useToast,
  Spacer,
  ButtonGroup,
  Textarea,
} from "@chakra-ui/react";
import { Loading } from "@nextui-org/react";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/router";
import prisma from "@prisma/index";
import { useState, useEffect } from "react";
import { categoryOptions } from "src/categories";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

export default function EventPage(props) {
  const router = useRouter();
  const toast = useToast();

  const { event, userId, userFullname, pick } = props;

  const [teams, setTeams] = useState([]);
  const numTeams = event.numberOfTeamPicks;
  const numCategories = event.numberOfCategoryPicks;
  const [numTeamsSelected, setNumTeamsSelected] = useState(parseInt(0));
  const [numCategoriesSelected, setNumCategoriesSelected] = useState(
    parseInt(0)
  );
  const [teamsSelected, setTeamsSelected] = useState([]);
  const [categoriesSelected, setCategoriesSelected] = useState([]);

  const [displayName, setDisplayName] = useState("");
  const [isDisplayNameInvalid, setIsDisplayNameInvalid] = useState(false);

  const [areTeamsLoading, setAreTeamsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const getTeamsForEvent = async (eventCode) => {
    setAreTeamsLoading(true);
    const teamFetchRes = await fetch(`/api/event/${eventCode}`, {
      method: "POST",
    });
    const res = await teamFetchRes.json();
    var _teams = res.body;
    if (teams.length === 0) {
      var newTeamsArr = [];
      for (let i = 0; i < _teams.length; i++) {
        newTeamsArr.push({
          name: _teams[i].nickname,
          number: _teams[i].team_number,
        });
      }
      setTeams(
        newTeamsArr.sort((a, b) => {
          return a.number > b.number ? 1 : -1;
        })
      );
    }
    setAreTeamsLoading(false);
  };

  console.log(teamsSelected);

  const populatePick = () => {
    if (pick) {
      setIsEditing(true);
      const answers = JSON.parse(pick.answersJSON);
      const _teams = answers.teams;
      const _categories = answers.categories;
      setDisplayName(pick.displayName);
      let _teamsIdx = 0;
      let newTeamsSelected = [];
      for (let i = 0; i < teams.length; i++) {
        if (teams[i].number === _teams[_teamsIdx]) {
          newTeamsSelected.push(true);
          _teamsIdx += 1;
        }
        newTeamsSelected.push(false);
      }
      setTeamsSelected(newTeamsSelected);
      for (let i = 0; i < _categories.length; i++) {
        categoriesSelected[categoryOptions.indexOf(_categories[i])] = true;
      }
      setNumTeamsSelected(_teams.length);
      setNumCategoriesSelected(_categories.length);
    }
  };

  useEffect(() => {
    getTeamsForEvent(event.eventCode);
    populatePick();
  }, []);

  console.log(numTeamsSelected);
  console.log(numCategoriesSelected);

  const handleTeamClick = (index) => {
    if (teamsSelected[index] === true) {
      // This means the user is deselecting the team, so decrement the count of selected teams
      setNumTeamsSelected(numTeamsSelected - 1);
    } else {
      // This means the user is selecting the team, so increment the count of selected teams
      if (numTeamsSelected === numTeams) {
        // This if block catches the case where the user is trying to add a team even though they're at the cap
        toast({
          title: "Too Many Teams",
          description: "You're at the max allowable amount of teams",
          status: "error",
          isClosable: true,
          position: "top-right",
        });
        return;
      }
      setNumTeamsSelected(numTeamsSelected + 1);
    }
    setTeamsSelected((oldTeamsSelected) => {
      var newTeams = oldTeamsSelected.slice();
      newTeams[index] = !newTeams[index];
      return newTeams;
    });
  };

  const handleClearAllTeamPicks = async () => {
    setNumTeamsSelected(0);
    for (let i = 0; i < teamsSelected.length; i++) {
      teamsSelected[i] = false;
    }
  };

  const handleCategoryClick = (index) => {
    if (categoriesSelected[index] === true) {
      // This means the user is deselecting the category, so decrement the count of selected categories
      setNumCategoriesSelected(numCategoriesSelected - 1);
    } else {
      // This means the user is selecting the category, so increment the count of selected categories
      if (numCategoriesSelected === numCategories) {
        // This if block catches the case where the user is trying to add a category even though they're at the cap
        toast({
          title: "Too Many Categories",
          description: "You're at the max allowable amount of categories",
          status: "error",
          isClosable: true,
          position: "top-right",
        });
        return;
      }
      setNumCategoriesSelected(numCategoriesSelected + 1);
    }
    setCategoriesSelected((oldCategories) => {
      var newCategories = oldCategories.slice();
      newCategories[index] = !newCategories[index];
      return newCategories;
    });
  };

  const handleClearAllCategoryPicks = async () => {
    setNumCategoriesSelected(0);
    for (let i = 0; i < categoriesSelected.length; i++) {
      categoriesSelected[i] = false;
    }
  };

  const handlDisplayNameChange = async (event) => {
    if (displayName.length < 100) {
      setIsDisplayNameInvalid(false);
    } else {
      setIsDisplayNameInvalid(true);
    }
    setDisplayName(event.target.value);
  };

  const handleSubmitPicks = async () => {
    setIsSubmitting(true);
    // First check the user selected the correct number of fields and display name
    const teamDiff = numTeams - numTeamsSelected;
    const categoryDiff = numCategories - numCategoriesSelected;
    let errorMessage = "Please select ";
    if (teamDiff !== 0 && categoryDiff !== 0) {
      errorMessage += `${teamDiff} more team(s) and ${categoryDiff} more category(ies)`;
    } else if (teamDiff !== 0) {
      errorMessage += `${teamDiff} more team(s)`;
    } else if (categoryDiff !== 0) {
      errorMessage += `${categoryDiff} more category(ies)`;
    }
    if (teamDiff || categoryDiff) {
      toast({
        title: "Incomplete Pick Submission",
        description: errorMessage,
        status: "error",
        isClosable: true,
        position: "top-right",
      });
      setIsSubmitting(false);
      return;
    }
    if (displayName.length >= 100) {
      toast({
        title: "Invalid Display Name",
        description: "The display name must be 100 characters or less",
        status: "error",
        isClosable: true,
        position: "top-right",
      });
      setIsSubmitting(false);
      return;
    }
    // Get all of the values in the category fields and build a JSON object of them
    var _teams = [];
    var _categories = [];

    for (let i = 0; i < teams.length; i++) {
      if (teamsSelected[i]) {
        _teams.push(teams[i].number);
      }
    }
    for (let i = 0; i < categoryOptions.length; i++) {
      if (categoriesSelected[i]) {
        _categories.push(categoryOptions[i]);
      }
    }

    const body = {
      displayName: displayName,
      userId: userId,
      userFullname: userFullname,
      teams: _teams,
      categories: _categories,
    };
    const createPickRes = await fetch(
      `/api/event/${event.eventCode}/create-pick`,
      { method: "POST", body: JSON.stringify(body) }
    );
    toast({
      title: isEditing
        ? "Pick Edited Successfully"
        : "Pick Submitted Successfully",
      status: "success",
      isClosable: true,
      position: "top-right",
    });
    setIsEditing(true);
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
            onClick={() => router.push("/dashboard")}
            color="black"
          >
            Back to Dashboard
          </Button>
          <Heading
            my="1rem"
            fontSize={{ base: "2xl", sm: "2xl", md: "3xl" }}
            textAlign="center"
          >
            Submit your picks for {event.name}
          </Heading>
          <SimpleGrid
            minChildWidth={{ md: "40%" }}
            minWidth="inherit"
            spacingX="40px"
            maxW="full"
          >
            <VStack mb="2rem" maxW={{ base: "85%", md: "full" }}>
              <Heading fontSize="xl" alignSelf="self-start">
                {event.isComplete || !event.isSubmissionClosed
                  ? `Choose ${numTeams} teams`
                  : "Team List:"}
              </Heading>
              {(event.isComplete || !event.isSubmissionClosed) && (
                <Text mt="-1.5rem" alignSelf="self-start">
                  (Click on a team to select/deselect it)
                </Text>
              )}
              {areTeamsLoading && (
                <Loading size="xl" css={{ justifySelf: "center" }} />
              )}
              <HStack alignSelf="self-start" width="100%">
                <VStack
                  width="50%"
                  alignItems="self-start"
                  alignSelf="self-start"
                >
                  {!areTeamsLoading && (
                    <>
                      {teams
                        .slice(0, Math.ceil(teams.length / 2))
                        .map((item, index) => {
                          return (
                            <Button
                              size={{ base: "sm", md: "md" }}
                              key={item.number}
                              variant={teamsSelected[index] ? "solid" : "ghost"}
                              colorScheme="whatsapp"
                              isDisabled={
                                event.isComplete || event.isSubmissionClosed
                                  ? true
                                  : false
                              }
                              textColor={
                                teamsSelected[index] ? "white" : "black"
                              }
                              onClick={() => handleTeamClick(index)}
                              maxW="100%"
                              whiteSpace="initial"
                              height="fit-content"
                            >
                              {item.number} - {item.name}
                            </Button>
                          );
                        })}
                    </>
                  )}
                </VStack>
                <VStack
                  width="50%"
                  alignItems="self-start"
                  alignSelf="self-start"
                >
                  {!areTeamsLoading && (
                    <>
                      {teams
                        .slice(Math.ceil(teams.length / 2))
                        .map((item, index) => {
                          return (
                            <Button
                              key={item.number}
                              size={{ base: "sm", md: "md" }}
                              isDisabled={
                                event.isComplete || event.isSubmissionClosed
                                  ? true
                                  : false
                              }
                              variant={
                                teamsSelected[
                                  index + Math.ceil(teams.length / 2)
                                ]
                                  ? "solid"
                                  : "ghost"
                              }
                              colorScheme="whatsapp"
                              textColor={
                                teamsSelected[
                                  index + Math.ceil(teams.length / 2)
                                ]
                                  ? "white"
                                  : "black"
                              }
                              onClick={() =>
                                handleTeamClick(
                                  index + Math.ceil(teams.length / 2)
                                )
                              }
                              maxW="100%"
                              whiteSpace="initial"
                            >
                              {item.number} - {item.name}
                            </Button>
                          );
                        })}
                    </>
                  )}
                </VStack>
              </HStack>
              {(event.isComplete || !event.isSubmissionClosed) && (
                <Button
                  colorScheme="red"
                  onClick={handleClearAllTeamPicks}
                  mt="1rem"
                >
                  Clear all selected teams
                </Button>
              )}
            </VStack>
            <VStack mb="2rem">
              <Heading fontSize="xl" alignSelf="self-start">
                {event.isComplete || !event.isSubmissionClosed
                  ? `Choose ${numCategories} categories:`
                  : "Categories:"}
              </Heading>
              {(event.isComplete || !event.isSubmissionClosed) && (
                <Text mt="-1.5rem" alignSelf="self-start">
                  (Click on a category to select/deselect it)
                </Text>
              )}
              {categoryOptions.map((item, index) => {
                return (
                  <Button
                    key={item}
                    size={{ base: "sm", md: "md" }}
                    variant={categoriesSelected[index] ? "solid" : "ghost"}
                    colorScheme="whatsapp"
                    textColor={categoriesSelected[index] ? "white" : "black"}
                    isDisabled={
                      event.isComplete || event.isSubmissionClosed
                        ? true
                        : false
                    }
                    onClick={() => handleCategoryClick(index)}
                    alignSelf="self-start"
                  >
                    {item}
                  </Button>
                );
              })}
              {!event.isSubmissionClosed && (
                <Button
                  colorScheme="red"
                  onClick={handleClearAllCategoryPicks}
                  mt="1rem"
                  size={{ base: "sm", md: "md" }}
                >
                  Clear all selected categories
                </Button>
              )}
              <Heading fontSize="lg" alignSelf="self-start" mt="1rem">
                Optional - Enter a display name for your picks:
              </Heading>
              <Textarea
                onChange={(e) => handlDisplayNameChange(e)}
                alignSelf="self-start"
                value={displayName}
                isInvalid={isDisplayNameInvalid}
                resize="none"
              />
              <Text alignSelf="self-start" fontSize="sm" mt="-0.5rem">
                Total characters: {displayName.length}
              </Text>
              <Button
                colorScheme="blue"
                isLoading={isSubmitting}
                onClick={handleSubmitPicks}
                mt="1rem"
              >
                {!isEditing ? "Submit Picks" : "Edit Picks"}
              </Button>
            </VStack>
          </SimpleGrid>
        </Container>
      </Flex>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const { userId } = getAuth(context.req);
  const user = await clerkClient.users.getUser(userId);
  // Get and return the event from the DB
  const { eventId } = context.query;
  const event = await prisma.event.findUnique({
    where: {
      eventCode: eventId,
    },
  });
  // Determine if the user has already picked for this event
  const pick = await prisma.pick.findUnique({
    where: {
      userId_eventId: {
        userId: userId,
        eventId: parseInt(event.id),
      },
    },
  });
  return {
    props: {
      event: event,
      userId: userId,
      userFullname: user.firstName + " " + user.lastName,
      pick: pick,
    },
  };
}
