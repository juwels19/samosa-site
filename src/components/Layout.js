import SamosaNavbarNavbar from "@components/Navbar";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

export default function Layout({ children }) {
    return (
        <>
            <SamosaNavbarNavbar />
            {children}
        </>
    )
}

export async function getServerSideProps(context) {
    console.log("inside getServerProps for navbar")
    // const { userId } = getAuth(context.req);
    console.log(getAuth(context.req))
    // const user = await clerkClient.users.getUser(userId)
    return {
        props: {
            isAdmin: user.privateMetadata.admin
        }
    }

}