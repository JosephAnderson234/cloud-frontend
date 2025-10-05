import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom"
import {router} from "@router/routes"
import AuthProvider from '@contexts/AuthContext.tsx'
import { NotificationProvider } from '@contexts/NotificationContext.tsx'
import "@styles/index.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
