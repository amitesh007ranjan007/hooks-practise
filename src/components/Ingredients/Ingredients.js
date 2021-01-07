import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const ingredientsHandler = async (ingredient) => {
    const response = await fetch('https://react-hooks-update-f7413-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    })
    const responseData = await response.json()
      setUserIngredients(prevState => (
      [...prevState, {id: responseData.name, ...ingredient}]
    ))
  }
  const removeIngredientHandler = (id) => {
    setUserIngredients(prevState => {
      const prevIngredients = [...prevState]
       const updatedIngredients = prevIngredients.filter(ing => id !== ing.id)
       return updatedIngredients
    })

  }
  const setFilteredData = useCallback(ingredientName => {
    setUserIngredients(ingredientName)
  }, [])
  return (
    <div className="App">
      {console.log('Ingredients rendered again')}
      <IngredientForm onIngredientsAdd={ingredientsHandler}/>

      <section>
        <Search onLoadFilteredData={setFilteredData}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
