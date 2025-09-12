import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Snapshot from "@/lib/models/Snapshot";

export default async function GalleryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">My Gallery</h1>
        <p>Please sign in to view saved snapshots.</p>
      </section>
    );
  }

  await dbConnect();
  const snaps = await Snapshot.find({ userEmail: session.user.email })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">My Gallery</h1>
      {snaps.length === 0 ? (
        <p>No snapshots saved yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {snaps.map((s: any) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={s._id.toString()}
              src={s.url}
              alt="snapshot"
              className="w-full h-48 object-cover rounded-lg border"
            />
          ))}
        </div>
      )}
    </section>
  );
}
