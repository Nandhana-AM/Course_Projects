import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from "./pages/Portfolio";
import Home from './pages/Home';
import CreatePort from './pages/CreatePort';
import CheckScore from './pages/CheckScore';


function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/createdportfolio" element={<Portfolio/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/createportfolio" element={<CreatePort/>}/>
        <Route path="/checkscore" element={<CheckScore/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
