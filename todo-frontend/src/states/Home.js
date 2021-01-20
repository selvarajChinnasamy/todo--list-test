import React, { useEffect, useReducer, useState } from "react";
import { get, delet, post } from '../services/http.service';
import ClipLoader from "react-spinners/ClipLoader";
import Modal from 'react-modal';
import moment from 'moment';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const updateTaskList = (tasks, action) => {
    switch (action.type) {
        case "replace":
            return action.data;
        case "add":
            return [...tasks, action.task];
        case "delete":
            return tasks.filter(task => task.id !== action.id);
        default:
            return tasks;
    }
}

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const Home = () => {

    const [tasks, dispatch] = useReducer(updateTaskList, []);
    const [loading, setLoading] = useState(false);
    const [addPopup, setAddPopup] = useState(false);
    const [currentParentId, setCurrentParentId] = useState();
    const [addFormTaskName, setAddFormTaskName] = useState();
    const [addFormTaskDesc, setAddFormTaskDesc] = useState();

    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = async () => {
        try {
            setLoading(true);
            const responce = await get("task");
            setLoading(false);
            if (responce && responce.success) {
                dispatch({ type: "replace", data: responce.tasks });
            } else {
                alert("Something went wrong!");
            }
        }
        catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    const deletTask = async (id) => {
        try {
            const responce = await delet("task/" + id);
            if (responce && responce.success) {
                dispatch({ type: "delete", id });
                alert("Task deleted successfully!");
            } else {
                alert("Something went wrong!");
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const getChildrens = (parentId) => {
        return tasks.filter(task => (task.parent_id === parentId));
    }

    const plotTask = (task, marginLeft) => {
        return (
            <div key={task.id} style={{ marginLeft }}>
                <div style={{ backgroundColor: getRandomColor() }} className="root-parent">
                    <div style={{ textAlign: 'left' }}>
                        <p style={{ color: "#ffff", fontSize: 30, fontWeight: 600 }}>{task.name}</p>
                        <p style={{ color: "#ffff" }}>{task.desc}</p>
                    </div>
                    <button onClick={() => deletTask(task.id)} style={{ margin: 10 }}>Delete</button>
                    <button onClick={() => openAddForm(task.id)} style={{ margin: 10 }}>Add</button>
                    <div>
                        {getChildrens(task.id).map(task => {
                            return plotTask(task, marginLeft + 10);
                        })}
                    </div>
                </div>
            </div>
        );
    }

    const openAddForm = (parentId) => {
        setCurrentParentId(parentId);
        setAddPopup(true);
    }

    const addTaskFormHandler = async (event) => {
        event.preventDefault();
        try {
            if (!(addFormTaskName && addFormTaskDesc)) {
                alert("Invalid name or description");
                return;
            }
            console.log(moment());
            const reqObj = {
                name: addFormTaskName,
                desc: addFormTaskDesc,
                parent_id: currentParentId,
                created_at: moment()
            };
            const responce = await post("task", reqObj);
            if (responce && responce.success && responce.id) {
                dispatch({ type: "add", task: { ...reqObj, id: responce.id } });
                setAddPopup(false);
                alert("Task created.");
            } else {
                alert((responce && responce.message) ? responce.message : "something went wrong!.");
            }
        }
        catch (err) {
            console.log(err);
            alert("something went wrong!.");
        }
    }

    const addModel = () => {
        return (
            <Modal
                isOpen={addPopup}
                onRequestClose={() => setAddPopup(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <i style={{ float: 'right' }} onClick={() => setAddPopup(false)} className="fa fa-times" aria-hidden="true" />
                <div style={{ textAlign: "center" }}>Add Task</div>
                <form onSubmit={addTaskFormHandler}>
                    <input value={addFormTaskName} onChange={(event) => setAddFormTaskName(event.target.value)} placeholder="Name" />
                    <input value={addFormTaskDesc} onChange={(event) => setAddFormTaskDesc(event.target.value)} placeholder="Description" />
                    <button type="submit">Add</button>
                </form>
            </Modal>
        );
    }

    const showTasks = () => {
        if (tasks.length) {
            return (
                <div>
                    {tasks.map(task => {
                        if (!(task && task.parent_id)) {
                            return plotTask(task, 10)
                        }
                    })}
                </div>
            );
        } else {
            return (
                <div>
                    <p>No tasks Found!</p>
                </div>
            );
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: "center", textAlign: 'center', justifyContent: "center" }}>
            <div style={{ margin: '20px', width: '80%' }} className="container">
                <h1>To Do's</h1>
                {loading ? <div className="loading">
                    <ClipLoader color={"#FF4B2B"} loading={true} size={150} />
                </div> : showTasks()}
            </div>
            {addModel()}
        </div>
    );
};

export default Home;