import { createBrowserRouter } from 'react-router-dom';
import Login from './Features/auth/pages/Login';
import Register from './Features/auth/pages/Register';
import Protected from './Features/auth/components/Protected';
import Home from './Features/Home/pages/Home';
import UploadSong from './Features/Home/component/UploadSong';
import MoodHistory from './Features/Home/component/MoodHistory';
import Messages from './Features/Home/component/messages';
import Profile from './Features/Home/component/Profile';
import NotFound from './Features/Home/component/NotFound';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Protected><Home /></Protected>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
 
  {
    path:"/upload",
    element: <UploadSong />
  },

   {
    path:"/mood-history",
    element: <MoodHistory />
  },

   {
    path:"/messages",
    element: <Messages />
  },

  {
    path:"/profile",
    element: <Profile />
  },

   {
    path:"*",
    element: <NotFound />
  },
  
  





  
]);