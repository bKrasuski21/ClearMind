import React, { useState, useEffect } from 'react'; // Import useState


export const DateTimeDisplay = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return function cleanup() {
            clearInterval(timer);
        };
    });

    const getDayOfWeek = () => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[date.getDay()];
    };

    const getFormattedDate = () => {
        return date.toLocaleDateString();
    };

    return (
        <div>
            <h2>{getDayOfWeek()}, {getFormattedDate()}</h2>
            <h3>{date.toLocaleTimeString()}</h3>
        </div>
    );
};

