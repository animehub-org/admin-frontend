import "./css/base.scss"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {UserProvider} from "./contexts/UserContext.tsx";
import Home from "./pages/Home.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NewAnimePage from "./pages/NewAnimePage.tsx";

function App() {

    return (
        <>
            <Router>
               <UserProvider>
                   <Routes>
                       <Route path="/anime/new" element={<NewAnimePage/>}/>
                       <Route path="/" element={<LoginPage/>}/>
                       <Route path="/home" element={<Home/>}/>
                   </Routes>
               </UserProvider>
            </Router>
        </>
     )
}

export default App
