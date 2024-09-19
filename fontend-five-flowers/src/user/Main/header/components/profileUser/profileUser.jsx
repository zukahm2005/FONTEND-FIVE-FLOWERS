import React, { useState, useEffect } from "react";
import axios from "axios";
import './profileUser.scss';
import { FaFacebook, FaGithub, FaGlobe, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { GiRank1, GiRank2, GiRank3 } from "react-icons/gi";
import { color } from "framer-motion";

const ProfileUser = () => {
    const [userData, setUserData] = useState(null);
    const [totalData, setTotalData] = useState(null);
    const [userInfoData, setUserInfoData] = useState([]);
    const [caloriesData, setCaloriesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tokenValid, setTokenValid] = useState(true);
    const [formFields, setFormFields] = useState({
        country: "",
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        phone: "",
        city: "",
        postalCode: "",
    });

    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

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

                let caloriesData = 0;

                try {
                    const userInfo = await axios.get('http://localhost:8080/api/v1/addresses/user', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const caloriesResponse = await axios.get(`http://localhost:8080/api/v1/calorie-consumption/${user.userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    caloriesData = caloriesResponse.data;

                    const total = await axios.get(`http://localhost:8080/api/v1/orders/user/${user.userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    const orders = total.data;

                    const totalPrice = orders.reduce((total, order) => total + order.price, 0);

                    setTotalData(totalPrice);

                    setUserInfoData(userInfo.data);
                    setFormFields(userInfo.data); // Đặt form ban đầu với dữ liệu đã có
                } catch (caloriesError) {
                    if (caloriesError.response && caloriesError.response.status === 404) {
                        console.warn("Calorie data not found (404), setting to 0.");
                        caloriesData = 0;
                    } else {
                        console.error("Error fetching calorie data:", caloriesError);
                    }
                }

                setUserData(userResponse.data);
                setCaloriesData(caloriesData);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching user data:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    // Assuming userInfoData is an array
    const lastElement = userInfoData.length > 0 ? userInfoData[userInfoData.length - 1] : null;


    const handleEdit = async (e) => {
        e.preventDefault(); // Đảm bảo không tải lại trang

        // Gửi yêu cầu cập nhật thông tin người dùng
        const newErrors = {};
        if (!formFields.firstName) {
            newErrors.firstName = "First name is required";
        }
        if (!formFields.lastName) {
            newErrors.lastName = "Last name is required";
        }
        if (!formFields.address) {
            newErrors.address = "Address is required";
        }
        if (!formFields.phone) {
            newErrors.phone = "Phone is required";
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const updatedUserInfo = {
                ...formFields,
                user: { id: user.userId },
            };

            try {
                if (userInfoData && Object.keys(userInfoData).length > 0) {
                    // Nếu đã có dữ liệu userInfo thì thực hiện PUT
                    await axios.put(`http://localhost:8080/api/v1/addresses/update/${lastElement.addressId}`, updatedUserInfo, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log("User info updated successfully!");
                } else {
                    // Nếu chưa có dữ liệu thì thực hiện POST
                    await axios.post("http://localhost:8080/api/v1/addresses/add", updatedUserInfo, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log("User info added successfully!");
                }
                setIsEditing(false); // Thoát chế độ chỉnh sửa sau khi lưu thành công
            } catch (error) {
                console.error("Error updating user info:", error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormFields({
            ...formFields,
            [name]: value
        });
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


    return (
        <div className="container2">
            <div className="profile-container">
                <div className="profile-content">
                    <div className="profile-sidebar">
                        <img src={userData?.img} alt="Profile" className="profile-img" />
                        <h3 style={{margin: '10px 0'}}>{userData?.userName}</h3>
                        <p>{userData?.email}</p>
                        <button style={{margin: '20px 0'}} onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>
                    <div className="user-info">
                        {isEditing ? (
                            <form onSubmit={handleEdit}>
                                <div className="input-country-address">
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="Country"
                                        value={formFields.country}
                                        onChange={handleInputChange}
                                    />
                                    {errors.country && <p className="error">{errors.country}</p>}
                                </div>
                                <div className="input-name-address">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First name"
                                        value={formFields.firstName}
                                        onChange={handleInputChange}
                                    />
                                    {errors.firstName && <p className="error">{errors.firstName}</p>}
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last name"
                                        value={formFields.lastName}
                                        onChange={handleInputChange}
                                    />
                                    {errors.lastName && <p className="error">{errors.lastName}</p>}
                                </div>
                                <div className="input-country-address">
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={formFields.address}
                                        onChange={handleInputChange}
                                    />
                                    {errors.address && <p className="error">{errors.address}</p>}
                                </div>
                                <div className="apartment-phone-address">
                                    <input
                                        type="text"
                                        name="apartment"
                                        placeholder="Apartment/Suite, etc."
                                        value={formFields.apartment}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Phone"
                                        value={formFields.phone}
                                        onChange={handleInputChange}
                                    />
                                    {errors.phone && <p className="error">{errors.phone}</p>}
                                </div>
                                <div className="input-city-code-address">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formFields.city}
                                        onChange={handleInputChange}
                                    />
                                    {errors.city && <p className="error">{errors.city}</p>}
                                    <input
                                        type="text"
                                        name="postalCode"
                                        placeholder="Postal Code"
                                        value={formFields.postalCode}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <button type="submit">Save</button>
                            </form>
                        ) : (
                            <div className="user-info-data">
                                <h4>User Info</h4>
                                {lastElement ? (
                                    <>
                                        <p>Country: {lastElement.country}</p>
                                        <p>First Name: {lastElement.firstName}</p>
                                        <p>Last Name: {lastElement.lastName}</p>
                                        <p>Address: {lastElement.address}</p>
                                        <p>Apartment: {lastElement.apartment}</p>
                                        <p>Phone: {lastElement.phone}</p>
                                        <p>City: {lastElement.city}</p>
                                        <p>Postal Code: {lastElement.postalCode}</p>
                                    </>
                                ) : (
                                    <p>No user info available</p>
                                )}
                            </div>

                        )}
                    </div>
                </div>
                <div className="additional-info">
                    <div className="info-btn">
                        <div className="info-item">
                            <a href="https://Whatsapp.com" target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp size={30} />
                            </a>
                            <span>
                                <a href="https://website.com">{userData?.userName}.vn</a>
                            </span>
                        </div>
                        <div className="info-item">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                <FaGithub size={30} />
                            </a>
                            <span>
                                <a href="https://github.com">{userData?.userName}.github.com</a>
                            </span>
                        </div>
                        <div className="info-item">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <FaTwitter size={30} />
                            </a>
                            <span>
                                <a href="https://twitter.com">@{userData?.userName}</a>
                            </span>
                        </div>
                        <div className="info-item">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <FaInstagram size={30} />
                            </a>
                            <span>
                                <a href="https://instagram.com">{userData?.userName}</a>
                            </span>
                        </div>
                        <div className="info-item">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <FaFacebook size={30} />
                            </a>
                            <span>
                                <a href="https://facebook.com">{userData?.userName}</a>
                            </span>
                        </div>
                    </div>
                    <div>
                        <span>Total Amount Purchased: {totalData}$</span>
                        <div className="rank">
                            <div className="rank-1">
                                <GiRank1
                                    size={220}
                                    style={totalData >= 1000 ? {color: 'red'} : {}}
                                />
                            </div>
                            <div className="rank-2">
                                <GiRank2 size={220}
                                style={totalData >= 2000 ? { color: 'blue' } : {}} />
                            </div>
                            <div className="rank-3">
                                <GiRank3 size={220}
                                style={totalData >= 10000 ? { color: 'yellow' } : {}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUser;
