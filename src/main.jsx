import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoginForm from "./pages/LoginForm.jsx";
import {BrowserRouter} from "react-router-dom";

// 1. Importe as ferramentas necessárias
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 2. Crie uma nova instância do client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
)

