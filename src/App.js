import React from "react";
import { BrowserRouter as HashRouter, Route } from "react-router-dom";
import { Padres } from "./pages/Padres";
import { Hijos } from "./pages/Hijos";
import Home from "./pages/Home";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route exact path="/padres" component={Padres} />
        <Route exact path="/hijos" component={Hijos} />
      </div>
    </HashRouter>
  );
}

export default App;
