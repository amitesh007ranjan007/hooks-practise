import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [filteredItem, setFilteredItem] = useState('');
  const { onLoadFilteredData} = props;
  const inputRef = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filteredItem === inputRef.current.value) {
        const query = filteredItem.length === 0 ? '' : `?orderBy="title"&equalTo="${filteredItem}"`;
        fetch('https://react-hooks-update-f7413-default-rtdb.firebaseio.com/ingredients.json'+query)
         .then(response => response.json())
         .then(responseData => {
          const ingredientsData = []
           for (let key in responseData) {
             ingredientsData.push({
               id: key,
               title: responseData[key].title,
               amount: responseData[key].amount
             })
           }
           onLoadFilteredData(ingredientsData)
         })
      }

    }, 500)
    return () => clearTimeout(timer)

  }, [filteredItem, onLoadFilteredData])
  return (
    <section className="search">
      {console.log('Search rendered again', filteredItem)}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value={filteredItem} onChange={event => setFilteredItem(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
