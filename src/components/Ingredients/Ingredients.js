import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [ isLoading, setIsLoading] = useState(false);
  const [ error, setError] = useState();

  const ingredientsHandler = async (ingredient) => {

    try {
      setIsLoading(true)
    const response = await fetch('https://react-hooks-update-f7413-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    })
    const responseData = await response.json()
      setUserIngredients(prevState => (
      [...prevState, {id: responseData.name, ...ingredient}]
    ))
    setIsLoading(false)
    } catch(error) {
      setError('Something went wrong');
      setIsLoading(false)
    }
    
  }
  const removeIngredientHandler = (id) => {
    setIsLoading(true)
    fetch(`https://react-hooks-update-f7413-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(() => {
      setIsLoading(false)
      setUserIngredients(prevState => {
        const prevIngredients = [...prevState]
         const updatedIngredients = prevIngredients.filter(ing => id !== ing.id)
         return updatedIngredients
      })
    }).catch(error => {
      setIsLoading(false)
      setError('Something went wrong');

    })
  }

  const setFilteredData = useCallback(ingredientName => {
    setUserIngredients(ingredientName)
  }, [])

  const resetError = () => {
    setError(null)
  }
  return (
    <div className="App">
      {error ? <ErrorModal onClose={resetError}>{error}</ErrorModal> : null}
      <IngredientForm onIngredientsAdd={ingredientsHandler} loading={isLoading}/>

      <section>
        <Search onLoadFilteredData={setFilteredData}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
