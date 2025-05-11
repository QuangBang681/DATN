import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Importing Home component
import Cam from './Cam';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';
import Page6 from './Page6';
import Page7 from './Page7';

export const GlobalContext = createContext();

function App() {

  const [globalVar1, setGlobalVar1] = useState("Initial value for Var 1");
  const [globalVar2, setGlobalVar2] = useState("Initial value for Var 2");
  const [globalVar3, setGlobalVar3] = useState("Initial value for Var 3");
  const [globalVar4, setGlobalVar4] = useState("Initial value for Var 4");
  const [globalVar5, setGlobalVar5] = useState("Initial value for Var 5");
  const [globalVar6, setGlobalVar6] = useState("Initial value for Var 6");

  const [flag1, setFlag1] = useState(true);
  const [flag2, setFlag2] = useState(true);
  const [flag3, setFlag3] = useState(true);
  const [flag4, setFlag4] = useState(true);
  const [flag5, setFlag5] = useState(true);
  const [flag6, setFlag6] = useState(true);

  return (
    // Wrap the Router with GlobalContext Provider
    <GlobalContext.Provider
      value={{
        globalVar1,
        setGlobalVar1,
        globalVar2,
        setGlobalVar2,
        globalVar3,
        setGlobalVar3,
        globalVar4,
        setGlobalVar4,
        globalVar5,
        setGlobalVar5,
        globalVar6,
        setGlobalVar6,

        flag1,
        setFlag1,
        flag2,
        setFlag2,
        flag3,
        setFlag3,
        flag4,
        setFlag4,
        flag5,
        setFlag5,
        flag6,
        setFlag6,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cam" element={<Cam />} />
          <Route path="/page-one" element={<Page1 />} />
          <Route path="/page-two" element={<Page2 />} />
          <Route path="/page-three" element={<Page3 />} />
          <Route path="/page-four" element={<Page4 />} />
          <Route path="/page-five" element={<Page5 />} />
          <Route path="/page-six" element={<Page6 />} />
          <Route path="/page-seven" element={<Page7 />} />
        </Routes>
      </Router>
    </GlobalContext.Provider>
  );
}

export default App;
