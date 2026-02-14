import { Navbar } from "@/components/layout/Navbar";
import { authClient } from "@/lib/auth-client";

export default async function Home() {
  const session = await authClient.getSession();
  console.log(session);
  return (
    <div>
      <Navbar />
    </div>
  );
}
