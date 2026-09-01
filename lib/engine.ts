import { AppData, Disease } from './db';

export interface DiagnosisResult {
  key: string;
  disease: Disease;
  matched: string[];
  score: number;
  percentage: number;
  isConfirmed: boolean;
}

export function forwardChaining(
  selectedSymptoms: string[],
  data: AppData
): DiagnosisResult[] {
  const results: DiagnosisResult[] = [];
  for (const [key, disease] of Object.entries(data.diseases)) {
    const matched = selectedSymptoms.filter(s => disease.symptoms.includes(s));
    if (disease.symptoms.length === 0) continue;
    const score = matched.length / disease.symptoms.length;
    if (matched.length > 0) {
      results.push({
        key,
        disease,
        matched,
        score,
        percentage: Math.round(score * 100),
        isConfirmed: matched.length >= disease.min_match,
      });
    }
  }
  return results.sort((a, b) => b.score - a.score);
}
