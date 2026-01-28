"use client";

import { useState } from "react";
import Link from "next/link";
import { HookahQuestionnaire } from "../HookahQuestionnaire";
import { SuggestionsResult } from "../SuggestionsResult";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

const Picker = () => {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleComplete = (result: any) => {
    setResults(result);
    setShowResults(true);
  };

  const handleTryAgain = () => {
    setShowResults(false);
    setResults(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header with History Link and Language Switcher */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/apps/hookah-picker"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/apps/hookah-picker/history"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-semibold"
            >
              View History
            </Link>
          </div>
        </div>

        {/* Main Content */}
        {!showResults ? (
          <HookahQuestionnaire onComplete={handleComplete} />
        ) : (
          <SuggestionsResult
            suggestions={results.suggestions}
            analysis={results.analysis}
            userName={results.userName}
            onTryAgain={handleTryAgain}
          />
        )}
      </div>
    </main>
  );
};

export default Picker;