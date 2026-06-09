import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AdManager from '../shared/AdManager';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdManager />
      <Outlet />
    </div>
  );
}