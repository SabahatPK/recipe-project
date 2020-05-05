import React from "react";
import Ingredients from "./components/ingredientPicker";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <Navbar fixed="top" expand="lg" variant="light" bg="light">
        <Navbar.Brand href="#">What Should I Cook Tonight</Navbar.Brand>
      </Navbar>
      <main>
        <div className="container">
          <Ingredients />
        </div>
      </main>
    </React.Fragment>
  );
}

export default App;