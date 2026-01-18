// RFM Utility Functions and Types

export interface Customer {
  id: string;
  recency: number;
  frequency: number;
  monetary: number;
}

export interface RFMCustomer extends Customer {
  recencyScore: number;
  frequencyScore: number;
  monetaryScore: number;
  x: number; // frequencyScore
  y: number; // monetaryScore
}

/**
 * Calculate percentile score (1-5) for a value within a dataset
 * For recency: lower is better (score 5), higher is worse (score 1)
 * For frequency/monetary: higher is better (score 5), lower is worse (score 1)
 */
export function calculatePercentileScore(
  value: number,
  allValues: number[],
  inverse: boolean = false
): number {
  const sorted = [...allValues].sort((a, b) => a - b);
  const rank = sorted.filter((v) => v < value).length;
  const percentile = (rank / sorted.length) * 100;

  // Map percentile to 1-5 score
  let score: number;
  if (percentile < 20) score = 1;
  else if (percentile < 40) score = 2;
  else if (percentile < 60) score = 3;
  else if (percentile < 80) score = 4;
  else score = 5;

  // For recency, inverse the score (low recency = high score)
  return inverse ? 6 - score : score;
}

/**
 * Calculate RFM scores for all customers
 * x = frequencyScore (1-5)
 * y = monetaryScore (1-5)
 */
export function calculateRFMScores(customers: Customer[]): RFMCustomer[] {
  const recencyValues = customers.map((c) => c.recency);
  const frequencyValues = customers.map((c) => c.frequency);
  const monetaryValues = customers.map((c) => c.monetary);

  return customers.map((customer) => {
    const recencyScore = calculatePercentileScore(
      customer.recency,
      recencyValues,
      true // inverse: lower recency = higher score
    );
    const frequencyScore = calculatePercentileScore(
      customer.frequency,
      frequencyValues
    );
    const monetaryScore = calculatePercentileScore(
      customer.monetary,
      monetaryValues
    );

    return {
      ...customer,
      recencyScore,
      frequencyScore,
      monetaryScore,
      x: frequencyScore,
      y: monetaryScore,
    };
  });
}

/**
 * Group customers by their grid position (x, y)
 */
export function groupByGridPosition(
  customers: RFMCustomer[]
): Map<string, RFMCustomer[]> {
  const grouped = new Map<string, RFMCustomer[]>();

  for (let x = 1; x <= 5; x++) {
    for (let y = 1; y <= 5; y++) {
      grouped.set(`${x}-${y}`, []);
    }
  }

  customers.forEach((customer) => {
    const key = `${customer.x}-${customer.y}`;
    const existing = grouped.get(key) || [];
    grouped.set(key, [...existing, customer]);
  });

  return grouped;
}

/**
 * Get segment label based on RFM scores
 */
export function getSegmentLabel(x: number, y: number): string {
  if (x >= 4 && y >= 4) return "Champions";
  if (x >= 4 && y >= 2 && y <= 3) return "Loyal";
  if (x >= 3 && y >= 4) return "Potential Loyalists";
  if (x >= 4 && y === 1) return "Recent Customers";
  if (x >= 2 && x <= 3 && y >= 2 && y <= 3) return "Need Attention";
  if (x === 1 && y >= 4) return "At Risk";
  if (x >= 2 && x <= 3 && y === 1) return "About to Sleep";
  if (x === 1 && y >= 2 && y <= 3) return "Hibernating";
  if (x === 1 && y === 1) return "Lost";
  return "Others";
}

/**
 * Get segment color based on position
 */
export function getSegmentColor(x: number, y: number): string {
  if (x >= 4 && y >= 4) return "bg-emerald-500/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-300";
  if (x >= 4 && y >= 2) return "bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-300";
  if (x >= 3 && y >= 4) return "bg-teal-500/20 border-teal-500/50 text-teal-700 dark:text-teal-300";
  if (x >= 3 && y >= 3) return "bg-blue-500/20 border-blue-500/50 text-blue-700 dark:text-blue-300";
  if (x >= 2 && y >= 2) return "bg-yellow-500/20 border-yellow-500/50 text-yellow-700 dark:text-yellow-300";
  if (x === 1 && y >= 4) return "bg-orange-500/20 border-orange-500/50 text-orange-700 dark:text-orange-300";
  if (x === 1 || y === 1) return "bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-300";
  return "bg-gray-500/20 border-gray-500/50 text-gray-700 dark:text-gray-300";
}
