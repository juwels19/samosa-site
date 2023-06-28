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
  SimpleGrid,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useRouter } from "next/router";
import prisma from "@prisma/index";
import { useState } from "react";
import { categoryOptions } from "src/categories";

export default function EventPage(props) {
  const router = useRouter();
  const toast = useToast();

  const event = props.event[0];
  const teams = event.teams.sort((a, b) => {
    return a.number > b.number ? 1 : -1;
  });
  const teamsAsOptions = teams.map((item) => {
    return {
      value: item.number,
      label: `${item.number} - ${item.name}`,
    };
  });
  const categories = event.categories.map((item) => JSON.parse(item));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picks, setPicks] = useState(
    categories.map((item) => {
      const _category = item.value;
      var returnObj = {
        category: _category,
        numChoices: parseInt(item.numTeams),
        choices: [],
      };
      return returnObj;
    })
  );

  console.log(picks);

  const handleCategoryChange = (index, event) => {
    setPicks((oldPicks) => {
      var newPicks = oldPicks.slice();
      if (Array.isArray(event)) {
        newPicks[index].choices = event;
      } else {
        newPicks[index].choices = [event];
      }
      return newPicks;
    });
  };

  const handleSubmitPicks = async () => {
    setIsSubmitting(true);
    // Get all of the values in the category fields and build a JSON object of them
    setIsSubmitting(false);
  };

  return (
    <Box minH="calc(100vh)">
      <Flex justifyContent="center">
        <Container minW="90%">
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
          >
            <VStack>
              <Heading fontSize="2xl">Team List</Heading>
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
              <VStack alignItems="left" minW="full">
                {categories.map((item, index) => {
                  return (
                    <Box mb="0.5rem">
                      <Heading fontSize="xl">
                        {item.value} - ({picks[index].numChoices}{" "}
                        {picks[index].numChoices > 1 ? "teams" : "team"})
                      </Heading>
                      <Select
                        maxW="inherit"
                        placeholder="Choose team(s)..."
                        id={index}
                        key={"category " + index}
                        selectedOptionStyle="check"
                        isMulti={parseInt(item.numTeams) > 1}
                        options={teamsAsOptions}
                        onChange={(event) => handleCategoryChange(index, event)}
                        isOptionDisabled={() =>
                          picks[index].choices.length >= picks[index].numChoices
                        }
                      >
                        {categoryOptions.map((item) => {
                          return <option key={item}>{item}</option>;
                        })}
                      </Select>
                    </Box>
                  );
                })}
              </VStack>
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
