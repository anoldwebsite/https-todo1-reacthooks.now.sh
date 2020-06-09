import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_ENDPOINT = "https://todos-api-nuquyjkqpx.now.sh/todos";
//const API_DB_ENDPOINT = "https://todos-api-nuquyjkqpx.now.sh/db";

export const getAllToDos = async () => {
    try {
        const response = await axios.get(API_ENDPOINT);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const swap = async (me, myNeighbour) => {
    try {
          await axios.put(`${API_ENDPOINT}/${me.id}`,
            {
              ...me,
              text: myNeighbour.text,
              complete: myNeighbour.complete
            }
          );
          await axios.put(`${API_ENDPOINT}/${myNeighbour.id}`,
            {
              ...myNeighbour,
              text: me.text,
              complete: me.complete
            }
          );
        }catch (error) {
          console.log(error);
        }
  };

export const moveUpOrDownToDo = async (clickedToDo, upOrDown) => {
    let tasks = await getAllToDos();
    const indexOfClickedToDo = tasks.findIndex(element => element.id === clickedToDo.id);
    let indexOfNeighbor;
    if (upOrDown == "up") {
        if (indexOfClickedToDo == 0) return tasks;
        indexOfNeighbor = indexOfClickedToDo - 1;
    } else if (upOrDown == "down") {
        if (indexOfClickedToDo == tasks.length - 1) return tasks;
        indexOfNeighbor = indexOfClickedToDo + 1;
    }
    const myNeighbour = tasks[indexOfNeighbor];
    await swap(clickedToDo, myNeighbour);
    tasks = await getAllToDos();
    return tasks;
};

//Fetch API data - i.e. todo tasks both marked as completed or not completed
export const getToDosBasedOnQueryTerm = async (query, controller) => {
    try {
        //const response = await axios(`${API_ENDPOINT}?text=${query}`, { signal: controller.signal });
        const response = await axios(`${API_ENDPOINT}?q=${query}`, { signal: controller.signal });
        console.log(response.data);
        if (response.data && response.data.length > 0) return response.data;
        return getAllToDos();
    } catch (error) {
        console.log(error);
    }
};

//Toggle the tasks when the text of a todo is double clicked by the user.
export const toggle = async (todoObject) => {
    try {
        const response = await axios.patch(`${API_ENDPOINT}/${todoObject.id}`,
            {
                //We want to toggle only the property complete.
                complete: !todoObject.complete
            }
        );
        //console.log(response.data);//Returns the toggled todo object.
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const deleteToDo = async (todoObjectId) => {
    try {
        const response = await axios.delete(`${API_ENDPOINT}/${todoObjectId}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const editToDo = async (currentTodo, textAfterEditing) => {
    const response = await axios.put(`${API_ENDPOINT}/${currentTodo.id}`,
        //The new updated object will be sent as second argument to function put.
        {
            ...currentTodo,
            text: textAfterEditing//This is the text of the task that we want to update, i.e. currentTodo task.
        }
    );
    console.log(response.data)
    return response.data;
};

export const postToDo = async (textOfNewToDoObject) => {
    const createdAt = new Date();
    const response = await axios.post(API_ENDPOINT,
        {
            id: uuidv4(),
            text: textOfNewToDoObject,
            complete: false,
            createdAt: createdAt
        }
    );
    return response.data;
};

export const textNotSuitable = async inputText => {
    const textToCheck = inputText.trim().toLowerCase();
    const response = await axios.get(API_ENDPOINT);//API end point
    if (response.data && response.data.length > 0) {
        const found = response.data.find(element => {
            if (element && element.text) {
                return (element.text.toLowerCase() == textToCheck);
            }
        });//will return undefined or the task that we are searching for.
        return (found ? false : true);
    } else {
        return true;
    }
};

export const checkText = (text) => {
    if (!text) return false;
    const textOfTheTask = text.trim();
    //Check if the text length is less than 2 characters
    if (textOfTheTask.length < 2) return false;
    //Check if the text is the same as of an existing task in the database
    return textNotSuitable(textOfTheTask);
};
