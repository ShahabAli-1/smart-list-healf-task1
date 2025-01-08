export interface YelpItem {
  ID: number;
  Time_GMT: string;
  Phone: string;
  Organization: string;
  OLF?: string | null;
  Rating: number;
  NumberReview: number;
  Category: string;
  Country: string;
  CountryCode: string;
  State: string;
  City: string;
  Street: string;
  Building: string;
}
