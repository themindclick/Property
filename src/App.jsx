import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import { PropertiesProvider } from './context/PropertiesContext.jsx';
import { VisitsProvider } from './context/VisitsContext.jsx';
import AutomationPage from './pages/AutomationPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import InboxPage from './pages/InboxPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import PropertyFormPage from './pages/PropertyFormPage.jsx';

export default function App() {
  return (
    <PropertiesProvider>
      <VisitsProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/new" element={<PropertyFormPage />} />
            <Route path="/inventory/:id/edit" element={<PropertyFormPage />} />
            <Route path="/automation" element={<AutomationPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </VisitsProvider>
    </PropertiesProvider>
  );
}
