import React, { useState, useEffect } from 'react';
import Navbar_admin from '../Navbar/Navbar_admin';
import Purchased_charts from './charts/purchase_charts';

const PurchaseDetails = () => {
    const [purchaseDetails, setPurchaseDetails] = useState([]);

    useEffect(() => {
        fetchPurchaseDetails();
    }, []);

    const fetchPurchaseDetails = async () => {
        try {
            const response = await fetch('https://books-adda-backend.onrender.com/purchase');
            if (response.ok) {
                const details = await response.json();
                setPurchaseDetails(details);
            } else {
                console.error('Failed to fetch purchase details');
            }
        } catch (error) {
            console.error('Error fetching purchase details:', error);
        }
    };

    const groupByUser = (details) => {
        const grouped = details.reduce((acc, detail) => {
            if (!acc[detail.userId]) {
                acc[detail.userId] = {
                    userName: detail.username,
                    purchases: {}
                };
            }


            if (!acc[detail.userId].purchases[detail.bookTitle]) {
                acc[detail.userId].purchases[detail.bookTitle] = {
                    bookTitle: detail.bookTitle,
                    author: detail.author,
                    price: detail.price,
                    quantity: 0,
                    totalPrice: 0,
                    purchasedDates: []
                };
            }

            acc[detail.userId].purchases[detail.bookTitle].quantity += detail.quantity;
            acc[detail.userId].purchases[detail.bookTitle].totalPrice += detail.totalPrice;
            acc[detail.userId].purchases[detail.bookTitle].purchasedDates.push(new Date(detail.purchasedDate).toLocaleDateString());

            return acc;
        }, {});
        return Object.values(grouped);
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row">
                <Navbar_admin />
                <div className="container mx-auto mt-8 px-4 lg:px-16 mb-4">
                    <h1 className="text-3xl font-bold text-center mb-8">User Purchase Details</h1>
                    <div className="flex flex-col-2 lg:flex-row justify-center items-center">
                        <Purchased_charts />
                    </div>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">User Name</th>
                                <th className="border border-gray-300 px-4 py-2">Book Name</th>
                                <th className="border border-gray-300 px-4 py-2">Author Name</th>
                                <th className="border border-gray-300 px-4 py-2">Price of one Book</th>
                                <th className="border border-gray-300 px-4 py-2">Copies Purchased</th>
                                <th className="border border-gray-300 px-4 py-2">Total Price</th>
                                <th className="border border-gray-300 px-4 py-2">Dates of Purchase</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupByUser(purchaseDetails).map((user, index) => (
                                <React.Fragment key={index}>
                                    {Object.values(user.purchases).map((purchase, idx) => (
                                        <tr key={index + '-' + idx}>
                                            {idx === 0 && (
                                                <td className="border border-gray-300 px-4 py-2 text-center items-center" rowSpan={Object.values(user.purchases).length}>
                                                    {user.userName}
                                                </td>
                                            )}
                                            <td className="border border-gray-300 px-4 py-2 text-center">{purchase.bookTitle}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{purchase.author}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">₹{purchase.price}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{purchase.quantity}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">₹{purchase.totalPrice}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {purchase.purchasedDates.join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default PurchaseDetails;
