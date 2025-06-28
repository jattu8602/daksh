'use client'

import { Provider } from 'react-redux'
import { store } from './store/store'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  )
}
