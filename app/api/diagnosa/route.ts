import { NextRequest, NextResponse } from 'next/server';
import { getAppData } from '@/lib/db';
import { forwardChaining } from '@/lib/engine';

export async function POST(req: NextRequest) {
  try {
    const { symptoms } = await req.json();
    if (!Array.isArray(symptoms)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const data = await getAppData();
    const results = forwardChaining(symptoms, data);
    return NextResponse.json({ results, symptoms: data.symptoms });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
