import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from './App.tsx'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import AuthProvider from './contexts/AuthContext.tsx'

//Swiper
import {register} from 'swiper/element/bundle'
register();

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

//hot-toast
import { Toaster } from 'react-hot-toast';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
