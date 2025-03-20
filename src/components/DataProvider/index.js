import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [image, setImage] = useState("");

    return (
        <DataContext.Provider value={{ image, setImage }}>
            {children}
        </DataContext.Provider>
    );
};
