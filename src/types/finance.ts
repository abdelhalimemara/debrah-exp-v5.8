export type PayoutType = 'rent' | 'maintenance' | 'other';
export type PayoutStatus = 'pending' | 'paid' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'cash' | 'check';

export interface OwnerPayout {
  id: string;
  created_at: string;
  updated_at: string;
  office_id: string;
  owner_id: string;
  unit_id?: string;
  amount: number;
  payout_date: string;
  period_start: string;
  period_end: string;
  status: PayoutStatus;
  payout_type: PayoutType;
  payment_method?: PaymentMethod;
  transaction_ref?: string;
  notes?: string;
  attachments: string[];
  owner?: {
    full_name: string;
  };
  unit?: {
    unit_number: string;
    building?: {
      name: string;
    };
  };
}