import {createContext, useCallback, useMemo, useState} from "react"

export const AppContext = createContext(null)

export const AppContextProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const clearUserDetails = useCallback(() => setUser(null), [])

  const value = useMemo(() => ({user, setUser, clearUserDetails}), [user, clearUserDetails])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}