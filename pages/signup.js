import { SignUp } from "@clerk/nextjs";
import { Center, Heading, VStack } from "@chakra-ui/react";

export default function Signup() {
    return (
        <Center height="calc(100vh)">
            <VStack>
                <Heading fontSize="2xl" mb="2%" textAlign="center">It totally didn't take me forever to get this authentication system working...</Heading>
                <SignUp signInUrl="/signin" afterSignUpUrl="/dashboard"/>
            </VStack>
        </Center>
    )
}