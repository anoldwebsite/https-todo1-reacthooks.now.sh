import React, { useContext, useReducer, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import todosReducer from './reducer';
import ToDosContext from './context';
import ToDoList from './components/to-do-list.component';
import TodoForm from './components/to-do-form';
import SearchForm from './components/search-form.component';
import { getAllToDos } from './components/backend/Crud.component';

//Fetch all to dos and display them when mounting the App component
export const useAPI = endpoint => {
  const [data, setData] = useState([]);//Initialize with an empty array i.e., no data from the backend

  useEffect(async() => {
    //getData();
    setData(await getAllToDos());
  }, []);//Empty array as second argument means fire getData only with component mount and unmount

  return data;
}; 

const App = () => {
  const initialState = useContext(ToDosContext);
  const [state, dispatch] = useReducer(todosReducer, initialState);
  const savedTodos = useAPI("https://todos-api-nuquyjkqpx.now.sh/todos");

  //Back to th redux part. Dispatching an action
  useEffect(() => {
    dispatch(
      {
        type: 'GET_TODOS',
        payload: savedTodos
      }
    );
  }, [savedTodos]);//We want to dispatch this function only when the dependency savedTodos changes.

  return (
    <ToDosContext.Provider value={{ state, dispatch }}>
      <TodoForm />
      <SearchForm />
      <ToDoList />
    </ToDosContext.Provider>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
