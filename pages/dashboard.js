import EventCard from "@components/EventCard";
import { Box, Center, Container, Hide, Heading, Show, Text, VStack, Flex } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {

    const { isLoaded, isSignedIn, user } = useUser();

    return (
        <Box minH="calc(100vh)">
            <Flex justifyContent="center">
                <Container minW="90%" mt={{base: "4rem", md: "6rem"}} centerContent>
                    <Heading mb="1rem" fontSize={{base: "2xl", sm: "2xl", md: "3xl"}} textAlign="center">Submit these forms you lazy ass:</Heading>
                    <Flex flexDirection={{base: "column", sm: "row"}} mb="2rem" gap={4}>
                        <EventCard 
                            eventName="ONT Humber College District Event 2023"
                            eventDates="March 17 to March 19"
                            submissionDateTime="March 16 @ 11:59pm"
                            isSubmissionClosed={false}
                        />
                        <EventCard 
                            eventName="ONT Western University District Event 2023"
                            eventDates="March 17 to March 19"
                            submissionDateTime="March 16 @ 11:59pm"
                            isSubmissionClosed={false}
                        />
                    </Flex>
                    <Heading mb="1rem" fontSize={{base: "2xl", sm: "2xl", md: "3xl"}}>Wow, you did something useful:</Heading>
                    <Flex flexDirection={{base: "column", sm: "row"}} mb="2rem" gap={4}>
                        <EventCard 
                            eventName="ONT Georgian Event 2023"
                            eventDates="March 3 to March 5"
                            submissionDateTime="March 2 @ 11:59pm"
                            isSubmissionClosed={true}
                        />
                        <EventCard 
                            eventName="ONT Newmarket Complex Event 2023"
                            eventDates="March 3 to March 5"
                            submissionDateTime="March 2 @ 11:59pm"
                            isSubmissionClosed={true}
                        />
                    </Flex>
                </Container>
            </Flex>
        </Box>
    );
}

export async function getServerSideProps(context) {

    return {
        props: {

        }
    }
}