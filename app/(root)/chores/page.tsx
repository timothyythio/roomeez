// app/(dashboard)/chores/page.tsx
import { X } from "lucide-react";
import {
  getChores,
  addChore,
  toggleChoreCompleted,
  deleteChore,
} from "@/lib/actions/chores.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { SubmitButton } from "./submit-button";

type ChoreWithUser = Awaited<ReturnType<typeof getChores>>[number];

const SCHEDULE_LABELS: Record<string, string> = {
  once: "One-time",
  weekly: "Weekly",
  daily: "Daily",
};

const SCHEDULE_ORDER = ["daily", "weekly", "once"];

export default async function ChoresPage() {
  const [chores, currentUser] = await Promise.all([
    getChores(),
    getCurrentUser(),
  ]);

  const incomplete = chores.filter((c) => !c.completed);
  const completed = chores.filter((c) => c.completed);

  // group incomplete chores by schedule
  const grouped: Record<string, ChoreWithUser[]> = {};
  for (const chore of incomplete) {
    const key = chore.schedule || "once";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(chore);
  }

  const totalNeeded = incomplete.length;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-semibold text-gray-900">Chores</h1>
          <p className="text-gray-600 mt-1 text-sm">
            {totalNeeded} chore{totalNeeded === 1 ? "" : "s"} pending
          </p>
        </header>

        {/* Add Chore Form */}
        <form
          action={addChore}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              name="title"
              placeholder="Add a chore..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <input
              type="text"
              name="description"
              placeholder="Notes (optional)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <select
              name="schedule"
              defaultValue="weekly"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="once">One-time</option>
            </select>

            <select
              name="assignee"
              defaultValue="me"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="me">Assign to me</option>
              <option value="anyone">Anyone</option>
            </select>

            <SubmitButton />
          </div>
        </form>

        {/* Incomplete chores grouped by schedule */}
        <div className="space-y-6">
          {SCHEDULE_ORDER.map((scheduleKey) => {
            const list = grouped[scheduleKey];
            if (!list || list.length === 0) return null;

            return (
              <section key={scheduleKey}>
                <h2 className="text-sm font-semibold text-gray-600 mb-3">
                  {SCHEDULE_LABELS[scheduleKey] ?? scheduleKey}
                </h2>

                <div className="space-y-2">
                  {list.map((chore) => (
                    <ChoreRow
                      key={chore.id}
                      chore={chore}
                      currentUserId={currentUser?.id ?? null}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Completed chores */}
        {completed.length > 0 && (
          <section className="mt-4">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Completed
            </h2>
            <div className="space-y-2">
              {completed.map((chore) => (
                <ChoreRow
                  key={chore.id}
                  chore={chore}
                  currentUserId={currentUser?.id ?? null}
                  dimmed
                  showSchedule
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function ChoreRow({
  chore,
  currentUserId,
  dimmed = false,
  showSchedule = false,
}: {
  chore: ChoreWithUser;
  currentUserId: string | null;
  dimmed?: boolean;
  showSchedule?: boolean;
}) {
  const isYou = chore.assignedUser && chore.assignedUser.id === currentUserId;
  const assigneeName =
    (isYou ? "You" : chore.assignedUser?.name?.split(" ")[0]) ?? "Anyone";

  const colorIndex = assigneeName.charCodeAt(0) % 5;
  const colorClasses = [
    "bg-orange-500",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-purple-500",
    "bg-pink-500",
  ][colorIndex];

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${
        dimmed ? "opacity-60" : ""
      }`}
    >
      <form
        action={toggleChoreCompleted.bind(null, chore.id)}
        className="flex items-center gap-4"
      >
        {/* checkbox */}
        <button
          type="submit"
          className="flex items-center justify-center w-5 h-5 rounded border border-gray-300 bg-white text-blue-600"
        >
          {chore.completed && (
            <span className="block w-3 h-3 bg-blue-600 rounded-sm" />
          )}
        </button>

        {/* title + description */}
        <div className="flex-1">
          <p
            className={`text-sm text-gray-900 ${
              chore.completed ? "line-through" : ""
            }`}
          >
            {chore.title}
          </p>
          {chore.description && (
            <p className="text-xs text-gray-500 mt-0.5">{chore.description}</p>
          )}
        </div>

        {showSchedule && (
          <span className="text-xs text-gray-500 mr-2">
            {SCHEDULE_LABELS[chore.schedule] ?? chore.schedule}
          </span>
        )}

        {/* assignee pill */}
        <span
          className={`px-2.5 py-1 rounded-full text-xs text-white ${colorClasses}`}
        >
          {assigneeName}
        </span>

        {/* delete button */}
        <button
          type="submit"
          formAction={deleteChore.bind(null, chore.id)}
          className="text-gray-400 hover:text-red-600 transition-colors ml-2"
        >
          <X className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
