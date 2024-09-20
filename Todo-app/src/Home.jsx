import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs'; // Import pencil icon

function Home() {
    const [todos, setTodos] = useState([]);
    const [editing, setEditing] = useState(null); // State to manage editing
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleEdit = (id, done) => {
        axios.put(`http://localhost:3001/update/${id}`, { done: !done })
            .then(result => {
                setTodos(todos.map(todo =>
                    todo._id === id ? { ...todo, done: !done } : todo
                ));
            })
            .catch(err => console.log(err));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/delete/${id}`)
            .then(result => {
                setTodos(todos.filter(todo => todo._id !== id));
            })
            .catch(err => console.log(err));
    };

    const startEditing = (todo) => {
        setEditing(todo._id);
        setNewTask(todo.task);
    };

    const handleUpdate = (id) => {
        axios.put(`http://localhost:3001/update/${id}`, { task: newTask })
            .then(result => {
                setTodos(todos.map(todo =>
                    todo._id === id ? { ...todo, task: newTask } : todo
                ));
                setEditing(null);
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='home'>
            <h1>TODO LIST</h1>
            <Create />
            <br />
            {editing && (
                <div className='edit_form'>
                    <input
                        type='text'
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder='Update task'
                    />
                    <button onClick={() => handleUpdate(editing)}>Update</button>
                    <button className='cancel' onClick={() => setEditing(null)}>Cancel</button>
                </div>
            )}
            {todos.length === 0 ? (
                <div>
                    <h2>No records</h2>
                </div>
            ) : (
                todos.map(todo => (
                    <div key={todo._id} className='task'>
                        <div className='checkbox' onClick={() => handleEdit(todo._id, todo.done)}>
                            {todo.done ? <BsFillCheckCircleFill className='icon' /> : <BsCircleFill className='icon' />}
                            <p className={todo.done ? 'line_through' : ''}>{todo.task}</p>
                        </div>
                        <div>
                            <span><BsFillTrashFill className='icon' onClick={() => handleDelete(todo._id)} /></span>
                            <span><BsFillPencilFill className='icon' onClick={() => startEditing(todo)} /></span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;