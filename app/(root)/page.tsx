import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  getCurrentHousehold,
  getCurrentUser,
} from "@/lib/actions/user.actions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Home",
};

const Homepage = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not logged in!");

  const username = user.name === "Error" ? "User" : user.name;
  console.log(user);

  const household = await getCurrentHousehold();
  if (!household) throw new Error("No household found");
  const members = household?.members;
  const memberCount = household.members.length ?? 0;

  return (
    <section className="wrapper space-y-2">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {username}</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening in your shared home:
        </p>
      </div>

      {/* 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Bills Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">$123.45</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>You Owe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-destructive">$45.67</p>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button>+ Add New Bill</Button>
            <Button variant="outline">View All Bills</Button>
          </div>
        </div>

        {/* Middle Column */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <CardTitle className="text-base">Calendar View</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <span className="h3-bold text-red-600">
              Feature is Coming Soon!
            </span>
            <Calendar className="w-full text-gray-500" />
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card className="w-full h-fit">
          <CardHeader>
            <CardTitle className="h2-bold">Your Household</CardTitle>
            <CardDescription>Manage members and invites</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Household Info */}
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">Household Name</h4>
              <p className="text-muted-foreground text-sm">{household.name}</p>

              <h4 className="font-semibold text-sm mt-3">Members</h4>
              <p className="text-muted-foreground text-sm">
                {memberCount} total
              </p>
            </div>

            {/* Members List */}
            <ul className="space-y-3">
              {members.map((member) => (
                <li key={member.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback>
                      {member.user.name.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        member.user.id === user.id ? "font-bold" : ""
                      )}
                    >
                      {member.user.name}
                    </span>
                    {/* className={cn("text-sm font-medium", member.user.id === user.id ? "font-semibold text-blue-600" : "")} */}
                    <Badge variant="secondary" className="w-fit text-xs mt-1">
                      {member.role}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>

            {/* Invite Button */}
            <Button variant="outline" className="w-full">
              + Invite Member
            </Button>

            {/* Optional Actions */}
            <div className="space-y-1 pt-4 border-t">
              <Button variant="ghost" className="w-full text-left text-sm">
                Rename Household
              </Button>
              <Button
                variant="destructive"
                className="w-full text-left text-sm"
              >
                Leave Household
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Homepage;
