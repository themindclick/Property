import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/inbox"
          element={
            <PlaceholderPage
              title="WhatsApp Live Inbox"
              description="Chats, AI takeover toggle and the buyer context drawer will live here."
            />
          }
        />
        <Route
          path="/inventory"
          element={
            <PlaceholderPage
              title="Property Inventory"
              description="Listings grid, filters and the AI copywriter will live here."
            />
          }
        />
        <Route
          path="/automation"
          element={
            <PlaceholderPage
              title="AI Automation Rules"
              description="The Day 1, Day 3 and Day 14 follow-up flow builder will live here."
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <PlaceholderPage
              title="Site-Visit Calendar"
              description="Booked site visits and agent availability will live here."
            />
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
