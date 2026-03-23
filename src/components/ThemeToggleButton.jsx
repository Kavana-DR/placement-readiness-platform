import React from 'react'
import { Moon, Sun } from 'lucide-react'
import Button from '../design-system/components/Button'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button variant="secondary" size="small" onClick={toggleTheme}>
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
      {isDark ? 'Light' : 'Dark'}
    </Button>
  )
}
