// import { Box, Button, Container, Flex, HStack, Heading, IconButton, Menu, MenuButton, Show, Hide, Text, MenuList, MenuItem } from "@chakra-ui/react";
import SamosaStatsUserButton from "./SamosaStatsUserButton";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { FiMenu } from "react-icons/fi";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import { Button, Link, Navbar, Spacer, Text } from "@nextui-org/react";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

export default function SamosaNavbar(props) {
  const { user } = useUser();
  const router = useRouter();

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const menuItems = [
    // {
    //   label: "Dashboard",
    //   route: "/dashboard",
    // },
    // {
    //   label: "Leaderboard",
    //   route: "/leaderboard",
    // },
  ];

  if (props.isAdmin) {
    menuItems.push({ label: "Admin Panel", route: "/admin" });
  }

  return (
    <Navbar isBordered={true} disableShadow variant="sticky" maxWidth="fluid">
      <Navbar.Brand>
        {/* Add in a logo here */}
        <Text b color="inherit">
          Logo
        </Text>
        <Spacer x={0.5} />
        <Text b color="inherit" hideIn="sm">
          Samosa Stats
        </Text>
      </Navbar.Brand>
      <Navbar.Content hideIn="sm" variant="highlight-solid-rounded">
        {menuItems.map((item) => (
          <Navbar.Link
            key={item.label}
            href={item.route}
            isActive={router.pathname === item.route}
          >
            {item.label}
          </Navbar.Link>
        ))}
      </Navbar.Content>
      <Navbar.Content>
        <Text b color="inherit">
          {user.fullName}
        </Text>
        <SamosaStatsUserButton />
      </Navbar.Content>
      <Navbar.Collapse showIn="md">
        {menuItems.map((item) => (
          <Navbar.CollapseItem key={item.label}>
            <Link color="inherit" href={item.route}>
              {item.label}
            </Link>
          </Navbar.CollapseItem>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );

  // return (
  //     <Box position="fixed" minW="100%" zIndex={10}>
  //         <Box bg="orange" boxShadow="md">
  //             <Flex justifyContent="space-between" px="5%" py="2%">
  //                 <HStack spacing={4}>
  //                     <Heading fontSize="lg" onClick={() => router.push("/dashboard")} cursor="pointer">LOGO HERE</Heading>
  //                     <Hide breakpoint="(max-width: 450px)">
  //                         {menuItems.map((item) => {
  //                             return (
  //                                 <Button variant="ghost" key={item.label} onClick={() => router.push(item.route)}>{item.label}</Button>
  //                             )
  //                         })}
  //                     </Hide>
  //                 </HStack>
  //                 <HStack spacing={4}>
  //                         <Hide breakpoint="(max-width: 450px)">
  //                             <Text as="b">{user.fullName}</Text>
  //                         </Hide>
  //                         <SamosaStatsUserButton />
  //                         <Show breakpoint="(max-width: 450px)">
  //                             <IconButton
  //                                 variant="ghost"
  //                                 icon={<FiMenu fontSize="1.25rem" />}
  //                                 aria-label="Open Menu"
  //                                 onClick={onDrawerOpen}
  //                             />
  //                             <Drawer isOpen={isDrawerOpen} onClose={onDrawerClose}>
  //                                 <DrawerOverlay />
  //                                 <DrawerContent>
  //                                     <DrawerCloseButton />
  //                                     <DrawerHeader borderBottomWidth='1px' mb="0.5rem" fontSize="2xl">Navigation Menu</DrawerHeader>
  //                                     <DrawerBody>
  //                                         {menuItems.map((item) => {
  //                                             return (
  //                                                 <Flex mb="1rem" alignContent="start" key={item.label}>
  //                                                     <Button variant="ghost"
  //                                                         onClick={() => {
  //                                                             router.push(item.route)
  //                                                             onDrawerClose()
  //                                                         }}
  //                                                         fontSize="xl"
  //                                                             >{item.label}</Button>
  //                                                 </Flex>
  //                                             )
  //                                         })}
  //                                     </DrawerBody>
  //                                 </DrawerContent>
  //                             </Drawer>
  //                         </Show>
  //                     </HStack>
  //             </Flex>
  //         </Box>
  //     </Box>
  // )
}
