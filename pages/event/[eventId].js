import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import prisma from "@prisma/index";
import { useEffect } from "react";

export default function EventPage(props) {
    const router = useRouter();
    const event = props.event[0];
    const { isAdminCard } = router.query
    console.log(isAdminCard)

    
    const getTeamsForEvent = async (eventCode) => {
        const teamFetchRes = await fetch(`/api/tba/event/${eventCode}/teams`, {method: "GET"})
        const res = await teamFetchRes.json()
        const teams = res.body
        
        console.log(teams)
    }

    useEffect(() => {
        getTeamsForEvent(event.eventCode)
    }, [])

    return (
        <Box minH="calc(100vh)">
            <Flex justifyContent="center">
                <Container minW="90%" mt={{base: "5rem", md: "8rem"}} centerContent>
                    {isAdminCard ?  
                        (
                            <>
                                <Heading mb="1rem" mt={props.isAdmin ? "1rem" : ""} fontSize={{base: "2xl", sm: "2xl", md: "3xl"}} textAlign="center">Editing {event.name}</Heading>
                            </>
                        )
                        :
                        (
                            <>
                                <Heading mb="1rem" mt={props.isAdmin ? "1rem" : ""} fontSize={{base: "2xl", sm: "2xl", md: "3xl"}} textAlign="center">Submit your picks for {event.name}</Heading>
                            </>
                        )
                    }
                </Container>
            </Flex>
        </Box>
    );
}

export async function getServerSideProps(context) {
    // Get and return the event from the DB
    const { eventId } = context.query
    const event = await prisma.event.findMany({
        where: {
            eventCode: eventId
        }
    })
    return {
        props: {
            event: event
        }
    }
}