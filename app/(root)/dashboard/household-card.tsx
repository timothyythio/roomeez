import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  getCurrentHousehold,
  getCurrentUser,
} from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const HouseholdCard = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <section className="wrapper space-y-4">
        <h1 className="text-2xl font-bold">Youre not signed in</h1>
        <p className="text-muted-foreground">
          Please sign in to view your dashboard.
        </p>
      </section>
    );
  }
  const household = await getCurrentHousehold();
  if (!household) {
    return (
      <Card className="w-full h-fit">
        <CardHeader>
          <CardTitle className="h2-bold">Your Household</CardTitle>
          <CardDescription>Manage members and invites</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          You are not a part of a household :(
          <div className="space-y-1 pt-4">
            <Button variant="default" className="w-full text-left text-sm mt-2">
              + Create Household
            </Button>
            <Button variant="outline" className="w-full text-left text-sm mt-2">
              Join Household
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  const members = household?.members;
  const memberCount = household.members.length ?? 0;
  return (
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
          <p className="text-muted-foreground text-sm">{memberCount} total</p>
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
          <Button variant="destructive" className="w-full text-left text-sm">
            Leave Household
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HouseholdCard;
