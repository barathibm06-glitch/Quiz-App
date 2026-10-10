import NavbarClient from "./NavbarClient";
import { getSession } from "@/lib/auth";

export default async function Navbar() {
  const session = await getSession();
  return <NavbarClient user={session ? { name: session.name } : null} />;
}
