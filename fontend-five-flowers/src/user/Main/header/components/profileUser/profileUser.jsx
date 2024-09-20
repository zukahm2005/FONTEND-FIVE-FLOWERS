import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import './profileUser.scss';
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { GiRank1, GiRank2, GiRank3 } from "react-icons/gi";
import { CiCamera } from "react-icons/ci";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";

const ProfileUser = () => {
    const [userData, setUserData] = useState(null);
    const [totalData, setTotalData] = useState(0);
    const [userInfoData, setUserInfoData] = useState([]);
    const [caloriesData, setCaloriesData] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tokenValid, setTokenValid] = useState(true);

    const [existingImages, setExistingImages] = useState([]);
    const [newSelectedImages, setNewSelectedImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

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
    const [editedData, setEditedData] = useState({
        userName: '',
        email: '',
        password: '',
        roles: '',
        img: ''
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

    const fetchData = useCallback(async () => {
        if (!token || !user) {
            setTokenValid(false);
            return;
        }

        try {
            const [userResponse, userInfo, caloriesResponse, total, imagesResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/v1/user/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                axios.get('http://localhost:8080/api/v1/addresses/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                axios.get(`http://localhost:8080/api/v1/calorie-consumption/${user.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).catch(caloriesError => {
                    if (caloriesError.response && caloriesError.response.status === 404) {
                        console.warn("Calorie data not found (404), setting to 0.");
                        return { data: 0 };
                    } else {
                        throw caloriesError;
                    }
                }),
                axios.get(`http://localhost:8080/api/v1/orders/user/${user.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                axios.get("http://localhost:8080/api/v1/images/all")
            ]);

            const orders = total.data;
            const totalPrice = orders.reduce((total, order) => total + order.price, 0);

            setExistingImages(imagesResponse.data); // Lưu danh sách ảnh vào state
            setUserData(userResponse.data);
            setUserInfoData(userInfo.data);
            setCaloriesData(caloriesResponse.data);
            setTotalData(totalPrice);
            setFormFields(userInfo.data); // Cập nhật form với dữ liệu hiện có
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error);
            setLoading(false);
        }
    }, [token, user]);
    useEffect(() => {
        fetchData();
    },[]);

    const lastElement = userInfoData.length > 0 ? userInfoData[userInfoData.length - 1] : null;

    const fullName = lastElement ? `${lastElement.firstName || ''} ${lastElement.lastName || ''}` : 'No Name';

   

    const handleEditClick = () => {
        setIsEditing(true);
        if (lastElement) {
            setFormFields({
                firstName: lastElement.firstName || "",
                lastName: lastElement.lastName || "",
                address: lastElement.address || "",
                apartment: lastElement.apartment || "",
                country: lastElement.country || "",
                phone: lastElement.phone || "",
                city: lastElement.city || "",
                postalCode: lastElement.postalCode || ""
            });
            setEditedData({
                userName: userData.userName || '',
                email: userData.email || "",
                password: userData.password || '',
                roles: userData.roles || '',
                img: userData.img || ''
            })
        }
    };
    const handleCancelClick = () => {
        setIsEditing(false); // Đặt lại isEditing thành false để thoát chế độ chỉnh sửa
    };



    const handleFileChange = async (info) => {
        // Đảm bảo chỉ một file được tải lên mỗi lần
        let fileList = [info.fileList[info.fileList.length - 1].originFileObj]; // Chỉ giữ lại file cuối cùng
        setNewImages(fileList); // Lưu file vào state nếu cần
    
        const cloudName = 'ddrgrnsex'; // Tên Cloudinary của bạn
        const uploadPreset = 'share img'; // Đảm bảo không có khoảng trắng trong upload_preset
    
        // Lấy file duy nhất trong fileList
        const file = fileList[0];
    
        // Tạo FormData và thêm file
        const formData = new FormData();
        formData.append('file', file); // Tải lên từng file một
        formData.append('upload_preset', uploadPreset);
    
        try {
            // Tải ảnh lên Cloudinary
            const uploadResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData
            );
    
            const imageUrl = uploadResponse.data.secure_url; // Lấy URL thực tế sau khi tải lên
    
            // Cập nhật thông tin người dùng với URL ảnh
            await axios.put(`http://localhost:8080/api/v1/user/${user.userId}`, {
                ...userData,
                img: imageUrl, // Lưu URL Cloudinary vào dữ liệu người dùng
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            fetchData(); // Tải lại dữ liệu sau khi lưu
        } catch (error) {
            // Ghi lại chi tiết lỗi
            if (error.response) {
                console.log('Dữ liệu phản hồi:', error.response.data);
                console.log('Trạng thái phản hồi:', error.response.status);
            } else {
                console.log('Thông báo lỗi:', error.message);
            }
            console.error('Lỗi khi tải ảnh lên Cloudinary hoặc cập nhật thông tin người dùng:', error);
        }
    
        // Đặt lại fileList sau khi tất cả file đã được tải lên
        info.fileList = [];
    };
    


    const handleEdit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formFields.firstName) newErrors.firstName = "First name is required";
        if (!formFields.lastName) newErrors.lastName = "Last name is required";
        if (!formFields.address) newErrors.address = "Address is required";
        if (!formFields.phone) newErrors.phone = "Phone is required";
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const updatedUserInfo = { ...formFields, user: { id: user.userId } };

            try {
                if (userInfoData && Object.keys(userInfoData).length > 0) {
                    await axios.put(`http://localhost:8080/api/v1/addresses/update/${lastElement.addressId}`, updatedUserInfo, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("User info updated successfully!");

                    await axios.put(`http://localhost:8080/api/v1/user/${user.userId}`, editedData, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log("User info updated successfully!");
                } else {
                    await axios.post("http://localhost:8080/api/v1/addresses/add", updatedUserInfo, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("User info added successfully!");
                }
                setIsEditing(false);
                fetchData(); // Reload data after saving
            } catch (error) {
                console.error("Error updating user info:", error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormFields({ ...formFields, [name]: value });
        setEditedData({ ...editedData, [name]: value });
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
                        <div className="camera-icon">
                            <Upload
                                listType="picture"
                                showUploadList={false} // Ẩn danh sách file được chọn
                                beforeUpload={() => false} // Không tự động upload
                                onChange={handleFileChange} // Gọi hàm `handleFileChange` khi người dùng chọn ảnh
                            >
                                <CiCamera size={25} style={{ cursor: 'pointer' }} />
                            </Upload>
                        </div>

                        <h3 style={{ margin: '10px 0' }}>{fullName}</h3>
                        <p>{userData?.email}</p>
                        <button style={{ margin: '20px 0' }} onClick={isEditing ? handleCancelClick : handleEditClick}>
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>

                    <div className="user-info">
                        {isEditing ? (
                            <form onSubmit={handleEdit} className="edit-user-form">
                                <h4>Edit User Info</h4>

                                <div className="edit-user-form-group">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formFields.firstName}
                                        onChange={handleInputChange}
                                    />
                                    {errors.firstName && <p className="error">{errors.firstName}</p>}
                                </div>

                                <div className="edit-user-form-group">
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formFields.lastName}
                                        onChange={handleInputChange}
                                    />
                                    {errors.lastName && <p className="error">{errors.lastName}</p>}
                                </div>

                                <div className="edit-user-form-group">
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="email"
                                        value={editedData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="edit-user-form-group">
                                    <input
                                        type="text"
                                        name="apartment"
                                        placeholder="Apartment"
                                        value={formFields.apartment}
                                        onChange={handleInputChange}
                                    />
                                </div>


                                <div className="edit-user-form-group">
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={formFields.address}
                                        onChange={handleInputChange}
                                    />
                                    {errors.address && <p className="error">{errors.address}</p>}
                                </div>

                                <div className="edit-user-form-group">
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="Country"
                                        value={formFields.country}
                                        onChange={handleInputChange}
                                    />
                                    {errors.country && <p className="error">{errors.country}</p>}
                                </div>

                                <div className="edit-user-form-group">
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Phone"
                                        value={formFields.phone}
                                        onChange={handleInputChange}
                                    />
                                    {errors.phone && <p className="error">{errors.phone}</p>}
                                </div>

                                <div className="edit-user-form-group">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formFields.city}
                                        onChange={handleInputChange}
                                    />

                                    {errors.city && <p className="error">{errors.city}</p>}
                                </div>

                                <div className="edit-user-form-group">
                                    <input
                                        type="text"
                                        name="postalCode"
                                        placeholder="Postal Code"
                                        value={formFields.postalCode}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <button type="submit" className="edit-user-form-button2">
                                    Save
                                </button>
                            </form>

                        ) : (

                            <div className="user-info-data">
                                <h4>User Info</h4>
                                {lastElement ? (
                                    <>
                                        <p>First Name: <span>{lastElement.firstName}</span> </p>
                                        <p>Last Name: <span>{lastElement.lastName}</span> </p>
                                        <p>Email: <span>{userData?.email}</span> </p>
                                        <p>Apartment:<span>{lastElement.apartment}</span> </p>
                                        <p>Address: <span>{lastElement.address}</span></p>
                                        <p>Country: <span>{lastElement.country}</span></p>
                                        <p>Phone: <span>{lastElement.phone}</span></p>
                                        <p>City: <span>{lastElement.city}</span></p>
                                        <p>Postal Code: <span>{lastElement.postalCode}</span> </p>
                                    </>
                                ) : (
                                    <p style={{ width: '200px' }}>No user info available</p>
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
                                <FaTiktok size={30} />
                            </a>
                            <span>
                                <a href="https://github.com">{userData?.userName}.tiktok.com</a>
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
                            <div className="rank-item">
                                <GiRank1 size={220} style={totalData >= 1000 ? { color: 'red' } : { color: 'gray' }} />
                                <p>{totalData >= 1000 ? "You have earned the title" : "You have not achieved"}</p>
                                <p>1000$+</p>
                            </div>
                            <div className="rank-item">
                                <GiRank2 size={220} style={totalData >= 2000 ? { color: 'blue' } : { color: 'gray' }} />
                                <p>{totalData >= 2000 ? "You have earned the title" : "You have not achieved"}</p>
                                <p>2000$+</p>
                            </div>
                            <div className="rank-item">
                                <GiRank3 size={220} style={totalData >= 10000 ? { color: 'yellow' } : { color: 'gray' }} />
                                <p>{totalData >= 10000 ? "You have earned the title" : "You have not achieved"}</p>
                                <p>10000$+</p>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUser;
