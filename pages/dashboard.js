import SamosaStatsUserButton from "@/src/components/SamosaStatsUserButton";
import { Center, Heading, Text, VStack } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {

    const { isLoaded, isSignedIn, user } = useUser();

    return (
        <Center height="calc(100vh)">
            <VStack>
                <Heading>This is the dashboard page.</Heading>
            </VStack>
        </Center>
    );
}

export async function getServerSideProps(context) {
    
    return {
        props: {

        }
    }
}