"use client";

import React from "react";

const PageUnderConstruction: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Under Construction
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          This page is currently being built.
        </p>
      </div>
    </div>
  );
};

export default PageUnderConstruction;