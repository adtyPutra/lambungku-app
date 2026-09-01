import { supabase } from './supabase';

export interface Disease {
  name: string;
  description: string;
  causes: string[];
  solution: string[];
  symptoms: string[];
  min_match: number;
}

export interface AppData {
  symptoms: Record<string, string>;
  diseases: Record<string, Disease>;
}

export async function getAppData(): Promise<AppData> {
  const { data: dbSymptoms } = await supabase.from('Gejala').select('*');
  
  const { data: dbDiseases } = await supabase.from('Penyakit').select(`
    id, nama, deskripsi, penyebab, solusi, min_cocok,
    PenyakitGejala ( gejala_id )
  `);

  const symptomsMap: Record<string, string> = {};
  if (dbSymptoms) {
    for (const s of dbSymptoms) {
      symptomsMap[s.id] = s.nama;
    }
  }

  const diseasesMap: Record<string, Disease> = {};
  if (dbDiseases) {
    for (const d of dbDiseases) {
      diseasesMap[d.id] = {
        name: d.nama,
        description: d.deskripsi,
        causes: d.penyebab || [],
        solution: d.solusi || [],
        min_match: d.min_cocok || 1,
        symptoms: d.PenyakitGejala ? d.PenyakitGejala.map((s: any) => s.gejala_id) : [],
      };
    }
  }

  return { symptoms: symptomsMap, diseases: diseasesMap };
}
