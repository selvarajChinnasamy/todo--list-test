import React, { useEffect, useReducer, useState } from "react";
import { get, delet } from '../services/http.service';
import ClipLoader from "react-spinners/ClipLoader";

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

const Home = () => {

    const [tasks, dispatch] = useReducer(updateTaskList, []);
    const [loading, setLoading] = useState(false);

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

    const getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
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
                    <div>
                        {getChildrens(task.id).map(task => {
                            return plotTask(task, marginLeft + 10);
                        })}
                    </div>
                </div>
            </div>
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
        </div>
    );
};

export default Home;