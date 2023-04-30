import { Card, CardBody, Heading, Text, VStack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import moment from "moment";

export default function EventCard(props) {
    const { name, startDate, endDate, isSubmissionClosed } = props

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
            py={{base: "0.5rem", sm: "1rem"}}
            onClick={onCardClick}
            cursor={!isSubmissionClosed ? "pointer" : "normal"} 
            minW={{base: "100%", sm: "lg"}}
        >
            <CardBody align="center">
                <VStack spacing={4}>
                    <Heading fontSize={{base: "xl"}} textAlign="center">{name}</Heading>
                    <Text as="b">Event Dates: <span style={{fontWeight: "normal"}}>{moment(startDate).format("MMMM Do")} to {moment(endDate).format("MMMM Do")}</span></Text>
                    <Text as="b">Submissions Due: <span style={{fontWeight: "normal"}}>{moment(startDate).subtract(1, "day").endOf("day").format("MMMM Do, h:mm:ss a")}</span></Text>
                    { isSubmissionClosed && 
                        <Text>Click the card to see your shitty picks</Text>
                    }
                </VStack>
            </CardBody>
        </Card>        
    )
}