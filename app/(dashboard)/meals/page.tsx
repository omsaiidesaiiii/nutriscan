import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { History, Utensils } from "lucide-react";
import AddMealForm from "@/components/AddMealForm";
import DeleteMealButton from "@/components/DeleteMealButton";

export default async function MealsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-8 pb-8 animate-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Meal Journal
        </h1>
        <p className="text-sm text-zinc-500">
          {meals?.length || 0} meals logged · Track your daily nutrition.
        </p>
      </div>

      <div className="space-y-6">
        <AddMealForm />

        {/* Meal History */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-50 flex items-center space-x-2">
            <History className="h-4 w-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-zinc-900">
              Meal History
            </h2>
          </div>

          {!meals || meals.length === 0 ? (
            <div className="py-16 text-center px-6">
              <div className="bg-zinc-50 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-7 w-7 text-zinc-300" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900">
                No meals logged yet
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Use the form above to log your first meal.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="px-6 py-4 hover:bg-zinc-50/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex flex-col items-center justify-center h-11 w-11 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-400">
                      <span className="text-[10px] font-medium">
                        {new Date(meal.created_at).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-sm font-semibold text-zinc-700 leading-none">
                        {new Date(meal.created_at).getDate()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900 group-hover:text-emerald-600 transition-colors">
                        {meal.food_name}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-zinc-400">
                        <span className="font-medium text-emerald-600">
                          {meal.calories} kcal
                        </span>
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                    </div>
                  </div>
                  <DeleteMealButton id={meal.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
