import { Box, Button, Container, Flex, HStack, Heading, Text } from "@chakra-ui/react";
import SamosaStatsUserButton from "./SamosaStatsUserButton";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function Navbar(props) {

    const { user } = useUser();
    const router = useRouter();
    const menuItems = [
        {
            label: "Leaderboard",
            route: "/leaderboard"
        }
    ]

    return (
        <Box as="section" pb={{ base: '12', md: '24' }} position="fixed" minW="100%">
            <Box as="nav" bg="orange" boxShadow="md">
                <Flex justifyContent="space-between" px="5%" py="5"> 
                    <HStack spacing={4}>
                        <Heading fontSize="lg" onClick={() => router.push("/dashboard")} cursor="pointer">LOGO HERE</Heading>
                        {menuItems.map((item) => {
                            return (
                                <Button variant="ghost" onClick={() => router.push(item.route)}>{item.label}</Button>
                            )
                        })}
                    </HStack>
                    <HStack spacing={4}>
                        <Text as="b">{user.fullName}</Text>
                        <SamosaStatsUserButton />
                    </HStack>
                </Flex>
            </Box>
        </Box>
    )
}