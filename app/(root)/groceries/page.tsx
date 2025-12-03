import {
  getGroceryItems,
  addGroceryItem,
  toggleGroceryPurchased,
  deleteGroceryItem,
} from "@/lib/actions/groceries.actions";
import { SubmitButton } from "./submit-button";
import { X } from "lucide-react";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { GroceryCategory } from "@prisma/client";

type GroceryItemWithUser = Awaited<ReturnType<typeof getGroceryItems>>[number];

export default async function GroceriesPage() {
  const items = await getGroceryItems();
  const currentUser = await getCurrentUser();

  const activeItems = items.filter((i) => !i.purchased);

  // group active items by category
  const grouped: Record<string, GroceryItemWithUser[]> = {};
  for (const item of activeItems) {
    const key = item.category || "Other";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  }

  const sortedCategories = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b)
  );

  const CATEGORY_LABELS: Record<GroceryCategory, string> = {
    PRODUCE: "Produce",
    BEVERAGES: "Beverages",
    MEAT: "Meat",
    DAIRY: "Dairy",
    FROZEN: "Frozen",
    PANTRY: "Pantry",
    SNACKS: "Snacks",
    HOUSEHOLD: "Household",
    BAKERY: "Bakery",
    CLEANING: "Cleaning",
    MISC: "Other",
  };

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold">Grocery List</h1>
      <div className=" w-full border-gray-200 p-4 mb-6 mt-6">
        {/* Add item form */}
        <form
          action={addGroceryItem}
          className="flex flex-wrap gap-2 max-w-3xl items-center"
        >
          <input
            name="name"
            placeholder="Add an item..."
            className="flex-1 min-w-[200px] border rounded-md px-3 py-2"
          />

          <input
            name="quantity"
            placeholder="Qty (optional)"
            className="w-32 border rounded-md px-3 py-2"
          />

          <select
            name="category"
            className="border rounded-md px-3 py-2"
            defaultValue="Produce"
          >
            <option value="PRODUCE">Produce</option>
            <option value="BEVERAGES">Beverages</option>
            <option value="MEAT">Meat</option>
            <option value="DAIRY">Dairy</option>
            <option value="FROZEN">Frozen</option>
            <option value="PANTRY">Pantry</option>
            <option value="SNACKS">Snacks</option>
            <option value="HOUSEHOLD">Household</option>
            <option value="BAKERY">Bakery</option>
            <option value="CLEANING">Cleaning</option>
            <option value="MISC">Other</option>
          </select>

          <SubmitButton />
        </form>

        <div className="space-y-6 max-w-3xl mt-6">
          {/* Category sections */}
          {sortedCategories.map((category) => (
            <section key={category} className="space-y-2">
              <h2 className="text-md font-medium text-gray-500">
                {CATEGORY_LABELS[category as GroceryCategory]}
              </h2>
              <ul className="space-y-2">
                {grouped[category].map((item) => (
                  <GroceryRow
                    key={item.id}
                    item={item}
                    currentUserId={currentUser?.id ?? null}
                  />
                ))}
              </ul>
            </section>
          ))}

          {items.length === 0 && (
            <p className="text-sm text-gray-500">
              No items yet. Add something above.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function GroceryRow({
  item,
  currentUserId,
}: {
  item: GroceryItemWithUser;
  currentUserId: string | null;
}) {
  const isYou = item.addedBy && item.addedBy.id === currentUserId;
  const name = (isYou ? "You" : item.addedBy?.name?.split(" ")[0]) ?? "Someone";

  // quick color based on first letter to mimic different badge colors
  const colorIndex = name.charCodeAt(0) % 5;
  const colorClasses = [
    "bg-orange-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
  ][colorIndex];

  return (
    <li>
      <form
        action={toggleGroceryPurchased.bind(null, item.id)}
        className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        {/* left side: checkbox + label */}
        <button
          type="submit"
          className="flex items-center gap-3 text-left flex-1"
        >
          <span
            className={`h-4 w-4 rounded-sm border flex items-center justify-center ${
              item.purchased ? "bg-green-500 border-green-500" : "bg-white"
            }`}
          >
            {item.purchased && <span className="h-2 w-2 bg-white rounded-sm" />}
          </span>

          <span
            className={
              item.purchased
                ? "line-through text-gray-400"
                : "text-gray-800 font-medium"
            }
          >
            {item.name}
            {item.quantity ? `  - ${item.quantity}x` : ""}
          </span>
        </button>

        {/* who added bubble */}
        <div className="flex items-center gap-2">
          <span
            className={`text-s text-white px-3 py-1 rounded-full ${colorClasses}`}
          >
            {name}
          </span>

          <button
            type="submit"
            formAction={deleteGroceryItem.bind(null, item.id)}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
          >
            <X size={14} />
          </button>
        </div>
      </form>
    </li>
  );
}
