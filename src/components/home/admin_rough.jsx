import React, { useEffect, useState } from 'react';

const Admin = () => {
    const [loginData, setLoginData] = useState([]);

    useEffect(() => {
        const fetchLoginData = async () => {
            try {
                const response = await fetch('https://books-adda-backend.onrender.com/login-times');
                const data = await response.json();
                setLoginData(data);
            } catch (error) {
                console.error('Error fetching login data:', error);
            }
        };

        fetchLoginData();
    }, []);

    // Function to group login times by date
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

    return (
        <div className="container mx-auto mt-28">
            <h1 className="text-3xl font-bold text-center mb-4">Admin Dashboard</h1>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Username</th>
                        <th className="border border-gray-300 px-4 py-2">Date</th>
                        <th className="border border-gray-300 px-4 py-2">Login Time(s)</th>
                        <th className="border border-gray-300 px-4 py-2">Logout Time(s)</th>
                    </tr>
                </thead>
                <tbody>
                    {loginData.map((user, userIndex) =>
                        Object.entries(groupByDate(user.loginTimes)).map(([date, times]) => (
                            <tr key={`${user._id}-${date}`} className={userIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                {/* Render username only for the first row of each user */}
                                <td className="border border-gray-300 px-4 py-2" rowSpan={Object.keys(groupByDate(user.loginTimes)).length}>
                                    {user.username}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{date}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {times.map((time, index) => (
                                        <div key={index}>{new Date(time.login).toLocaleString()}</div>
                                    ))}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {times.map((time, index) => (
                                        <div key={index}>{time.logout ? new Date(time.logout).toLocaleString() : 'N/A'}</div>
                                    ))}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
