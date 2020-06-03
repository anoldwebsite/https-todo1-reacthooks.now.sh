import React, { useState, useContext, useEffect } from 'react';
import ToDosContext from '../context';
import { checkText, editToDo, postToDo } from './backend/Crud.component';

export default function TodoForm() {
    const [todo, setTodo] = useState('');
    const { state: { currentTodo = {} }, dispatch } = useContext(ToDosContext);

    useEffect(() => {
        if (currentTodo.text) {
            //This means that the text property of the task is set and is not null or empty object
            setTodo(currentTodo.text);
        } else {
            //else case means that the task was deleted and the property text of currenTodo is not set.
            setTodo('');
        }
    }, [currentTodo.id]);

    const fireActionDoNothing = () => {
        dispatch(
            {
                type: 'DO_NOTHING'
            }
        );
        console.log('DO_NOTHING action was fired!');
        setTodo('');//clear the input box on the form
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const validTask = await checkText(todo);
        if (!validTask) {
            fireActionDoNothing();
            return;
        }

        if (currentTodo.text) {
            //This is editing case and not new task creation case.
            const responseData = await editToDo(currentTodo, todo);//send request for update to backend.
            if (responseData) {
                dispatch(
                    {
                        type: 'UPDATE_TODO',
                        payload: responseData//Sending the updated object as payload.
                    }
                );
            } else {
                fireActionDoNothing();
            }
        }
        else {
            //This is addition of new task case
            //If we are here then: 1. It is a new addition case.
            //2. The text box is not empty and the text length is greater than 1 character
            //3. No task with the same text is found in the database. So, let's add this task.
            const responseData = await postToDo(todo);
            if (responseData) {
                dispatch(
                    {
                        type: 'ADD_TODO',
                        payload: responseData
                    }
                );
            } else {
                fireActionDoNothing();
            }
        }

        setTodo('');//clear the input box on the form
    };

    return (
        <form className="flex justify-center p-5" onSubmit={handleSubmit}>
            <label>
                Add/edit:
                <input
                    type="text"
                    className="border-black border-solid border-2"
                    onChange={event => setTodo(event.target.value)}
                    value={todo}
                />
            </label>
        </form>
    );
};