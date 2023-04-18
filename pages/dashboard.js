import SamosaStatsUserButton from "@/src/components/SamosaStatsUserButton";
import { Center, Heading, VStack } from "@chakra-ui/react";


export default function Dashboard() {

    return (
        <Center height="calc(100vh)">
            <VStack>
                <Heading>This is the dashboard page.</Heading>
                <SamosaStatsUserButton />
            </VStack>
        </Center>
    );
}