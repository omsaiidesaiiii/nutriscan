import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Target, Flame } from "lucide-react";
import WeeklyChart from "@/components/WeeklyChart";
import { getWeeklyStats } from "@/app/(dashboard)/dashboard/actions";
import { calculateConsistencyScore } from "@/lib/calculateConsistencyScore";
import { cn } from "@/lib/utils";

export default async function AnalyticsPage() {
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

  // Compute real averages
  const daysWithData = weeklyStats.filter((d) => d.calories > 0);
  const avgCalories =
    daysWithData.length > 0
      ? Math.round(
          daysWithData.reduce((sum, d) => sum + d.calories, 0) /
            daysWithData.length
        )
      : 0;
  const avgProtein =
    daysWithData.length > 0
      ? Math.round(
          daysWithData.reduce((sum, d) => sum + d.protein, 0) /
            daysWithData.length
        )
      : 0;

  // Compute real daily deficit/surplus
  const dailyDifference = avgCalories - profile.target_calories;
  const isDeficit = dailyDifference < 0;

  // Compute real consistency score
  const { score_percentage, rating, badge } = calculateConsistencyScore(
    weeklyStats,
    {
      calories: profile.target_calories,
      protein: profile.target_protein,
    }
  );

  // Compute real macro split from weekly totals
  const totalProtein = weeklyStats.reduce((sum, d) => sum + d.protein, 0);
  const totalCaloriesWeek = weeklyStats.reduce((sum, d) => sum + d.calories, 0);
  // Estimate carbs and fat from calorie difference (protein * 4 cal/g)
  // Since weekly stats only have calories and protein, we compute protein % directly
  const proteinCalories = totalProtein * 4;
  const proteinPct =
    totalCaloriesWeek > 0
      ? Math.round((proteinCalories / totalCaloriesWeek) * 100)
      : 0;
  const remainingPct = 100 - proteinPct;
  // Default split for remaining: ~60% carbs, ~40% fat of non-protein calories
  const carbsPct = Math.round(remainingPct * 0.6);
  const fatPct = remainingPct - carbsPct;

  return (
    <div className="space-y-8 pb-8 animate-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Analytics
        </h1>
        <p className="text-sm text-zinc-500">
          Your nutritional performance over the last 7 days.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Avg Calories */}
        <div className="card p-6">
          <span className="text-sm font-medium text-zinc-500">
            Avg. Daily Calories
          </span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-3xl font-semibold text-zinc-900">
              {avgCalories}
            </span>
            <span className="text-sm text-zinc-400">kcal</span>
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            Target: {profile.target_calories} kcal/day
          </p>
        </div>

        {/* Avg Protein */}
        <div className="card p-6">
          <span className="text-sm font-medium text-zinc-500">
            Avg. Daily Protein
          </span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-3xl font-semibold text-zinc-900">
              {avgProtein}
            </span>
            <span className="text-sm text-zinc-400">g</span>
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            Target: {profile.target_protein}g/day
          </p>
        </div>

        {/* Daily Deficit/Surplus */}
        <div className="card p-6">
          <div className="flex items-center space-x-2 text-zinc-500 mb-2">
            <Flame className="h-4 w-4" />
            <span className="text-sm font-medium">
              Daily {isDeficit ? "Deficit" : "Surplus"}
            </span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-semibold text-zinc-900">
              {Math.abs(dailyDifference)}
            </span>
            <span className="text-sm text-zinc-400">kcal</span>
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            {daysWithData.length > 0
              ? `Based on ${daysWithData.length} day${
                  daysWithData.length !== 1 ? "s" : ""
                } of data`
              : "No data yet"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="xl:col-span-2">
          <WeeklyChart data={weeklyStats} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Consistency Score */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-emerald-600" />
                <h3 className="text-base font-semibold text-zinc-900">
                  Consistency
                </h3>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                {badge}
              </span>
            </div>

            <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-4xl font-semibold text-zinc-900">
                {score_percentage}
              </span>
              <span className="text-lg text-zinc-400">%</span>
            </div>

            <div className="space-y-2">
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-700 ease-out rounded-full"
                  style={{ width: `${score_percentage}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400">
                {rating} · Based on ±10% target adherence
              </p>
            </div>
          </div>

          {/* Macro Split */}
          <div className="card p-6">
            <h3 className="text-base font-semibold text-zinc-900 mb-5">
              Macro Split
            </h3>

            {totalCaloriesWeek > 0 ? (
              <div className="space-y-5">
                {[
                  {
                    label: "Protein",
                    val: proteinPct,
                    color: "bg-emerald-600",
                  },
                  {
                    label: "Carbs (est.)",
                    val: carbsPct,
                    color: "bg-emerald-400",
                  },
                  { label: "Fats (est.)", val: fatPct, color: "bg-zinc-400" },
                ].map((macro) => (
                  <div key={macro.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500 font-medium">
                        {macro.label}
                      </span>
                      <span className="text-zinc-900 font-medium">
                        {macro.val}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          macro.color
                        )}
                        style={{ width: `${macro.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 text-center py-4">
                No data this week yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
