"use client";

import { useTranslations } from "@/hooks";

interface Suggestion {
  name: string;
  ingredients: string[];
  reasoning: string;
}

interface SuggestionsResultProps {
  suggestions: Suggestion[];
  analysis: string;
  userName?: string;
  onTryAgain: () => void;
}

export const SuggestionsResult = ({
  suggestions,
  analysis,
  userName,
  onTryAgain,
}: SuggestionsResultProps) => {
  const t = useTranslations();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {userName ? `${userName}, ` : ''}{t('hookahPicker.perfectMixes', 'your perfect hookah mixes!')} 🌬️
        </h1>
        <p className="text-lg text-gray-600">{analysis}</p>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-blue-500"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-blue-600">
                {index + 1}
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-3">{suggestion.name}</h3>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">
                {t('hookahPicker.ingredients', 'Ingredients')}:
              </h4>
              <ul className="space-y-1">
                {suggestion.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="mr-2">🔸</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">{suggestion.reasoning}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onTryAgain}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          {t('hookahPicker.tryAgain', 'Try Again')}
        </button>
      </div>
    </div>
  );
};
