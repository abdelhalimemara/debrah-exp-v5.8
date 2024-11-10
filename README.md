# Debrah - your Properties well managed

A modern property management system built for real estate offices in Saudi Arabia, powered by React, Vite, and Supabase.

## Features

- **Multi-Office Support**: Each real estate office has its own secure workspace
- **Comprehensive Property Management**:
  - Property Owners
  - Buildings
  - Units
  - Tenants
  - Contracts
  - Payables & Receipts
- **Dashboard Analytics**: Real-time insights into property statistics
- **Secure Authentication**: Role-based access control
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Global Search**: Find any resource quickly with unified search
- **Office Settings**: Manage office profile, logo, and CR number
- **User Management**: Invite and manage team members
- **Profile Settings**: Personal user settings and preferences
- **Financial Management**: Track all financial transactions with categorized receipts

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Storage**: Supabase Storage for office logos

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── auth/         # Authentication components
│   ├── buildings/    # Building management components
│   ├── common/       # Shared components
│   ├── dashboard/    # Dashboard widgets
│   ├── layout/       # Layout components
│   ├── owners/       # Property owner components
│   ├── payables/     # Financial management components
│   ├── profile/      # Profile and settings components
│   ├── search/       # Global search components
│   ├── tenants/      # Tenant management components
│   └── units/        # Unit management components
├── hooks/            # Custom React hooks
├── lib/             # Utilities and API functions
├── pages/           # Page components
└── types/           # TypeScript type definitions
```

## Database Schema

The application uses a relational database with the following main tables:

### Core Tables

- `offices`: Real estate offices with logo storage
- `users`: Office staff members
- `owners`: Property owners
- `buildings`: Properties/Buildings
- `units`: Individual units within buildings
- `tenants`: Unit tenants
- `contracts`: Rental agreements
- `payables`: Payment records and receipts

### Key Features

- Row Level Security (RLS) policies ensure data isolation between offices
- Proper foreign key relationships and cascading deletes
- Comprehensive audit trails with created_at/updated_at timestamps
- JSONB columns for flexible metadata storage
- File storage for office logos

## Security Features

- Row Level Security (RLS) policies ensure data isolation between offices
- Authentication state management with Supabase Auth
- Protected routes with AuthGuard
- Secure API endpoints
- Office-specific data access control
- Secure file storage for office logos

## Recent Updates (v0.0.4)

- Added comprehensive payables management system
- Implemented categorized receipts (rent, insurance, maintenance, etc.)
- Added payment history to units and owners
- Enhanced financial tracking with payment types (incoming/outgoing)
- Added payment method tracking (bank transfer, cash, check)
- Improved receipt status management
- Added transaction reference tracking
- Enhanced receipt filtering and search capabilities
- Added receipt details page with full information
- Improved UI for financial management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
