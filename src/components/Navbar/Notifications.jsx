import React, { useEffect, useState } from 'react';
import NavBar from './Navbar_admin';

const Notifications = () => {
    const [enquiries, setEnquiries] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const response = await fetch(`https://books-adda-backend.onrender.com/feedback`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                const data = await response.json();
                setEnquiries(data);
            } catch (error) {
                console.error('Error fetching enquiries:', error);
            }
        };

        fetchEnquiries();
    }, [userId]);

    return (
        <>
            <div className="flex flex-col lg:flex-row">
                <NavBar />
                <div className="container mx-auto mt-8 px-4 lg:px-16 mb-4">

                    <h2 className="text-3xl font-semibold mb-4 text-center">Notifications</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border text-center">Name</th>
                                    <th className="py-2 px-4 border text-center">Email</th>
                                    <th className="py-2 px-4 border text-center">Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enquiries.map((enquiry) => (
                                    <tr key={enquiry.id}>
                                        <td className="py-2 px-4 border text-center">{enquiry.name}</td>
                                        <td className="py-2 px-4 border text-center">{enquiry.email}</td>
                                        <td className="py-2 px-4 border text-center">{enquiry.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notifications;
