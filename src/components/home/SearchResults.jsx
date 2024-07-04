import React, { useState, useEffect } from "react";
import Card from './Card';

function SearchResults({ searchTerm, selectedState }) {
  const [results, setResults] = useState([]);
  const [allResults, setAllResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://tourism-and-travel-management-system.onrender.com/public/trip/');
        const data = await response.json();
        const enhancedData = data.map(post => ({
          id: post.tripId,
          title: post.tripName,
          image: post.url,
          address: post.tripAddress,
          price: post.tripPrice,
          state: post.stateName,
          city: post.cityName,
          category: post.categoryName,
        }));
        setResults(enhancedData);
        setAllResults(enhancedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredResults = allResults;
    if (searchTerm) {
      filteredResults = filteredResults.filter(result =>
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedState) {
      filteredResults = filteredResults.filter(result =>
        result.state === selectedState
      );
    }
    setResults(filteredResults);
  }, [searchTerm, selectedState, allResults]);

  return (
    <div className="flex flex-wrap justify-center">
      {results.map((result) => (
        <Card
          key={result.id}
          image={result.image}
          title={result.title}
          city={result.city}
          state={result.state}
          category={result.category}
          address={result.address}
          price={result.price}
        />
      ))}
    </div>
  );
}

export default SearchResults;
