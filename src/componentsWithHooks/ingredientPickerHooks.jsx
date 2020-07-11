import React, { useState, useEffect, Fragment } from "react";
import dataRecipe from "../data/recipeData.json";
import buildCategory from "./../utilities/buildIngredientCategoryList";
import Checkbox from "./checkboxHooks";
import Autocomplete from "./autocompleteHooks";

function IngredientPickerHooks(props) {
  const [category, setCategory] = useState("");
  const [recipes] = useState(dataRecipe);
  const [indgredientCategories] = useState(buildCategory());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryFromAC, setSelectedCategoryFromAC] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [winner, setWinner] = useState([]);
  const [objOfCheckboxes, setObjOfCheckboxes] = useState({});
  const [winnerToPrint, setWinnerToPrint] = useState([]);

  function callbackSetIngredients(ingredientChild) {
    console.log(ingredientChild);
    let tempSelectedIngredients = selectedIngredients;
    let tempSelectedCategory = selectedCategory;
    if (tempSelectedIngredients.indexOf(ingredientChild) < 0) {
      tempSelectedIngredients.push(ingredientChild);
    } else {
      tempSelectedIngredients.splice(
        tempSelectedIngredients.indexOf(ingredientChild),
        1
      );
    }

    tempSelectedCategory = [
      {
        category: "produce",
        id: "001",
        ingredients: Array(11),
      },
    ];

    //START: Have to follow same user story as when they check a box from list.
    //1. Ingredient has to show up under "Selected Ingredients" on page
    //2. Checkbox has to be selected
    //3. Re-typing the ingredient should NOT delete it Selected Ingredients.
    //4. That should be with an X next to ingredient when user hovers over item.
    //Last item (4) is for both checkbox route and searchbox route.

    setSelectedIngredients(tempSelectedIngredients);

    setSelectedCategory(tempSelectedCategory); //This will vary dep on algo:
    //1. Find the obj that holds this ingredient in the indgredientCategories array
    //2. Get the value of that obj "category" property
    //3. Hardcode: Map that value to an index based on where it falls in the "produceSelect" select dropdown below.
    //4. Example: index 2 in "produceSelect" is "spices"

    intermediateAfterAutoComplete();
  }

  function intermediateAfterAutoComplete() {
    console.log(selectedIngredients); //returns proper value
    console.log(selectedCategory);

    //Have to replace the "2" with actual index based on other code that finds it.
    // document.getElementById("produceSelect").selectedIndex = "2";

    // setSelectedCategoryFromAC(
    //   document.getElementById("produceSelect").selectedIndex
    // );

    // handleProduceChange(undefined, "produce");
  }

  function handleProduceChange(event) {
    console.log("handleProduceChange is running now");

    let tempCategory = category;
    tempCategory = event.target.value;

    let tempSelectedCategory = indgredientCategories.filter(
      (each) => each.category === tempCategory
    );

    console.log(tempSelectedCategory);

    const obj = tempSelectedCategory[0]["ingredients"].reduce(
      (o, key) => ({ ...o, [key]: false }),
      {}
    );

    let tempObjOfCheckboxes = { ...obj, ...objOfCheckboxes };

    console.log(tempObjOfCheckboxes);

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
    console.log("createCheckbox running now");
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
    console.log(
      selectedCategory
        ? selectedCategory[0]["ingredients"].map(createCheckbox)
        : null
    );
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
  //1. Use this to define ingredient categories: https://edsoehnel.com/retail-cpg-grocery-categories/ or find another one?
  //2. Look at FCC Forum for answer on how to automate creation of JSON.
  //3. Email WashPo recipe authors and ask them if I can get permission and access to their ingredient lists?
  //4. ALso try PakistanEats creator, Purple Carrot recipes.
  return (
    <Fragment>
      <div className="container">
        <select onChange={handleProduceChange} id="produceSelect">
          <option value="instructions">What's in the pantry?</option>
          <option value="produce">Produce</option>
          <option value="spices">Spices</option>
          <option value="meatAndFish">Meat and Fish</option>
          <option value="grains">Grains</option>
          <option value="dairyAndEggs">Dairy and Eggs</option>
          <option value="condiments">Condiments</option>
        </select>

        <Autocomplete
          allIngredients={indgredientCategories}
          //Explanation: https://forum.freecodecamp.org/t/can-someone-check-code-for-sending-variable-from-child-to-parent-in-react/408975/2?u=sabbyiqbal
          parentCallback={callbackSetIngredients}
        />

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
