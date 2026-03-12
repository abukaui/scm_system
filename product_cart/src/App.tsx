
import './App.css'
import { userContext } from './component/context'
import Header from './component/Header'




function App() {
 const users = {
  name: 'Surafel habtamu',
  email:'suraja@gmaii.com',
  isLoggedin:true
 }

  return (
    <> 
    <userContext.Provider value={users}>
          <Header /> 
    </userContext.Provider>
    </>
  )
}

export default App
