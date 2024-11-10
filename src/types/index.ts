export interface Owner {
  id: string;
  full_name: string;
  email?: string;
  phone: string;
  national_id: string;
  status: 'active' | 'inactive';
  birthdate?: string;
  bank_name?: string;
  iban?: string;
  buildings_count: number;
  created_at: string;
  updated_at: string;
}