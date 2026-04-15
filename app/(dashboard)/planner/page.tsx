import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MealPlanner from "@/components/MealPlanner";
import { getWeeklyStats } from "@/app/(dashboard)/dashboard/actions";

export default async function PlannerPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    profile = data;
  }

  if (!profile) redirect("/profile");

  const weeklyStats = await getWeeklyStats();

  return (
    <div className="space-y-8 pb-8 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Meal Planner
          </h1>
          <p className="text-sm text-zinc-500">
            AI-generated meal plans based on your {profile.target_calories} kcal
            target.
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-zinc-500">
          <div className="flex items-center space-x-1.5">
            <span className="font-medium text-zinc-900">
              {profile.target_calories}
            </span>
            <span>kcal/day</span>
          </div>
          <div className="h-4 w-px bg-zinc-200"></div>
          <div className="flex items-center space-x-1.5">
            <span className="font-medium text-zinc-900 capitalize">
              {profile.goal}
            </span>
            <span>mode</span>
          </div>
        </div>
      </div>

      <MealPlanner profile={profile} weeklyStats={weeklyStats} />
    </div>
  );
}
