import React from 'react';

const ToDosContext = React.createContext({
    todos: [
        // { id: 1, text: "Run 10 km", complete: false },
        // { id: 2, text: "Train at the gym", complete: true },
        // { id: 3, text: "Eat breakfast", complete: false }
    ],
    currentTodo: {}
});
export default ToDosContext;