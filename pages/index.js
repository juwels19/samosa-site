import { Box, Button, ButtonGroup, Container, Flex, Heading, VStack } from "@chakra-ui/react";
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();

  return (
    <Container minW="container.xl">
        <Box mt="2%">
            <Heading fontSize="lg">*Insert Samosa Stats Logo Here*</Heading>
        </Box>
        <VStack mt="10%">
          <Heading>
            The home for all your degenerate FRC fantasy needs
          </Heading>
        </VStack>
        <Flex justify="center" mt="5%">
          <ButtonGroup colorScheme="orange" size="lg" gap="100">
            <Button width="200px" onClick={() => router.push("/signup")}>
              Signup
            </Button>
            <Button width="200px" onClick={() => router.push("/signin")}>
              Signin
            </Button>
          </ButtonGroup>
        </Flex>
    </Container>
  )
}
