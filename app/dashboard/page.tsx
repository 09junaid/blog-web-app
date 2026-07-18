// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

export default async function DashboardIndexPage() {
  // const { userId } = await auth();

  // if (!userId) {
  //   redirect("/sign-in");
  // }

  return <h1>hello from the dashboard</h1>;
}
