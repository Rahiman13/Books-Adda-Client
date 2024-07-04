import React, { useEffect, useState } from 'react';

const Admin = () => {
    const [loginData, setLoginData] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [editValues, setEditValues] = useState({});

    useEffect(() => {
        fetchLoginData();
    }, []);

    const fetchLoginData = async () => {
        try {
            const response = await fetch('https://books-adda-backend.onrender.com/login-times');
            const data = await response.json();
            setLoginData(data);
        } catch (error) {
            console.error('Error fetching login data:', error);
        }
    };

    const groupByDate = (loginTimes) => {
        const grouped = {};
        loginTimes.forEach((loginTime) => {
            const date = new Date(loginTime.login).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(loginTime);
        });
        return grouped;
    };

    const handleEdit = (user) => {
        setEditUser(user._id);
        setEditValues({ username: user.username, email: user.email, mobile: user.mobile });
    };

    const handleSave = async (userId) => {
        try {
            await fetch(`https://books-adda-backend.onrender.com/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editValues),
            });
            setEditUser(null);
            fetchLoginData();
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await fetch(`https://books-adda-backend.onrender.com/users/${userId}`, {
                method: 'DELETE',
            });
            fetchLoginData();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="container mx-auto mt-24 pt-4">
            <h1 className="text-3xl font-bold text-center mb-4">Admin Dashboard</h1>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Username</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Mobile</th>
                        <th className="border border-gray-300 px-4 py-2">Date</th>
                        <th className="border border-gray-300 px-4 py-2">Login Time(s)</th>
                        <th className="border border-gray-300 px-4 py-2">Logout Time(s)</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loginData.map((user, userIndex) => {
                        const groupedLoginTimes = groupByDate(user.loginTimes);
                        return Object.entries(groupedLoginTimes).map(([date, times], index) => (
                            <tr key={`${user._id}-${date}-${index}`} className={userIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                {index === 0 && (
                                    <>
                                        <td className="border border-gray-300 px-4 py-2" rowSpan={Object.keys(groupedLoginTimes).length}>
                                            {editUser === user._id ? (
                                                <input
                                                    type="text"
                                                    value={editValues.username}
                                                    onChange={(e) => setEditValues({ ...editValues, username: e.target.value })}
                                                />
                                            ) : (
                                                user.username
                                            )}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2" rowSpan={Object.keys(groupedLoginTimes).length}>
                                            {editUser === user._id ? (
                                                <input
                                                    type="email"
                                                    value={editValues.email}
                                                    onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                                                />
                                            ) : (
                                                user.email
                                            )}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2" rowSpan={Object.keys(groupedLoginTimes).length}>
                                            {editUser === user._id ? (
                                                <input
                                                    type="text"
                                                    value={editValues.mobile}
                                                    onChange={(e) => setEditValues({ ...editValues, mobile: e.target.value })}
                                                />
                                            ) : (
                                                user.mobile
                                            )}
                                        </td>
                                    </>
                                )}
                                <td className="border border-gray-300 px-4 py-2">{date}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {times.map((time, index) => (
                                        <div key={index}>{time.login ? new Date(time.login).toLocaleString() : 'N/A'}</div>
                                    ))}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {times.map((time, index) => (
                                        <div key={index}>{time.logout ? new Date(time.logout).toLocaleString() : 'N/A'}</div>
                                    ))}
                                </td>
                                {index === 0 && (
                                    <td className="border border-gray-300 px-4 py-2" rowSpan={Object.keys(groupedLoginTimes).length}>
                                        {editUser === user._id ? (
                                            <>
                                                <button
                                                    className="bg-blue-500 text-white px-4 py-2 m-1"
                                                    onClick={() => handleSave(user._id)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="bg-gray-500 text-white px-4 py-2 m-1"
                                                    onClick={() => setEditUser(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="bg-yellow-500 text-white px-4 py-2 m-1"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 m-1"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ));
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
