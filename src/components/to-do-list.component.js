import React, { useContext } from 'react';
import ToDosContext from '../context';
import { toggle, deleteToDo } from './backend/Crud.component';

export default function ToDoList() {
    const { state, dispatch } = useContext(ToDosContext);
    const title = state.todos.length
        ? `You have ${state.todos.length} thing(s) to do!`
        : 'Nothing To Do!';

    const toggleCompletness = async (todo) => {
        const todoObjectAfterToggling = await toggle(todo);
        if (todoObjectAfterToggling) {
            dispatch(
                {
                    type: "TOGGLE_TODO",
                    payload: todoObjectAfterToggling
                }
            );
        }else{
            dispatch(
                {
                    type: "DO_NOTHING",
                }
            );
        }

    };

    return (
        <div className="contianer mx-auto mx-w-md text-center font-mono">
            <h1 className="text-bold">{title}</h1>
            <ul className="list-reset text-white p-0">
                {
                    state.todos.map(todo => (
                        <li
                            className="flex items-center bg-orange-dark border-black border-dashed border-2 my-2 py-4"
                            key={todo.id}
                        >
                            <span
                                onDoubleClick={() => toggleCompletness(todo)}
                                className={`flex-1 ml-12 cursor-pointer ${todo.complete && "line-through text-grey"}`}
                            >
                                {todo.text}
                            </span>

                            <button onClick={() => dispatch(
                                {
                                    type: 'SET_CURRENT_TODO',
                                    payload: todo
                                }
                            )}>
                                <img src="https://icon.now.sh/edit/0050c5" alt="Edit Icon" className="h-6" />
                            </button>

                            <button
                                onClick={async () => {
                                    const deletedFromAPI = await deleteToDo(todo.id);
                                    if (deletedFromAPI) {
                                        dispatch(
                                            {
                                                type: 'REMOVE_TODO',
                                                payload: todo
                                            }
                                        );
                                    }
                                }}
                            >

                                <img src="https://icon.now.sh/delete/8b0000" alt="Delete Icon" className="h-6" />
                            </button>

                        </li>
                    ))
                }
            </ul>
        </div>
    );
};