import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/shared/Header.jsx';
import SiteFooter from '../components/shared/SiteFooter.jsx';

export default function MarketingLayout() {
  return (
    <>
      <Header variant="marketing" />
      <Outlet />
      {/* Footer is rendered by individual pages to allow page-specific footers */}
    </>
  );
}
