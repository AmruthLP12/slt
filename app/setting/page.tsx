import { getSession } from "@/lib/getSession";

export default async function Setting() {
  const session = await getSession();

  if (!session) {
    return <div>Please log in to access this page.</div>;
  }

  if (session.role !== "admin") {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div>
      <h1>Welcome back!</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
