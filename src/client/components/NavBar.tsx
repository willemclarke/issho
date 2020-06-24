import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';

export const NavBar = () => {
  return (
    <Link to="/">
      <Layout.Header style={{ backgroundColor: '#121212' }}>
        <span style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>gurūpu</span>
      </Layout.Header>
    </Link>
  );
};
