import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function AccountHome() {
  const session = await getServerSession(authOptions as any);
  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">My Account</h1>
      {session?.user ? (
        <div className="space-y-3 mb-6">
          <p className="text-gray-700">Signed in as {session.user.email}</p>
          <div className="flex items-center gap-4">
            <Link href="/account/orders" className="text-purple-700 hover:underline">Orders</Link>
            <Link href="/account/gallery" className="text-purple-700 hover:underline">Gallery</Link>
            <Link href="/account/profile" className="text-purple-700 hover:underline">Profile</Link>
          </div>
        </div>
      ) : (
        <p>Please sign in to view your account.</p>
      )}
    </section>
  );
}
