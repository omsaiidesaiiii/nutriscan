export interface DailyResult {
  date: string;
  calories: number;
  protein: number;
}

export function calculateConsistencyScore(
  dailyStats: DailyResult[],
  targets: { calories: number; protein: number }
) {
  let totalPoints = 0;
  const maxPointsPerDay = 10;
  const days = dailyStats.length || 7;
  const maxPossiblePoints = days * maxPointsPerDay;

  dailyStats.forEach(day => {
    let dayPoints = 0;

    // Calorie check (±10%)
    const calMin = targets.calories * 0.9;
    const calMax = targets.calories * 1.1;
    if (day.calories >= calMin && day.calories <= calMax) {
      dayPoints += 5;
    }

    // Protein check (±10%)
    const proMin = targets.protein * 0.9;
    const proMax = targets.protein * 1.1;
    if (day.protein >= proMin && day.protein <= proMax) {
      dayPoints += 5;
    }

    totalPoints += dayPoints;
  });

  const score_percentage = Math.round((totalPoints / maxPossiblePoints) * 100);

  let rating = "Needs Focus";
  let badge = "Needs Focus";

  if (score_percentage >= 90) {
    rating = "Excellent";
    badge = "Elite Discipline";
  } else if (score_percentage >= 75) {
    rating = "Good";
    badge = "Consistent Performer";
  } else if (score_percentage >= 50) {
    rating = "Fair";
    badge = "Improving";
  }

  return {
    score_percentage,
    rating,
    badge
  };
}
