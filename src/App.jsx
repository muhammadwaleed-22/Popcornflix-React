import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { HeroUIProvider, Button } from "@heroui/react";
import Navbar from "./Components/Navbar";
import Browse from "./Pages/Browse";

const Home = lazy(() => import("./Pages/Home"));
const Top = lazy(() => import("./Pages/Top"));
const New = lazy(() => import("./Pages/New"));
const Detail = lazy(() => import("./Pages/Detail"));
const Liked = lazy(() => import("./Pages/Liked"));

function App() {
  return (
    <HeroUIProvider>
      <Navbar />
      <Suspense fallback={<div style={{ padding: 20 }}><Button isLoading variant="light">
          Loading
        </Button></div>}>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/home" element={<Home />} />
          <Route path="/top" element={<Top />} />
          <Route path="/new" element={<New />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/liked" element={<Liked />} />
        </Routes>
      </Suspense>
    </HeroUIProvider>
  );
}

export default App;
