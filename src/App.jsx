import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './Admin/Layout';
import AdminLogin from './Admin/AdminLogin';
import Dashboard from './Admin/Dashboard';
import UserManagement from './Admin/UserManagement';
import EditPage from './Admin/EditPage'; 
import Settings from './Admin/Settings';
import PublicationManagement from './Admin/PublicationManagement';
import FDLectureManagement from './Admin/FDLectureManagement';
import ConferenceManagement from './Admin/ConferenceManagement';
import './index.css';
import Highlights from './Admin/Home/Highlights';
import Events from './Admin/Home/Events';
import Partners from './Admin/Home/Partners';
import Gallery from './Admin/Home/Gallery';
import Archives from './Admin/Home/Archives';
import News from './Admin/About/News';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="edit/:id" element={<EditPage />} />
            <Route path="/admin/highlights" element={<Highlights/>} />
            <Route path="/admin/events" element={<Events/>} />
            <Route path="/admin/partners" element={<Partners/>} />
            <Route path="/admin/gallery" element={<Gallery/>} />
            <Route path="/admin/archives" element={<Archives/>} />
            <Route path="/admin/news" element={<News/>} />
                          <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<Settings />} />
              <Route path="publications" element={<PublicationManagement />} />
              <Route path="fdlectures" element={<FDLectureManagement />} />
              <Route path="conferences" element={<ConferenceManagement />} />
              <Route path="edit/:id" element={<EditPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;