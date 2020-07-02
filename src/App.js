import React from "react";
import IngredientPickerHooks from "./componentsWithHooks/ingredientPickerHooks";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <Navbar fixed="top" expand="lg" variant="light" bg="light">
        <Navbar.Brand href="#">What Should I Cook Tonight</Navbar.Brand>
        <Navbar.Text>
          <a
            target="_blank"
            href="https://github.com/SabahatPK/recipe-project-mobile"
          >
            (mobile version in progess)
          </a>
        </Navbar.Text>
      </Navbar>
      <main>
        <div className="container">
          <IngredientPickerHooks />
        </div>
      </main>
    </React.Fragment>
  );
}

export default App;
