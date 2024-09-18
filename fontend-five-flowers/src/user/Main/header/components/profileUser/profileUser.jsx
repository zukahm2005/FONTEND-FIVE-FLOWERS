import React, { useState, useEffect } from "react";
import axios from "axios";
import './profileUser.scss';

const ProfileUser = () => {
    const [userData, setUserData] = useState(null);
    const [caloriesData, setCaloriesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tokenValid, setTokenValid] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
    const [editedData, setEditedData] = useState({
        userName: '',
        email: '',
        password: '',
        roles: '',
        img: ''
    });

    const token = localStorage.getItem('token');
    let user = null;

    try {
        user = token ? JSON.parse(atob(token.split('.')[1])) : null;
    } catch (e) {
        setTokenValid(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!token || !user) {
                setTokenValid(false);
                return;
            }

            try {
                const userResponse = await axios.get('http://localhost:8080/api/v1/user/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const caloriesResponse = await axios.get(`http://localhost:8080/api/v1/calorie-consumption/${user.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Assign the fetched data to the state
                setUserData(userResponse.data);
                setEditedData({
                    userName: userResponse.data.userName,
                    email: userResponse.data.email,
                    password: '',
                    roles: userResponse.data.roles,  // Keep password empty initially
                    img: userResponse.data.img
                });
                setCaloriesData(caloriesResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
                setLoading(false);
            }
        };

        if (token && user) {
            fetchData();
        }
    }, []); // Run effect only once when the component is mounted

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData({
            ...editedData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/v1/user/${user.userId}`, editedData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData({
                ...userData,
                ...editedData
            });
            setIsEditing(false); // Close edit mode after saving
        } catch (error) {
            console.error("Error updating user info:", error);
            setError(error);
        }
    };

    if (!tokenValid) {
        return <div>Error: Token not found or invalid. Please log in again.</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading data. Please try again later.</div>;
    }

    const formatDate = (dateArray) => {
        if (!dateArray) return 'Unknown';
        const [year, month, day, hour, minute, second] = dateArray;
        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };

    const totalCaloriesBurned = caloriesData.reduce((total, entry) => total + (entry.distance || 0), 0);
    const mostRecentCalorieData = caloriesData.reduce((total, entry) => total + (entry.caloriesBurned || 0), 0);

    return (
        <div className="container">
            <div className="profile-container">
                <div className="profile-sidebar">
                    <img src={userData?.img} alt="Profile" className="profile-img"/>
                    <h3>{userData?.userName}</h3>
                    <p>{userData?.email}</p>
                </div>
                <div className="profile-content">
                    <div className="user-info">
                        {isEditing ? (
                            <form className="edit-form" onSubmit={handleSubmit}>
                                <div className="info">
                                    <label>
                                        <strong>User Name:</strong>
                                        <input
                                            type="text"
                                            name="userName"
                                            value={editedData.userName}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                                <div className="info">
                                    <label>
                                        <strong>Email:</strong>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editedData.email}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                                <div className="info">
                                    <label>
                                        <strong>Profile Image URL:</strong>
                                        <input
                                            type="text"
                                            name="img"
                                            value={editedData.img}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                                <button type="submit" className="save-button">Save</button>
                            </form>
                        ) : (
                            <>
                                <div className="info">
                                    <p><strong>Email:</strong> {userData?.email}</p>
                                </div>
                                <div className="info">
                                    <p><strong>Total Km Run:</strong> {totalCaloriesBurned.toFixed(2) || 'N/A'} km</p>
                                </div>
                                <div className="info">
                                <p><strong>Calories Burned:</strong> {mostRecentCalorieData.toFixed(2) || 'N/A'} cal</p>
                                </div>
                                <div className="info">
                                    <p><strong>Created At:</strong> {formatDate(userData?.createdAt)}</p>
                                </div>
                                <div className="info">
                                    <p><strong>Updated At:</strong> {formatDate(userData?.updatedAt)}</p>
                                </div>
                            </>
                        )}
                    </div>
                    <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Information'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileUser;
