
const apiEndPoint = "http://localhost:3002/api/";

export const post = async (url, body) => {
    const response = await fetch(apiEndPoint + url, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem("authToken")
        },
        body: JSON.stringify(body)
    });
    return response.json();
};

export const get = async (url) => {
    const response = await fetch(apiEndPoint + url, {
        method: "GET",
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem("authToken"),
        }
    });
    return response.json();
};

export const delet = async (url) => {
    const response = await fetch(apiEndPoint + url, {
        method: "DELETE",
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + localStorage.getItem("authToken"),
        }
    });
    return response.json();
};