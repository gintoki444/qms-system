// QueuesContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const QueuesContext = createContext();

export const QueuesProvider = ({ children }) => {
  useEffect(() => {}, []);

  const checkQueus = () => {};

  return <QueuesContext.Provider value={{checkQueus}}>{children}</QueuesContext.Provider>;
};

export const createQueues = () => {
  return useContext(QueuesContext);
};
