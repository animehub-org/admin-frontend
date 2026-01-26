import "./css/base.scss"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { UserProvider } from "./contexts/UserContext.tsx";
import Home from "./pages/Home.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NewAnimePage from "./pages/creationPages/NewAnimePage.tsx";
import StateCreationPage from "./pages/creationPages/StateCreationPage.tsx";
import GenreCreationPage from "./pages/creationPages/GenreCreationPage.tsx";
import GenreHomePage from "./pages/homePages/GenreHome.tsx";
import CreatorCreationPage from "./pages/creationPages/CreatorCreationPage.tsx";
import ProducerCreationPage from "./pages/creationPages/ProducerCreationPage.tsx";
import StateHomePage from "./pages/homePages/StateHome.tsx";
import CreatorHomePage from "./pages/homePages/CreatorHome.tsx";
import ProducerHomePage from "./pages/homePages/ProducerHome.tsx";

function App() {

    return (
        <>
            <Router>
                <UserProvider>
                    <Routes>
                        <Route path="/anime/new" element={<NewAnimePage />} />
                        <Route path="/state/new" element={<StateCreationPage />} />
                        <Route path="/creator/new" element={<CreatorCreationPage />} />
                        <Route path="/producer/new" element={<ProducerCreationPage />} />

                        <Route path="/genre" element={<GenreHomePage />} />
                        <Route path="/genre/new" element={<GenreCreationPage></GenreCreationPage>} />

                        <Route path="/state" element={<StateHomePage />} />
                        <Route path="/creator" element={<CreatorHomePage />} />
                        <Route path="/producer" element={<ProducerHomePage />} />

                        <Route path="/" element={<LoginPage />} />
                        <Route path="/home" element={<Home />} />
                    </Routes>
                </UserProvider>
            </Router>
        </>
    )
}

export default App
