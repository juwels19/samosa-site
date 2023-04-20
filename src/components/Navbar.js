import { Box, Button, Container, Flex, HStack, Heading, IconButton, Menu, MenuButton, Show, Hide, Text, MenuList, MenuItem } from "@chakra-ui/react";
import SamosaStatsUserButton from "./SamosaStatsUserButton";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { FiMenu } from 'react-icons/fi'

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
                        <Hide breakpoint="(max-width: 450px)">
                            {menuItems.map((item) => {
                                return (
                                    <Button variant="ghost" key={item.label} onClick={() => router.push(item.route)}>{item.label}</Button>
                                )
                            })}
                        </Hide>
                    </HStack>
                    <HStack spacing={4}>
                        <Hide breakpoint="(max-width: 450px)">
                            <Text as="b">{user.fullName}</Text>
                        </Hide>
                        <SamosaStatsUserButton />
                            <Show breakpoint="(max-width: 450px)">
                                <Menu autoSelect={false}>
                                    <MenuButton
                                        as={IconButton} 
                                        variant="ghost"
                                        icon={<FiMenu fontSize="1.25rem" />}
                                        aria-label="Open Menu"
                                    />
                                    <MenuList>
                                        {menuItems.map((item) => {
                                            return (
                                                <MenuItem variant="ghost" key={item.label} onClick={() => router.push(item.route)}>{item.label}</MenuItem>
                                            )
                                        })}
                                    </MenuList>
                                </Menu>
                            </Show>
                    </HStack>
                </Flex>
            </Box>
        </Box>
    )
}