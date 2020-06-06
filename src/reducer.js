export default function reducer(state, action) {
    switch (action.type) {
        case 'GET_TODOS':
        case 'MOVE_UP':
        case 'MOVE_DOWN':
            return {
                ...state,
                todos: action.payload
            };
        case 'TOGGLE_TODO':
            const toggledToDosArray = state.todos.map(t =>
                t.id === (action.payload.id)
                    ? action.payload
                    : t //Insert the same todo task in the array produced by map function without changing anything becuase it was not double-clicked by the user.
            );
            return {
                ...state,
                todos: toggledToDosArray
            }; //returning a new object in which we spread the state and then assign the new array to property todos.
        case 'REMOVE_TODO':
            const filteredToDosArray = state.todos.filter(t => t.id !== action.payload.id);
            const isInEditingMode = state.currentTodo.id === action.payload.id ? {} : state.currentTodo;
            return {
                ...state,
                todos: filteredToDosArray,
                currentTodo: isInEditingMode
            };
        case 'ADD_TODO':
            const addedNewTaskArray = [...state.todos, action.payload];//If you want new task at the end of the list.
            //const addedNewTaskArray = [action.payload, ...state.todos];//If you want new tasks on the top 
            return {
                ...state,
                todos: addedNewTaskArray
            };
        case 'SHOW_SEARCH_RESULTS':
            return {
                ...state,
                todos: action.payload,
                currentTodo: {}
            };
        case 'SET_CURRENT_TODO':
            return {
                ...state,
                currentTodo: action.payload
            };
        case 'UPDATE_TODO':
            const index = state.todos.findIndex(t => t.id === action.payload.id);//action.payload.id is the update object's id.
            const updatedTodosArray = [
                ...state.todos.slice(0, index),//Copy items from the old array to this new array starting from index 0 to (n-1)th index, where n is the item that the user wants to edit. 
                action.payload,//Insert the newly edited task in the new array at index n, where n is the item that the user wants to edit. 
                ...state.todos.slice(index + 1)//Copy items from the old array to this new array starting from index ( n + 1 ) to the end of the old array, where n is the item that the user wants to edit. 
            ];
            return {
                ...state,
                todos: updatedTodosArray,
                currentTodo: {} //Reset it as we don't need it as the task is edited and updated.
            };
        case 'DO_NOTHING':
            return {
                ...state,
                currentTodo: {}
            };
        default:
            return state;
    }
};