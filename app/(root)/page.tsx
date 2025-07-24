import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Home",
};

const Homepage = async () => {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
          Welcome to RoomEez
        </h1>
        <p className="text-lg sm:text-xl max-w-xl mx-auto text-gray-600 mb-6">
          Effortlessly manage shared expenses and household members — because
          living together should be easy.
        </p>
        <Separator className="my-4" />

        <div className="flex justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <FeatureCard
            title="Split Bills Fast"
            description="Track who owes what with a simple and intuitive interface."
          />
          <FeatureCard
            title="Invite Roommates"
            description="Add household members with just an email invite."
          />
          <FeatureCard
            title="Stay Organized"
            description="View shared payments and history in one dashboard."
          />
        </div>
      </section>
    </main>
  );
};

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
export default Homepage;
