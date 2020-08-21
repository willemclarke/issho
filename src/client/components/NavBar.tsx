import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

const BrandNav = () => {
  return (
    <Link to="/">
      <span style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>issho</span>
    </Link>
  );
};

const GitHub = () => {
  return (
    <a href="https://github.com/willemclarke">
      <span style={{ marginLeft: '1rem', fontSize: '2rem', color: 'white' }}>
        <GithubOutlined />
      </span>
    </a>
  );
};

export const NavBar = () => {
  return (
    <Layout.Header style={{ backgroundColor: '#121212', height: '64px' }}>
      <BrandNav />
      <GitHub />
    </Layout.Header>
  );
};
