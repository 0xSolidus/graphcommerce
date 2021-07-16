import { useRef } from 'react'
import appShellHeaderContext, {
  AppShellHeaderContext,
} from '../AppShellHeader/appShellHeaderContext'

type AppShellProviderProps = {
  children: React.ReactNode
}

export default function AppShellProvider(props: AppShellProviderProps) {
  const { children } = props
  const context: AppShellHeaderContext = {
    titleRef: useRef<HTMLDivElement>(null),
    contentHeaderRef: useRef<HTMLDivElement>(null),
    isTransparent: false,
  }

  return <appShellHeaderContext.Provider value={context}>{children}</appShellHeaderContext.Provider>
}
