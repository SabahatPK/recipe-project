import React, { Component } from "react";
import dataRecipe from "../data/recipeData.json";
// import indgredientCategories from "../data/recipeCategories.json";
import Checkbox from "./checkbox";
import buildCategory from "./../utilities/buildIngredientCategoryList";

class Ingredients extends Component {
  state = {
    category: "",
    recipes: dataRecipe,
    indgredientCategories: buildCategory(),
    selectedCategory: "",
    selectedIngredients: [],
    winner: [],
    objOfCheckboxes: {},
  };

  //OUTS: should get data via this lifecycle hook rather than running function in state:
  // componentDidMount() {
  //   let indgredientCategories = buildCategory();
  //   this.setState({ indgredientCategories });
  // }

  handleProduceChange = (event) => {
    let category = this.state.category;
    category = event.target.value;
    let selectedCategory = this.state.indgredientCategories.filter(
      (each) => each.category === category
    );

    const obj = selectedCategory[0]["ingredients"].reduce(
      (o, key) => ({ ...o, [key]: false }),
      {}
    );

    let objOfCheckboxes = { ...obj, ...this.state.objOfCheckboxes };

    this.setState({ category, selectedCategory, objOfCheckboxes });
  };

  handleCheckboxChange = (changeEvent) => {
    const { name, checked } = changeEvent.target;

    let objOfCheckboxes = this.state.objOfCheckboxes;
    objOfCheckboxes[name] = checked;

    let selectedIngredients = this.state.selectedIngredients;
    if (checked === true && selectedIngredients.indexOf(name) < 0) {
      selectedIngredients.push(name);
    } else {
      selectedIngredients.splice(selectedIngredients.indexOf(name), 1);
    }

    this.setState({ selectedIngredients, objOfCheckboxes });
  };

  //Follow this: http://react.tips/checkboxes-in-react-16/
  createCheckbox = (option) => {
    return (
      <Checkbox
        label={option}
        isSelected={this.state.objOfCheckboxes[option]}
        onCheckboxChange={this.handleCheckboxChange}
        key={option}
      />
    );
  };

  createCheckboxes = () =>
    this.state.selectedCategory
      ? this.state.selectedCategory[0]["ingredients"].map(this.createCheckbox)
      : null;

  handleFormSubmit = (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

    let selectedIngredients = this.state.selectedIngredients;
    let winner = this.state.winner;
    winner = [];

    this.state.recipes.forEach(function (recipe) {
      let totalCount = 0;
      let match = 0;

      recipe["ingredients"].forEach(function (d) {
        totalCount += 1;

        if (!(selectedIngredients.indexOf(d[0]) < 0)) {
          match += 1;
        }
      });
      winner.push([recipe, match / totalCount]);
    });

    this.setState({ winner });
  };

  render() {
    let winnerToPrint = this.state.winner.filter((each) => each[1] > 0);

    return (
      <React.Fragment>
        {/* Future plans: https://www.w3schools.com/howto/howto_js_autocomplete.asp */}

        <div className="container">
          <select onChange={this.handleProduceChange}>
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
              <form onSubmit={this.handleFormSubmit}>
                {this.createCheckboxes()}

                <div className="form-group mt-2">
                  {/* <button
                    type="button"
                    className="btn btn-outline-primary mr-2"
                    onClick={this.selectAll}
                  >
                    Select All
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-primary mr-2"
                    onClick={this.deselectAll}
                  >
                    Deselect All
                  </button> */}

                  <button type="submit" className="btn btn-primary">
                    Show Me The Recipes!
                  </button>
                </div>
              </form>
            </div>
            <div className="col-sm-3">
              {this.state.selectedIngredients.length > 0 ? (
                <h6>Selected Ingredients:</h6>
              ) : null}

              <ul>
                {this.state.selectedIngredients.map((each) => (
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
                        You have {(each[1] * 100).toFixed(2)}% of the
                        ingredients.
                      </p>
                    </React.Fragment>
                  ))
                ) : (
                  <p>
                    {" "}
                    Add more ingredients to pantry then press Show Me The
                    Recipes!
                  </p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Ingredients;
