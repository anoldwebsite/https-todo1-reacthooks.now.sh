import React, { useState, useContext, useEffect, useRef } from 'react';
import ToDosContext from '../context';
import { getToDosBasedOnQueryTerm, getAllToDos } from './backend/Crud.component';


export default function SearchForm() {
    const [query, setQuery] = useState('');//create initial state for query.
    const [tasks, setTasks] = useState([]);//create intial state for todo tasks
    const { dispatch } = useContext(ToDosContext);

    //create ref for search input
    //const focusSearch = useRef(null);
    const focusSearch = useRef();

    //useEffect - focus on search input
    useEffect(() => {
        if (focusSearch) {
            focusSearch.current.focus();
        }
    }, []
    );

    //prevent render flickering as user types in search box. This function is called in the next useEffect hook.
    const sleep = (milliseconds) => (new Promise(resolve => setTimeout(resolve, milliseconds)));

    /* useEffect - Only renders when query is changed. 
    In this side effect hook, we create a currentQuery boolean and controller variable
    to prevent a promise from running on each character change in the input field.
    */
    useEffect(() => {
        let currentQuery = true;
        //AbortController is a controller object that allows you to abort one or more DOM requests as and when desired.
        const controller = new AbortController();

        const loadSearchedToDos = async () => {
            if (!query) return setTasks([]);

            await sleep(350);

            if (currentQuery) {
                const todosFound = await getToDosBasedOnQueryTerm(query, controller);
                setTasks(todosFound);

                dispatch(
                    {
                        type: 'SHOW_SEARCH_RESULTS',
                        payload: todosFound//Sending the search results as payload.
                    }
                );
            }
        };

        loadSearchedToDos();
        /* Every effect may return a function that cleans up after it.
            This helps us keep the logic for adding and removing subscriptins
            close to each other. They are part of the same effect. 
            React performs the cleanup when the component unmounts.
            However, effects run for every render and not just once.
            This is why React also cleans up effects from the previous render
            before running the effects next time. We render here only when the
            query changes.
        */
        return () => {
            currentQuery = false;
            controller.abort()
        }
        /*
        //.abort() - Invoking this method will set this object's
         AbortSignal's aborted flag and signal to any observers 
         that the associated activity is to be aborted.
        */
    }, [query] //Only renders when query is changed.
    );

    const handleSearch = event => {
        event.preventDefault();
    };

    return (
        <form
            className="flex justify-center p-5"
            onSubmit={handleSearch}
        >
            <label>
                Search:
                <input
                    type="text"
                    placeholder="Search for a todo..."
                    ref={focusSearch}
                    onChange={event => setQuery(event.target.value)}
                    value={query}
                    className="border-black border-solid border-2"
                />
            </label>
        </form>
    );
};