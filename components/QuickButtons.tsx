'use client';

import { useState } from "react";

interface QuickButtonsProps {
  onButtonClick: (topic: string) => void;
}

export default function QuickButtons({ onButtonClick }: QuickButtonsProps) {
  const topics = [
    { id: 1, label: "Famille", icon: "👨‍👩‍👧‍👦" },
    { id: 2, label: "Souvenirs", icon: "📸" },
    { id: 3, label: "Conseils", icon: "💡" },
    { id: 4, label: "Recettes", icon: "🍳" },
    { id: 5, label: "Santé", icon: "❤️" },
    { id: 6, label: "Vie quotidienne", icon: "🏡" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
        Sujets rapides
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onButtonClick(topic.label)}
            className={`
              flex flex-col items-center justify-center p-4 border border-gray-300 dark:border-gray-600
              rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
              transition-all duration-200
            `}
          >
            <span className="text-2xl mb-2">{topic.icon}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {topic.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}