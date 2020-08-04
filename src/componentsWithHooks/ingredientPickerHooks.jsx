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
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [winner, setWinner] = useState([]);
  const [objOfCheckboxes, setObjOfCheckboxes] = useState({});
  const [winnerToPrint, setWinnerToPrint] = useState([]);

  function callbackSetIngredients(ingredientChild, ingredientCategory) {
    document.getElementById("produceSelect").selectedIndex = [
      "instructions",
      "produce",
      "spices",
      "meatAndFish",
      "grains",
      "dairyAndEggs",
      "condiments",
    ].indexOf(ingredientCategory);

    let tempCategory = category;
    tempCategory = ingredientCategory;

    let tempSelectedCategory = indgredientCategories.filter(
      (each) => each.category === tempCategory
    );

    const obj = tempSelectedCategory[0]["ingredients"].reduce(
      (o, key) => ({ ...o, [key]: false }),
      {}
    );

    let tempObjOfCheckboxes = { ...obj, ...objOfCheckboxes };

    tempObjOfCheckboxes[ingredientChild] = true;

    setCategory(tempCategory);
    setSelectedCategory(tempSelectedCategory);
    setObjOfCheckboxes(tempObjOfCheckboxes);

    handleCheckboxChange(undefined, ingredientChild, undefined);

    // OUTS: Add Firebase backend

    //OUTS: Have to follow same user story as when they check a box from list.
    //1. Ingredient has to show up under "Selected Ingredients" on page - DONE
    //2. Checkbox has to be selected - DONE
    //3. Re-typing the ingredient should NOT delete it Selected Ingredients - ?
    //4. That should be with an X next to ingredient when user hovers over item
    //Last item (4) is for both checkbox route and searchbox route.
  }

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

  //START HERE: trigger this event from handleClickIngredient() and have it DELETE from selectedIngredients
  function handleCheckboxChange(changeEvent, dataFromAC, dataFromClick) {
    if (changeEvent) {
      const { name, checked } = changeEvent.target;

      let tempObjOfCheckboxes = { ...objOfCheckboxes };

      tempObjOfCheckboxes[name] = checked;

      let tempSelectedIngredients = selectedIngredients;
      if (checked === true && tempSelectedIngredients.indexOf(name) < 0) {
        tempSelectedIngredients.push(name);
      } else {
        tempSelectedIngredients.splice(
          tempSelectedIngredients.indexOf(name),
          1
        );
      }

      setSelectedIngredients(tempSelectedIngredients);
      setObjOfCheckboxes(tempObjOfCheckboxes);
    } else if (dataFromAC) {
      let tempSelectedIngredients = selectedIngredients;

      if (tempSelectedIngredients.indexOf(dataFromAC) < 0) {
        tempSelectedIngredients.push(dataFromAC);
      }

      setSelectedIngredients(tempSelectedIngredients);
    } else {
      console.log("From handleCheckboxChange " + dataFromClick);
      let tempSelectedIngredients = selectedIngredients;

      tempSelectedIngredients.splice(
        tempSelectedIngredients.indexOf(dataFromClick),
        1
      );

      console.log(tempSelectedIngredients);
      console.log(objOfCheckboxes);
      setSelectedIngredients(tempSelectedIngredients);
    }
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

  function handleClickIngredient(input) {
    console.log("====================================");
    console.log("From handle click" + input);

    handleCheckboxChange(undefined, undefined, input);
  }

  //OUTS - Confirm that empty array (see Mosh video) in useEffect function below is actually what I want.
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

  //OUTS -
  //1. Use this to define ingredient categories: https://edsoehnel.com/retail-cpg-grocery-categories/ or find another one?
  //2. Look at FCC Forum for answer on how to automate creation of JSON.
  //3. Email WashPo recipe authors and ask them if I can get permission and access to their ingredient lists?
  //4. Also try PakistanEats creator, Purple Carrot recipes.
  return (
    <Fragment>
      <div className="step1a">
        <h5>STEP ONE: Pick your ingredients!</h5>
      </div>
      <div className="step1b">
        <select onChange={handleProduceChange} id="produceSelect">
          <option value="instructions">What's in the pantry?</option>
          <option value="produce">Produce</option>
          <option value="spices">Spices</option>
          <option value="meatAndFish">Meat and Fish</option>
          <option value="grains">Grains</option>
          <option value="dairyAndEggs">Dairy and Eggs</option>
          <option value="condiments">Condiments</option>
        </select>
      </div>

      <div className="step1c">
        <Autocomplete
          allIngredients={indgredientCategories}
          //Explanation: https://forum.freecodecamp.org/t/can-someone-check-code-for-sending-variable-from-child-to-parent-in-react/408975/2?u=sabbyiqbal
          parentCallback={callbackSetIngredients}
        />
      </div>

      <div className="step1d">
        <ul>
          {selectedIngredients.map((each) => (
            <li
              key={each}
              onClick={() => {
                handleClickIngredient(each);
              }}
            >
              {each}
            </li>
          ))}
        </ul>
      </div>

      {/* Start here: is it possible to get the list into seperate divs if it's beyond a certain length? */}
      {/* ALSO: link up Firebase backend: https://forum.freecodecamp.org/t/how-to-add-firebase-to-react-app/413372/2 */}

      <div className="step2a">
        <h5>STEP TWO: Find Your Recipes!</h5>
      </div>
      <div className="step2b">
        <form onSubmit={handleFormSubmit}>
          <div className="form-group mt-2">
            <button type="submit" className="btn btn-primary">
              Show Me The Recipes!
            </button>
          </div>
          {createCheckboxes()}
        </form>
      </div>

      <div className="step2c">
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
    </Fragment>
  );
}

export default IngredientPickerHooks;
