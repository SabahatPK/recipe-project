import React, { useState, Fragment } from "react";
import dataRecipe from "../data/recipeData.json";
import buildCategory from "./../utilities/buildIngredientCategoryList";
import Checkbox from "./checkboxHooks";

function IngredientPickerHooks(props) {
  const [category, setCategory] = useState("");
  const [recipes, setRecipes] = useState(dataRecipe);
  const [indgredientCategories, setIndgredientCategories] = useState(
    buildCategory()
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [winner, setWinner] = useState([]);
  const [objOfCheckboxes, setObjOfCheckboxes] = useState({});

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

    console.log(obj);

    let tempObjOfCheckboxes = { ...obj, ...objOfCheckboxes };

    console.log(tempObjOfCheckboxes);

    setCategory(tempCategory);
    setSelectedCategory(tempSelectedCategory);
    setObjOfCheckboxes(tempObjOfCheckboxes);
  }

  function handleCheckboxChange(changeEvent) {
    const { name, checked } = changeEvent.target;

    let tempObjOfCheckboxes = objOfCheckboxes;
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
    console.log(option);

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

  return (
    <Fragment>
      <div>
        <select onChange={handleProduceChange}>
          <option value="instructions">Select a category</option>
          <option value="produce">Produce</option>
          <option value="spices">Spices</option>
          <option value="meatAndFish">Meat and Fish</option>
          <option value="grains">Grains</option>
          <option value="dairyAndEggs">Dairy and Eggs</option>
          <option value="condiments">Condiments</option>
        </select>
      </div>

      <div className="col-sm-6">
        <form>
          {createCheckboxes()}

          <div className="form-group mt-2">
            <button type="submit" className="btn btn-primary">
              Show Me The Recipes!
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default IngredientPickerHooks;
