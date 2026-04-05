/**
 * UK Driving Lesson Cost Data
 *
 * Sources:
 * - DVSA theory and practical test fees: gov.uk/driving-test-cost
 * - Provisional licence fee: gov.uk/apply-first-provisional-driving-licence
 * - Average lesson prices: aggregated from ADI listing sites (2025–2026)
 * - Average lessons to pass: DVSA published statistics
 * - Pass rates: DVSA driving test statistics, 2024–25
 *
 * Last updated: April 2026
 * Update frequency: Every 6 months or when DVSA fees change.
 * NOTE: Prices are estimates based on publicly available data and may vary.
 */

export interface CityData {
  name: string;
  slug: string;
  region: string;
  avgLessonPrice: number;
  avgLessonPriceRange: [number, number];
  avgLessonsToPass: number;
  passRate: number;
}

export interface FixedCosts {
  provisionalLicence: number;
  theoryTest: number;
  practicalTest: { weekday: number; weekend: number };
  theoryPrepApp: number;
}

export interface ExperienceLevel {
  id: string;
  label: string;
  description: string;
  lessonsMultiplier: number;
}

export interface NationalAverage {
  lessonPrice: number;
  lessonPriceRange: [number, number];
  lessonsToPass: number;
  passRate: number;
}

export const FIXED_COSTS: FixedCosts = {
  provisionalLicence: 34,
  theoryTest: 23,
  practicalTest: {
    weekday: 62,
    weekend: 75,
  },
  theoryPrepApp: 5,
};

export const NATIONAL_AVERAGE: NationalAverage = {
  lessonPrice: 35,
  lessonPriceRange: [28, 45],
  lessonsToPass: 45,
  passRate: 49.3,
};

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  {
    id: 'none',
    label: 'Complete beginner',
    description: 'Never driven before',
    lessonsMultiplier: 1.0,
  },
  {
    id: 'some-private',
    label: 'Some private practice',
    description: 'Driven in a car park or quiet roads',
    lessonsMultiplier: 0.75,
  },
  {
    id: 'some-lessons',
    label: 'Had lessons before',
    description: 'Taken professional lessons previously',
    lessonsMultiplier: 0.5,
  },
  {
    id: 'nearly-ready',
    label: 'Nearly test-ready',
    description: 'Close to test standard already',
    lessonsMultiplier: 0.2,
  },
];

export const CITIES: CityData[] = [
  { name: 'London', slug: 'london', region: 'Greater London', avgLessonPrice: 40, avgLessonPriceRange: [32, 50], avgLessonsToPass: 50, passRate: 44.2 },
  { name: 'Manchester', slug: 'manchester', region: 'North West', avgLessonPrice: 33, avgLessonPriceRange: [28, 40], avgLessonsToPass: 42, passRate: 48.7 },
  { name: 'Birmingham', slug: 'birmingham', region: 'West Midlands', avgLessonPrice: 32, avgLessonPriceRange: [27, 38], avgLessonsToPass: 44, passRate: 46.1 },
  { name: 'Leeds', slug: 'leeds', region: 'Yorkshire', avgLessonPrice: 32, avgLessonPriceRange: [26, 38], avgLessonsToPass: 43, passRate: 50.2 },
  { name: 'Liverpool', slug: 'liverpool', region: 'North West', avgLessonPrice: 30, avgLessonPriceRange: [25, 36], avgLessonsToPass: 43, passRate: 47.8 },
  { name: 'Bristol', slug: 'bristol', region: 'South West', avgLessonPrice: 35, avgLessonPriceRange: [28, 42], avgLessonsToPass: 44, passRate: 50.5 },
  { name: 'Sheffield', slug: 'sheffield', region: 'Yorkshire', avgLessonPrice: 30, avgLessonPriceRange: [25, 36], avgLessonsToPass: 42, passRate: 51.3 },
  { name: 'Edinburgh', slug: 'edinburgh', region: 'Scotland', avgLessonPrice: 35, avgLessonPriceRange: [28, 42], avgLessonsToPass: 40, passRate: 52.1 },
  { name: 'Glasgow', slug: 'glasgow', region: 'Scotland', avgLessonPrice: 30, avgLessonPriceRange: [25, 36], avgLessonsToPass: 42, passRate: 49.8 },
  { name: 'Cardiff', slug: 'cardiff', region: 'Wales', avgLessonPrice: 32, avgLessonPriceRange: [26, 38], avgLessonsToPass: 43, passRate: 48.5 },
  { name: 'Newcastle', slug: 'newcastle', region: 'North East', avgLessonPrice: 30, avgLessonPriceRange: [24, 36], avgLessonsToPass: 41, passRate: 51.0 },
  { name: 'Nottingham', slug: 'nottingham', region: 'East Midlands', avgLessonPrice: 32, avgLessonPriceRange: [26, 38], avgLessonsToPass: 44, passRate: 49.0 },
  { name: 'Southampton', slug: 'southampton', region: 'South East', avgLessonPrice: 34, avgLessonPriceRange: [28, 40], avgLessonsToPass: 43, passRate: 50.1 },
  { name: 'Brighton', slug: 'brighton', region: 'South East', avgLessonPrice: 36, avgLessonPriceRange: [30, 44], avgLessonsToPass: 44, passRate: 49.5 },
  { name: 'Cambridge', slug: 'cambridge', region: 'East', avgLessonPrice: 36, avgLessonPriceRange: [30, 44], avgLessonsToPass: 42, passRate: 52.8 },
  { name: 'Oxford', slug: 'oxford', region: 'South East', avgLessonPrice: 37, avgLessonPriceRange: [30, 45], avgLessonsToPass: 43, passRate: 51.4 },
  { name: 'Belfast', slug: 'belfast', region: 'Northern Ireland', avgLessonPrice: 28, avgLessonPriceRange: [22, 34], avgLessonsToPass: 40, passRate: 53.2 },
  { name: 'Plymouth', slug: 'plymouth', region: 'South West', avgLessonPrice: 32, avgLessonPriceRange: [26, 38], avgLessonsToPass: 42, passRate: 50.8 },
  { name: 'Coventry', slug: 'coventry', region: 'West Midlands', avgLessonPrice: 32, avgLessonPriceRange: [26, 38], avgLessonsToPass: 44, passRate: 47.5 },
  { name: 'Leicester', slug: 'leicester', region: 'East Midlands', avgLessonPrice: 31, avgLessonPriceRange: [25, 37], avgLessonsToPass: 45, passRate: 46.8 },
];
