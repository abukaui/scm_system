import  { createContext, useContext } from 'react'
type user = {
    name: string,
    email:string,
    isLoggedin:boolean
}
  export  const userContext = createContext< user | undefined> (undefined) 
  
export const useUserContext = () => {
    const context = useContext(userContext)
    if (!context) {
        throw new Error('useUserContext must be used within a userContext.Provider')
    }
    return context
}