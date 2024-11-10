import { pdfMake } from './pdf/fonts';
import { pdfStyles } from './pdf/styles';
import { imageToBase64, formatCategory } from './pdf/utils';
import type { Payable } from '../types';
import { formatCurrency } from './utils';

interface Office {
  name: string;
  logo_url: string | null;
  address: string;
  city: string;
  phone: string;
  email: string;
  cr_number: string;
}

export async function generateReceipt(payable: Payable, office: Office) {
  // Convert logo to base64 if exists
  const logoBase64 = office.logo_url ? await imageToBase64(office.logo_url) : '';

  // Format dates
  const dueDate = new Date(payable.due_date).toLocaleDateString('en-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const paymentDate = payable.payment_date ? new Date(payable.payment_date).toLocaleDateString('en-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';

  // Create document definition
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 60],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
      color: '#334155'
    },
    watermark: { text: payable.status === 'paid' ? 'PAID' : '', color: '#22c55e', opacity: 0.1, bold: true },
    content: [
      // Header with logo and office info
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: office.name, style: 'header' },
              { text: office.address, style: 'subheader' },
              { text: office.city, style: 'subheader' },
              { text: office.phone, style: 'subheader' },
              { text: office.email, style: 'subheader' },
              { text: `CR: ${office.cr_number}`, style: 'subheader' },
            ]
          },
          logoBase64 ? {
            width: 100,
            image: logoBase64,
            fit: [100, 100],
            alignment: 'right'
          } : {}
        ]
      },
      { text: '\n' },
      {
        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, color: '#e2e8f0' }]
      },
      { text: '\n' },

      // Receipt Title and Number
      { text: 'RECEIPT', style: 'receiptTitle' },
      { text: `Receipt #${payable.id.slice(0, 8).toUpperCase()}`, style: 'receiptNumber' },
      { text: '\n' },

      // Receipt Information
      {
        table: {
          headerRows: 1,
          widths: ['50%', '50%'],
          body: [
            [
              { text: 'Receipt Information', style: 'sectionHeader', colSpan: 2 },
              {}
            ],
            [
              { text: 'Amount:', bold: true },
              { text: formatCurrency(payable.amount) }
            ],
            [
              { text: 'Category:', bold: true },
              { text: formatCategory(payable.category) }
            ],
            [
              { text: 'Type:', bold: true },
              { text: payable.type.charAt(0).toUpperCase() + payable.type.slice(1) }
            ],
            [
              { text: 'Status:', bold: true },
              { text: payable.status.toUpperCase() }
            ],
            [
              { text: 'Due Date:', bold: true },
              { text: dueDate }
            ],
            [
              { text: 'Payment Date:', bold: true },
              { text: paymentDate }
            ],
            [
              { text: 'Payment Method:', bold: true },
              { text: payable.payment_method ? payable.payment_method.replace('_', ' ').toUpperCase() : 'N/A' }
            ],
            [
              { text: 'Reference:', bold: true },
              { text: payable.transaction_ref || 'N/A' }
            ]
          ]
        }
      },
      { text: '\n' },

      // Property and Tenant Information
      {
        table: {
          headerRows: 1,
          widths: ['50%', '50%'],
          body: [
            [
              { text: 'Property Information', style: 'sectionHeader', colSpan: 2 },
              {}
            ],
            [
              { text: 'Building:', bold: true },
              { text: payable.contract?.unit?.building?.name || 'N/A' }
            ],
            [
              { text: 'Unit:', bold: true },
              { text: payable.contract?.unit?.unit_number || 'N/A' }
            ],
            [
              { text: 'Tenant:', bold: true },
              { text: payable.contract?.tenant?.full_name || 'N/A' }
            ]
          ]
        }
      },

      // Notes if any
      payable.notes ? {
        table: {
          headerRows: 1,
          widths: ['100%'],
          body: [
            [{ text: 'Notes', style: 'sectionHeader' }],
            [{ text: payable.notes }]
          ]
        }
      } : {},

      // Signatures
      { text: '\n\n' },
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: '_____________________', alignment: 'center' },
              { text: 'Tenant Signature', style: 'signature' }
            ]
          },
          {
            width: '*',
            stack: [
              { text: '_____________________', alignment: 'center' },
              { text: 'Office Signature', style: 'signature' }
            ]
          }
        ]
      },

      // Footer
      {
        text: [
          { text: 'Generated on: ', color: '#64748b' },
          { text: new Date().toLocaleString('en-SA'), color: '#64748b' }
        ],
        style: 'footer',
        alignment: 'center',
        fontSize: 8,
        margin: [0, 20, 0, 0]
      }
    ],
    styles: {
      ...pdfStyles,
      footer: {
        fontSize: 8,
        color: '#64748b',
        margin: [0, 20, 0, 0]
      }
    }
  };

  return pdfMake.createPdf(docDefinition);
}