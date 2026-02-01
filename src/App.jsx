import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Browse from "./Pages/Browse";
import Top from "./Pages/Top";
import New from "./Pages/New";
import Detail from "./Pages/Detail";
import Search from "./Pages/Search";


function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/home" element={<Home />} />
        <Route path="/top" element={<Top />} />
        <Route path="/new" element={<New />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/search" element={<Search />} />
      </Routes>

      
    </Router>
  );
}

export default App;
