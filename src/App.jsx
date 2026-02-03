import React from "react";
import { Routes, Route, useNavigate, useHref } from "react-router-dom"; // Add these
import { HeroUIProvider } from "@heroui/react";
import Navbar from "./Components/Navbar";
import Browse from "./Pages/Browse";
import Home from "./Pages/Home";
import Top from "./Pages/Top";
import New from "./Pages/New";
import Detail from "./Pages/Detail";
import Search from "./Pages/Search";

function App() {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/home" element={<Home />} />
        <Route path="/top" element={<Top />} />
        <Route path="/new" element={<New />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </HeroUIProvider>
  );}

export default App;
