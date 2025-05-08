import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// theme provider
import { ThemeProvider } from './components/theme-provider.tsx'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
