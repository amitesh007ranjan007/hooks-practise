import React, { useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET': 
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'REMOVE':
      return currentIngredients.filter(ing => ing.id !== action.id)
    default: 
      throw new Error('error occurred')
  }
}

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        error: false,
        loading: true
      }
    case 'RESPONSE':
      return {
        ...currentHttpState,
        loading: false
      }
    case 'ERROR':
      return {
        error: true,
        loading: false
      }
    case 'RESET':
      return {
        ...currentHttpState,
        error: false
      }
    default:
      throw new Error('Error');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, [])
  const [httpState, httpDispatch] = useReducer(httpReducer, {error: false, loading: false})

  const ingredientsHandler = async (ingredient) => {

    try {
      httpDispatch({
        type: 'SEND'
      })
    const response = await fetch('https://react-hooks-update-f7413-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    })
    const responseData = await response.json()
     dispatch({
       type: 'ADD',
       ingredient: {id: responseData.name, ...ingredient}
     })
     httpDispatch({
      type: 'RESPONSE'
    })
    } catch(error) {
      httpDispatch({
        type: 'ERROR'
      })
    }
    
  }
  const removeIngredientHandler = (id) => {
    httpDispatch({
      type: 'SEND'
    })
    fetch(`https://react-hooks-update-f7413-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(() => {
      httpDispatch({
        type: 'RESPONSE'
      })
      dispatch({
        type: 'REMOVE',
        id: id 
      })
    }).catch(error => {
      httpDispatch({
        type: 'ERROR'
      })

    })
  }

  const setFilteredData = useCallback(ingredientName => {
    dispatch({
      type: 'SET',
      ingredients: ingredientName
    })
  }, [])

  const resetError = () => {
    httpDispatch({
      type: 'RESET'
    })
  }
  return (
    <div className="App">
      {httpState.error ? <ErrorModal onClose={resetError}>{httpState.error}</ErrorModal> : null}
      <IngredientForm onIngredientsAdd={ingredientsHandler} loading={httpState.loading}/>

      <section>
        <Search onLoadFilteredData={setFilteredData}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
