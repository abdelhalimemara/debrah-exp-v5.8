import { supabase } from './supabase';

export type NotificationType = 
  | 'contract_created'
  | 'tenant_added'
  | 'unit_added'
  | 'invoice_issued'
  | 'rent_due'
  | 'payout_created'
  | 'expense_added';

export interface NotificationMetadata {
  contract_id?: string;
  tenant_id?: string;
  unit_id?: string;
  payable_id?: string;
  payout_id?: string;
  expense_id?: string;
  amount?: number;
  due_date?: string;
}

export interface Notification {
  id: string;
  created_at: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  metadata: NotificationMetadata;
  office_id: string;
}

export async function createNotification(
  type: NotificationType,
  title: string,
  message: string,
  metadata: NotificationMetadata
) {
  try {
    const officeId = localStorage.getItem('office_id');
    if (!officeId) {
      throw new Error('No office ID found');
    }

    const { error } = await supabase
      .from('notifications')
      .insert([{
        type,
        title,
        message,
        metadata,
        office_id: officeId,
        is_read: false
      }]);

    if (error) throw error;
  } catch (err) {
    console.error('Error creating notification:', err);
    throw err;
  }
}