import React, { useState, useEffect, Fragment } from "react";
import dataRecipe from "../data/recipeData.json";
import buildCategory from "./../utilities/buildIngredientCategoryList";
import Checkbox from "./checkboxHooks";

function IngredientPickerHooks(props) {
  const [category, setCategory] = useState("");
  const [recipes] = useState(dataRecipe);
  const [indgredientCategories] = useState(buildCategory());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [winner, setWinner] = useState([]);
  const [objOfCheckboxes, setObjOfCheckboxes] = useState({});
  const [winnerToPrint, setWinnerToPrint] = useState([]);

  function handleProduceChange(event) {
    let tempCategory = category;
    tempCategory = event.target.value;

    let tempSelectedCategory = indgredientCategories.filter(
      (each) => each.category === tempCategory
    );

    const obj = tempSelectedCategory[0]["ingredients"].reduce(
      (o, key) => ({ ...o, [key]: false }),
      {}
    );

    let tempObjOfCheckboxes = { ...obj, ...objOfCheckboxes };

    setCategory(tempCategory);
    setSelectedCategory(tempSelectedCategory);
    setObjOfCheckboxes(tempObjOfCheckboxes);
  }

  function handleCheckboxChange(changeEvent) {
    const { name, checked } = changeEvent.target;

    let tempObjOfCheckboxes = { ...objOfCheckboxes };
    tempObjOfCheckboxes[name] = checked;

    let tempSelectedIngredients = selectedIngredients;
    if (checked === true && tempSelectedIngredients.indexOf(name) < 0) {
      tempSelectedIngredients.push(name);
    } else {
      tempSelectedIngredients.splice(tempSelectedIngredients.indexOf(name), 1);
    }

    setSelectedIngredients(tempSelectedIngredients);
    setObjOfCheckboxes(tempObjOfCheckboxes);
  }

  function createCheckbox(option) {
    return (
      <Checkbox
        label={option}
        isSelected={objOfCheckboxes[option]}
        onCheckboxChange={handleCheckboxChange}
        key={option}
      />
    );
  }

  function createCheckboxes() {
    return selectedCategory
      ? selectedCategory[0]["ingredients"].map(createCheckbox)
      : null;
  }

  function handleFormSubmit(formSubmitEvent) {
    formSubmitEvent.preventDefault();

    let tempSelectedIngredients = selectedIngredients;

    let tempWinner = winner;
    tempWinner = [];

    recipes.forEach(function (recipe) {
      let totalCount = 0;
      let match = 0;

      recipe["ingredients"].forEach(function (d) {
        totalCount += 1;

        if (!(tempSelectedIngredients.indexOf(d[0]) < 0)) {
          match += 1;
        }
      });
      tempWinner.push([recipe, match / totalCount]);
    });

    let tempWinnerToPrint = tempWinner.filter((each) => each[1] > 0);
    setWinner(tempWinner);
    setWinnerToPrint(tempWinnerToPrint);
  }

  //Confirm that empty array (see Mosh video) in useEffect function below is actually what I want.
  useEffect(() => {
    const myIngredients = localStorage.getItem("my-ingredients");
    const myCheckedBoxes = localStorage.getItem("my-checked-boxes");
    const myWinningRecipes = localStorage.getItem("my-winning-recipes");

    if (myIngredients) {
      setSelectedIngredients(JSON.parse(myIngredients));
      setObjOfCheckboxes(JSON.parse(myCheckedBoxes));
      setWinnerToPrint(JSON.parse(myWinningRecipes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("my-ingredients", JSON.stringify(selectedIngredients));
    localStorage.setItem("my-checked-boxes", JSON.stringify(objOfCheckboxes));
    localStorage.setItem("my-winning-recipes", JSON.stringify(winnerToPrint));
  });

  //OUTS - would be great to save the dropdown to the last category that was selected but
  //I think that requires more than just saving the last category that was selected;
  //have to actually change dropdown.
  return (
    <Fragment>
      <div className="container">
        <select onChange={handleProduceChange}>
          <option value="instructions">Select a category</option>
          <option value="produce">Produce</option>
          <option value="spices">Spices</option>
          <option value="meatAndFish">Meat and Fish</option>
          <option value="grains">Grains</option>
          <option value="dairyAndEggs">Dairy and Eggs</option>
          <option value="condiments">Condiments</option>
        </select>

        <div className="row mt-5">
          <div className="col-sm-6">
            <form onSubmit={handleFormSubmit}>
              {createCheckboxes()}

              <div className="form-group mt-2">
                <button type="submit" className="btn btn-primary">
                  Show Me The Recipes!
                </button>
              </div>
            </form>
          </div>

          <div className="col-sm-3">
            {selectedIngredients.length > 0 ? (
              <h6>Selected Ingredients:</h6>
            ) : null}

            <ul>
              {selectedIngredients.map((each) => (
                <li key={each}>{each}</li>
              ))}
            </ul>
          </div>

          <div className="col-sm-3">
            <h6>Winning Recipe(s): </h6>

            <ul>
              {winnerToPrint.length > 0 ? (
                winnerToPrint.map((each) => (
                  <React.Fragment key={each[0]["recipeName"]}>
                    <li>
                      <a
                        href={each[0]["URL"]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {each[0]["recipeName"]}
                      </a>
                    </li>{" "}
                    <p>
                      You have {(each[1] * 100).toFixed(2)}% of the ingredients.
                    </p>
                  </React.Fragment>
                ))
              ) : (
                <p>
                  {" "}
                  Add more ingredients to pantry then press Show Me The Recipes!
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default IngredientPickerHooks;
