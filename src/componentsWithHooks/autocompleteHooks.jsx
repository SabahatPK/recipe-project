import React, { useState, Fragment } from "react";

const Autocomplete = (props) => {
  const [activeOption, setActiveOption] = useState(0);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [userInput, setUserInput] = useState("");

  function onChange(e) {
    const options = [];

    for (let index = 0; index < props.allIngredients.length; index++) {
      options.push(...props.allIngredients[index].ingredients);
    }

    const userInput = e.currentTarget.value;
    const filteredOptions = options.filter(
      (option) => option.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    setActiveOption(0);
    setFilteredOptions(filteredOptions);
    setShowOptions(true);
    setUserInput(userInput);
  }

  function onClick(e) {
    setActiveOption(0);
    setFilteredOptions([]);
    setShowOptions(false);
    console.log(e.currentTarget.innerText); //send this to parent as selected ingredient
    sendIngredients(e.currentTarget.innerText);
    setUserInput(e.currentTarget.innerText);
  }

  function onKeyDown(e) {
    if (e.keyCode === 13) {
      setActiveOption(0);
      setShowOptions(false);
      setUserInput(filteredOptions[activeOption]);
      sendIngredients(filteredOptions[activeOption]);
    } else if (e.keyCode === 38) {
      if (activeOption === 0) {
        return;
      }
      setActiveOption(activeOption - 1);
    } else if (e.keyCode === 40) {
      if (activeOption - 1 === filteredOptions.length) {
        return;
      }
      setActiveOption(activeOption + 1);
    }
  }

  function sendIngredients(ingredient) {
    props.parentCallback(ingredient);
  }

  let optionList;
  if (showOptions && userInput) {
    if (filteredOptions.length) {
      optionList = (
        <ul className="options">
          {filteredOptions.map((optionName, index) => {
            let className;
            if (index === activeOption) {
              className = "option-active";
            }
            return (
              <li className={className} key={optionName} onClick={onClick}>
                {optionName}
              </li>
            );
          })}
        </ul>
      );
    } else {
      optionList = (
        <div className="no-options">
          <em>No Option!</em>
        </div>
      );
    }
  }

  return (
    <Fragment>
      <div className="search">
        <input
          type="text"
          className="search-box"
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <input type="submit" className="search-btn" />
      </div>
      {optionList}
    </Fragment>
  );
};

export default Autocomplete;
