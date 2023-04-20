import { Box, Center, Container, Hide, Heading, Show, Text, VStack } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {

    const { isLoaded, isSignedIn, user } = useUser();

    return (
        <Box minH="calc(100vh)">
            <Center>
                <Container maxW="90%" position="fixed" mt="14rem" centerContent>
                    <Heading fontSize={{base: "xl", md: "3xl"}}>Submit these forms you lazy ass:</Heading>
                </Container>
            </Center>
        </Box>
        // <Center height="calc(100vh)">
        //     <VStack mt="30%">
        //         <Heading fontFamily="nunito">This is another heading</Heading>
        //         <Text>This is some more text</Text>
        //     </VStack>
        // </Center>
    );
}

export async function getServerSideProps(context) {

    return {
        props: {

        }
    }
}