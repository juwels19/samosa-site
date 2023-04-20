import { Box, Button, ButtonGroup, Center, Container, Flex, Heading, VStack } from "@chakra-ui/react";
import { useRouter } from 'next/router'
import { useAuth } from "@clerk/nextjs";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";

export default function Home() {
  const router = useRouter();
  const { userId } = useAuth();

  return (
    <>
      <Container minW={{ lg: '1200px' }}>
          <Box mt="2%">
              <Heading fontSize="lg">*Insert Samosa Stats Logo Here*</Heading>
          </Box>
          <VStack mt="10%">
            <Heading textAlign="center">
              The home for all your degenerate FRC fantasy needs
            </Heading>
          </VStack>
          {/* {_isMobile ? (
            <VStack mt="10%">
              <Button colorScheme="orange" size="lg" width="200px" onClick={() => router.push("/signup")}>
                Signup
              </Button>
              <Button colorScheme="orange" size="lg" width="200px" onClick={() => router.push("/signin")}>
                Signin
              </Button>
            </VStack>
          ) : (
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
          )} */}
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
    </>
  )
}

export async function getServerSideProps(context) {
  const { req } = context;
  const { userId } = getAuth(req);
  if (userId) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false
      },
      props: {
        ...buildClerkProps(req)
      }
    }
  }
  return {
    props: {
      userId: userId,
      ...buildClerkProps(req)
    }
  }
}