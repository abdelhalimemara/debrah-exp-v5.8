export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPhoneNumber(phone: string): string {
  // Format Saudi phone numbers
  if (phone.startsWith('+966')) {
    const cleaned = phone.slice(4);
    return `+966 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}