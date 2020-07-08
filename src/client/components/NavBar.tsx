import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';

export const NavBar = () => {
  return (
    <Layout.Header style={{ backgroundColor: '#121212' }}>
      <Link to="/">
        <span style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>issho</span>
      </Link>
    </Layout.Header>
  );
};
