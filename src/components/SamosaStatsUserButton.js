import { UserButton } from "@clerk/nextjs";


export default function SamosaStatsUserButton() {
    return (
        <UserButton afterSignOutUrl="/" />
    )
}