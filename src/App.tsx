import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { OwnersPage } from './pages/owners/OwnersPage';
import { OwnerDetailPage } from './pages/owners/OwnerDetailPage';
import { BuildingsPage } from './pages/buildings/BuildingsPage';
import { UnitsPage } from './pages/units/UnitsPage';
import { TenantsPage } from './pages/tenants/TenantsPage';
import { UnitInformationPage } from './pages/units/UnitInformationPage';
import { TenantDetailPage } from './pages/tenants/TenantDetailPage';
import { ContractsPage } from './pages/contracts/ContractsPage';
import { ContractDetailPage } from './pages/contracts/ContractDetailPage';
import { PayablesPage } from './pages/payables/PayablesPage';
import { PayableDetailPage } from './pages/payables/PayableDetailPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { ConnectorsPage } from './pages/connectors/ConnectorsPage';
import { ListingsPage } from './pages/listings/ListingsPage';
import { ExpensesPage } from './pages/finances/ExpensesPage';
import { FinanceReportPage } from './pages/finances/FinanceReportPage';
import { AuthGuard } from './components/auth/AuthGuard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/owners"
            element={
              <AuthGuard>
                <OwnersPage />
              </AuthGuard>
            }
          />
          <Route
            path="/owners/:id"
            element={
              <AuthGuard>
                <OwnerDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path="/buildings"
            element={
              <AuthGuard>
                <BuildingsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/units"
            element={
              <AuthGuard>
                <UnitsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/tenants"
            element={
              <AuthGuard>
                <TenantsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/units/:id"
            element={
              <AuthGuard>
                <UnitInformationPage />
              </AuthGuard>
            }
          />
          <Route
            path="/tenants/:id"
            element={
              <AuthGuard>
                <TenantDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path="/contracts"
            element={
              <AuthGuard>
                <ContractsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/contracts/:id"
            element={
              <AuthGuard>
                <ContractDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path="/payables"
            element={
              <AuthGuard>
                <PayablesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/payables/:id"
            element={
              <AuthGuard>
                <PayableDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path="/expenses"
            element={
              <AuthGuard>
                <ExpensesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/finance-report"
            element={
              <AuthGuard>
                <FinanceReportPage />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            }
          />
          <Route
            path="/connectors"
            element={
              <AuthGuard>
                <ConnectorsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/listings"
            element={
              <AuthGuard>
                <ListingsPage />
              </AuthGuard>
            }
          />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}