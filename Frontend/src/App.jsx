import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './App.routes';
import { AuthProvider } from './Features/auth/Auth.context';
import { SongProvider } from './Features/Home/Song.context';
import "./Features/Sheared/global.scss";

const App = () => {
  return (
    <AuthProvider>
      <SongProvider>
        <RouterProvider router={router} />
      </SongProvider>
    </AuthProvider>
  );
};

export default App;