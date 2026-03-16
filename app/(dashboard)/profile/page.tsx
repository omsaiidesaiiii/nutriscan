"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, X, User } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState<{
    weight: string;
    height: string;
    age: string;
    gender: string;
    goal: string;
    activity_level: string;
    health_conditions: string[];
  }>({
    weight: "",
    height: "",
    age: "",
    gender: "male",
    goal: "maintain",
    activity_level: "moderate",
    health_conditions: [],
  });
  const [conditionInput, setConditionInput] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setFormData({
          weight: profile.weight.toString(),
          height: profile.height.toString(),
          age: profile.age.toString(),
          gender: profile.gender,
          goal: profile.goal,
          activity_level: profile.activity_level,
          health_conditions: profile.health_conditions || [],
        });
      }
      setFetchingProfile(false);
    }

    checkUser();
  }, [supabase, router]);

  const addCondition = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !formData.health_conditions.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        health_conditions: [...prev.health_conditions, trimmed],
      }));
    }
    setConditionInput("");
  };

  const removeCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      health_conditions: prev.health_conditions.filter((_, i) => i !== index),
    }));
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCondition(conditionInput.replace(",", ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (conditionInput.trim()) {
      addCondition(conditionInput);
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const calcResponse = await fetch("/api/calculate-targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: Number(formData.weight),
          height: Number(formData.height),
          age: Number(formData.age),
          gender: formData.gender,
          goal: formData.goal,
          activity_level: formData.activity_level,
          health_conditions: formData.health_conditions,
        }),
      });

      if (!calcResponse.ok) {
        const errData = await calcResponse.json();
        throw new Error(errData.error || "Failed to calculate targets");
      }

      const targets = await calcResponse.json();

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        weight: Number(formData.weight),
        height: Number(formData.height),
        age: Number(formData.age),
        gender: formData.gender,
        goal: formData.goal,
        activity_level: formData.activity_level,
        health_conditions: formData.health_conditions,
        ...targets,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success("Profile updated successfully!");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-3">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        <p className="text-sm text-zinc-400">Loading profile...</p>
      </div>
    );
  }

  const inputClass =
    "block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all";
  const selectClass = inputClass + " appearance-none";

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="h-14 w-14 bg-zinc-100 rounded-2xl flex items-center justify-center">
          <User className="h-6 w-6 text-zinc-500" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {userEmail.split("@")[0] || "Profile"}
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">{userEmail}</p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <div className="card p-8 sm:p-10 space-y-8">
          {/* Body Metrics */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-zinc-900">
              Body Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  className={inputClass}
                  placeholder="75.0"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  className={inputClass}
                  placeholder="180"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  required
                  className={inputClass}
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-100" />

          {/* Goals & Activity */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-zinc-900">
              Goals & Activity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Gender
                </label>
                <select
                  className={selectClass}
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Goal
                </label>
                <select
                  className={selectClass}
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                >
                  <option value="cut">Weight Loss (Cut)</option>
                  <option value="maintain">Maintain</option>
                  <option value="bulk">Gain Weight (Bulk)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Activity Level
                </label>
                <select
                  className={selectClass}
                  value={formData.activity_level}
                  onChange={(e) =>
                    setFormData({ ...formData, activity_level: e.target.value })
                  }
                >
                  <option value="low">Sedentary</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">Very Active</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-100" />

          {/* Health Conditions */}
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">
                Health Conditions
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Add conditions like diabetes, hypertension, high_cholesterol to
                enable AI health shields.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.health_conditions.length === 0 ? (
                  <div className="px-4 py-3 border border-dashed border-zinc-200 rounded-xl w-full text-center">
                    <span className="text-sm text-zinc-400">
                      No health conditions added
                    </span>
                  </div>
                ) : (
                  formData.health_conditions.map((condition, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100"
                    >
                      <span>{condition}</span>
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="text-emerald-400 hover:text-emerald-700 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <input
                type="text"
                className={inputClass}
                placeholder="Type a condition and press Enter..."
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                onKeyUp={handleKeyUp}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              />
            </div>
          </div>
        </div>

        {/* Submit - outside card for SaaS feel */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
