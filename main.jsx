import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from './routes/Routes';
import AuthProvider from './providers/AuthProvider';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {/* --- ADD THE FALLBACK ELEMENT HERE --- */}
        <RouterProvider 
            router={router} 
            fallbackElement={<div className="flex justify-center mt-10"><span className="loading loading-spinner loading-lg"></span></div>}
        />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
)