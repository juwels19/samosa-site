import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import prisma from "@prisma/index";
import { useState } from "react";
import { categoryOptions } from "src/categories";
import { FiChevronRight, FiTrash } from "react-icons/fi";

export default function EventAdminPage(props) {
  const router = useRouter();
  const toast = useToast();

  const event = props.event[0];
  const [teams, setTeams] = useState(
    event.teams.sort((a, b) => {
      return a.number > b.number ? 1 : -1;
    })
  );
  const [categories, setCategories] = useState(
    event.categories.map((item) => JSON.parse(item))
  );
  const [categoryLength, setCategoryLength] = useState(categories.length);
  const [areTeamsLoading, setAreTeamsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSetup, setIsSetup] = useState(event.isSetup);
  const getTeamsForEvent = async (eventCode) => {
    setAreTeamsLoading(true);
    if (teams.length === 0) {
      const teamFetchRes = await fetch(`/api/tba/event/${eventCode}/teams`, {
        method: "GET",
      });
      const res = await teamFetchRes.json();
      var _teams = res.body;
      var newTeamsArr = [];
      for (const team of _teams) {
        newTeamsArr.push({ name: team.nickname, number: team.team_number });
      }
      setTeams(
        newTeamsArr.sort((a, b) => {
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

  const handleTeamAmountChange = (index, newTeamAmount) => {
    setCategories((oldCategories) => {
      var newCategories = oldCategories.slice();
      newCategories[index].numTeams = newTeamAmount;
      return newCategories;
    });
  };

  const handleDeleteCategory = (categoryIndex) => {
    const newCategories = categories.slice();
    newCategories.splice(categoryIndex, 1);
    setCategories(newCategories);
  };

  const handleCompleteSetup = async () => {
    setIsSubmitting(true);
    // Get all of the values in the category fields and build a JSON object of them
    const setupEventRes = await fetch(`/api/event/${event.eventCode}/setup`, {
      method: "POST",
      body: JSON.stringify(categories),
    });
    if (setupEventRes.ok) {
      const res = await setupEventRes.json();
      console.log(res.body.isSetup);
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

  console.log(categories);

  return (
    <Box minH="calc(100vh)">
      <Flex justifyContent="center">
        <Container minW="90%">
          <Breadcrumb separator={<FiChevronRight />} justifyContent="left">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin Panel</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
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
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() =>
                  addCategoryOnClick({
                    id: categoryLength + 1,
                    value: "",
                    numTeams: "1",
                  })
                }
                mb="0.5rem"
              >
                {categories.length === 0
                  ? "Add First Category"
                  : "Add Another Category"}
              </Button>
              {categories.length !== 0 && (
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Category</Th>
                        <Th># of Teams</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {categories.map((item, index) => {
                        return (
                          <Tr>
                            <Td paddingStart={0}>
                              <Select
                                placeholder="Select Category..."
                                textOverflow="ellipsis"
                                value={item.value}
                                id={index}
                                width="100%"
                                onChange={handleCategoryChange}
                                key={"category " + index}
                              >
                                {categoryOptions.map((item) => {
                                  return <option key={item}>{item}</option>;
                                })}
                              </Select>
                            </Td>
                            <Td paddingStart={0} paddingEnd={0} width="10%">
                              <Center>
                                <NumberInput
                                  id={index}
                                  defaultValue={1}
                                  min={1}
                                  maxWidth="60%"
                                  onChange={(value) =>
                                    handleTeamAmountChange(index, value)
                                  }
                                  value={item.numTeams}
                                >
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                              </Center>
                            </Td>
                            <Td paddingEnd={0}>
                              <IconButton
                                colorScheme="red"
                                size="sm"
                                icon={<FiTrash />}
                                id={index}
                                onClick={() => handleDeleteCategory(index)}
                              />
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
              {categories.length !== 0 && (
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={handleCompleteSetup}
                  isLoading={isSubmitting}
                  mt="0.5rem"
                >
                  {!isSetup ? "Complete Event Setup" : "Submit Event Edits"}
                </Button>
              )}
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
