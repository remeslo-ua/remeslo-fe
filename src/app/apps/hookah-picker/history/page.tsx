"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useTranslations } from "@/hooks";

interface HistoryItem {
  id: string;
  createdAt: string;
  preferences: {
    tastes: string[];
    zodiacSign?: string;
    moods: string[];
    intensity?: string;
  };
  suggestions: Array<{
    name: string;
    ingredients: string[];
    reasoning: string;
  }>;
  analysis: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const t = useTranslations();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/hookah-picker/history", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch history");
      }

      setHistory(data.history);
    } catch (error: any) {
      console.error("Failed to fetch history:", error);
      toast.error(error.message || t('hookahPicker.failedToFetchHistory', 'Failed to fetch history'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('hookahPicker.loadingHistory', 'Loading your history...')}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('hookahPicker.history', 'Your Hookah History')}</h1>
            <p className="text-gray-600">
              {t('hookahPicker.browsePastRecommendations', 'Browse your past hookah mix recommendations')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/apps/hookah-picker/picker"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {t('hookahPicker.newSuggestions', 'New Suggestions')}
            </Link>
          </div>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              {t('hookahPicker.noHistory', 'No history yet. Generate your first hookah mix!')}
            </p>
            <Link
              href="/apps/hookah-picker/picker"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('hookahPicker.getStarted', 'Get Started')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
              const isExpanded = expandedId === item.id;
              
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {/* Summary */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(item.createdAt)}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.preferences.tastes.length > 0 && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {item.preferences.tastes.join(", ")}
                            </span>
                          )}
                          {item.preferences.zodiacSign && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                              {item.preferences.zodiacSign}
                            </span>
                          )}
                          {item.preferences.intensity && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {item.preferences.intensity}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700">{item.analysis}</p>
                      </div>
                      <button className="ml-4 text-blue-600 hover:text-blue-800">
                        {isExpanded ? "▼" : "▶"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <h3 className="font-bold text-lg mb-4">
                        {t('hookahPicker.suggestions', 'Suggested Mixes')}:
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {item.suggestions.map((suggestion, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-lg p-4 shadow"
                          >
                            <h4 className="font-bold mb-2">
                              {suggestion.name}
                            </h4>
                            <div className="mb-3">
                              <p className="text-sm font-semibold text-gray-600 mb-1">
                                {t('hookahPicker.ingredients', 'Ingredients')}:
                              </p>
                              <ul className="text-sm space-y-1">
                                {suggestion.ingredients.map((ing, i) => (
                                  <li key={i} className="text-gray-700">
                                    • {ing}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <p className="text-sm text-gray-600">
                              {suggestion.reasoning}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default HistoryPage;
