import { Card, CardBody, Heading, Text, VStack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function EventCard(props) {
    const { eventName, eventDates, submissionDateTime, isSubmissionClosed } = props

    const router = useRouter();
    const toast = useToast();

    const onCardClick = (eventCode) => {
        // Logic in here to push the user to the form they clicked
        // router.push()
        toast({
            title: "You clicked the card",
            status: "success",
            duration: 5000,
            position: "top-right"
        })
    }

    return (
        <Card 
            align="center" 
            boxShadow="md" 
            borderRadius="15px" 
            bg={!isSubmissionClosed ? "whiteAlpha.200" : "gray.50"} 
            size={{base: "sm", sm: "lg"}} 
            mx={{base: "0", sm: "1rem"}}
            onClick={onCardClick}
            cursor={!isSubmissionClosed ? "pointer" : "normal"} 
            minW={{base: "100%", sm: "lg"}}
        >
            <CardBody align="center">
                <VStack spacing={4}>
                    <Heading fontSize={{base: "xl"}} textAlign="center">{eventName}</Heading>
                    <Text as="b">Event Dates: <span style={{fontWeight: "normal"}}>{eventDates}</span></Text>
                    <Text as="b">Submissions Due: <span style={{fontWeight: "normal"}}>{submissionDateTime}</span></Text>
                    { isSubmissionClosed && 
                        <Text>Click  the card to see your shitty picks</Text>
                    }
                </VStack>
            </CardBody>
        </Card>        
    )
}