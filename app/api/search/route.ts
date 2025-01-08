import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import csvParser from 'csv-parser';
import { YelpItem } from '@/types';

const filePath = path.join(process.cwd(), 'yelp_database.csv');

const loadData = async (): Promise<YelpItem[]> => {
  const results: YelpItem[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        results.push({
          ID: parseInt(data.ID),
          Time_GMT: data.Time_GMT,
          Phone: data.Phone,
          Organization: data.Organization,
          OLF: data.OLF || null,
          Rating: parseFloat(data.Rating),
          NumberReview: parseInt(data.NumberReview),
          Category: data.Category,
          Country: data.Country,
          CountryCode: data.CountryCode,
          State: data.State,
          City: data.City,
          Street: data.Street,
          Building: data.Building,
        });
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  try {
    const data = await loadData();
    const filtered = data.filter((item) =>
      item.Organization.toLowerCase().includes(query.toLowerCase())
    );
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      results: paginated,
      total: filtered.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
