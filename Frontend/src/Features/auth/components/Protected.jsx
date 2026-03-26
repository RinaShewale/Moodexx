import React from 'react';
import { useAuth } from '../hook/useAuth';
import { Navigate } from 'react-router-dom';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}>
      <p>Loading...</p>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default Protected;