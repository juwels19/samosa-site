import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Select,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import prisma from "@prisma/index";
import { useState } from "react";
import { categoryOptions } from "src/categories";
import { FiTrash } from "react-icons/fi";

export default function EventPage(props) {
  const router = useRouter();
  const event = props.event[0];
  const { isAdminCard } = router.query;
  const [teams, setTeams] = useState(
    event.teams.sort((a, b) => {
      return a.number > b.number ? 1 : -1;
    })
  );
  const [categories, setCategories] = useState(event.categories);
  const [categoryLength, setCategoryLength] = useState(categories.length);
  const [areTeamsLoading, setAreTeamsLoading] = useState(false);

  const getTeamsForEvent = async (eventCode) => {
    setAreTeamsLoading(true);
    if (teams.length === 0) {
      var _teams;
      const teamFetchRes = await fetch(`/api/tba/event/${eventCode}/teams`, {
        method: "GET",
      });
      const res = await teamFetchRes.json();
      _teams = res.body;
      setTeams(
        _teams.sort((a, b) => {
          return a.number > b.number ? 1 : -1;
        })
      );
    }
    setAreTeamsLoading(false);
  };

  const addCategoryOnClick = (newCategory) => {
    setCategories((oldCategories) => {
      return [...oldCategories, newCategory];
    });
    setCategoryLength((oldCategoryLength) => {
      return oldCategoryLength + 1;
    });
  };

  const handleCategoryChange = (event) => {
    event.preventDefault();
    const index = event.target.id;
    setCategories((oldCategories) => {
      var newCategories = oldCategories.slice();
      newCategories[index].value = event.target.value;
      return newCategories;
    });
  };

  const handleDeleteCategory = (categoryIndex) => {
    const newCategories = categories.slice();
    newCategories.splice(categoryIndex, 1);
    setCategories(newCategories);
  };

  const handleCompleteSetup = () => {};

  console.log(categories);

  return (
    <Box minH="calc(100vh)">
      <Flex justifyContent="center">
        <Container minW="90%" mt="2rem" centerContent>
          {isAdminCard ? (
            <>
              <Heading
                mb="1rem"
                mt={props.isAdmin ? "1rem" : ""}
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
                  {teams.length === 0 ? (
                    <Button
                      colorScheme="blue"
                      isLoading={areTeamsLoading}
                      onClick={() => getTeamsForEvent(event.eventCode)}
                    >
                      Generate Team List
                    </Button>
                  ) : (
                    <Heading fontSize="2xl">Team List</Heading>
                  )}
                  <Grid
                    templateColumns="repeat(2, 1fr)"
                    mb="2rem"
                    rowGap={4}
                    columnGap={8}
                    alignItems="center"
                    textAlign="center"
                  >
                    {teams &&
                      teams.map((item) => {
                        return (
                          <GridItem key={item.number}>
                            {item.number} - {item.name}
                          </GridItem>
                        );
                      })}
                  </Grid>
                </VStack>
                <VStack minW="60%" mb="2rem">
                  <Heading fontSize="2xl">Categories</Heading>
                  {categories.length === 0 ? (
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() =>
                        addCategoryOnClick({
                          id: categoryLength + 1,
                          value: "",
                        })
                      }
                    >
                      Add First Category
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() =>
                        addCategoryOnClick({
                          id: categoryLength + 1,
                          value: "",
                        })
                      }
                    >
                      Add Another Category
                    </Button>
                  )}

                  {categories.length !== 0 &&
                    categories.map((item, index) => {
                      return (
                        <HStack gap={4}>
                          <Select
                            placeholder="Select Category..."
                            textOverflow="ellipsis"
                            maxW="inherit"
                            value={item.value}
                            id={index}
                            onChange={handleCategoryChange}
                            key={"category " + index}
                          >
                            {categoryOptions.map((item) => {
                              return <option key={item}>{item}</option>;
                            })}
                          </Select>
                          <IconButton
                            colorScheme="red"
                            size="sm"
                            aria-label="delete category"
                            icon={<FiTrash />}
                            onClick={() => handleDeleteCategory(index)}
                          />
                        </HStack>
                      );
                    })}
                  {categories.length !== 0 && (
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={handleCompleteSetup}
                    >
                      Complete Event Setup
                    </Button>
                  )}
                </VStack>
              </SimpleGrid>
            </>
          ) : (
            <>
              <Heading
                mb="1rem"
                mt={props.isAdmin ? "1rem" : ""}
                fontSize={{ base: "2xl", sm: "2xl", md: "3xl" }}
                textAlign="center"
              >
                Submit your picks for {event.name}
              </Heading>
            </>
          )}
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
    include: {
      teams: true,
    },
  });
  return {
    props: {
      event: event,
    },
  };
}
