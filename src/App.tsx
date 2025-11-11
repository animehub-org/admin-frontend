import "./css/base.scss"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {UserProvider} from "./contexts/UserContext.tsx";
import Home from "./pages/Home.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NewAnimePage from "./pages/creationPages/NewAnimePage.tsx";
import StateCreationPage from "./pages/creationPages/StateCreationPage.tsx";
import GenreCreationPage from "./pages/creationPages/GenreCreationPage.tsx";
import GenreHomePage from "./pages/homePages/GenreHome.tsx";

function App() {

    return (
        <>
            <Router>
               <UserProvider>
                   <Routes>
                       <Route path="/anime/new" element={<NewAnimePage/>}/>
                       <Route path="/state/new" element={<StateCreationPage/>}/>

                       <Route path="/genre" element={<GenreHomePage/>}/>
                       <Route path="/genre/new" element={<GenreCreationPage></GenreCreationPage>}/>
                       <Route path="/" element={<LoginPage/>}/>
                       <Route path="/home" element={<Home/>}/>
                   </Routes>
               </UserProvider>
            </Router>
        </>
     )
}

export default App
