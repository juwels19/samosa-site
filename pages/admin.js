import { Box, Button, Container, Flex, Text, Heading } from "@chakra-ui/react";
import prisma from "@prisma/index";
import moment from "moment";

export default function Admin(props) {

    const { currentSeason } = props;
    console.log(currentSeason.length === 0)
    return (
        <Box minH="calc(100vh)">
            <Flex justifyContent="center">
                <Container minW="90%" mt={{base: "5rem", md: "8rem"}} centerContent>
                    <Flex flexDirection={{base: "column", sm: "row"}} my="1rem" gap={4} alignItems="center">
                        { currentSeason.length === 0 && 
                        <>
                            <Heading textAlign="center" fontSize={{base: "2xl", sm: "2xl", md: "3xl"}}>Rishi wtf, the {moment().year()} season has not been created yet...</Heading>
                            <Button
                                colorScheme="orange"
                                size="lg"
                            >
                                Create Season
                            </Button>
                        </>
                        }
                    </Flex>
                </Container>
            </Flex>
        </Box>
    )
}

export async function getServerSideProps(context) {
    const currentSeason = await prisma.season.findMany({
        where: {
            year: moment().year()
    }})
    return {
        props: {
            currentSeason: currentSeason
        }
    }
}