import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TodayCard = () => {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <CardTitle className="text-base">Calendar View</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <span className="h3-bold text-red-600">Feature is Coming Soon!</span>
        <Calendar className="w-full text-gray-500" />
      </CardContent>
    </Card>
  );
};

export default TodayCard;
