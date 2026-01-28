"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { questionSteps, HookahPreferences } from "./questions";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { useTranslations } from "@/hooks";
import toast from "react-hot-toast";

interface HookahQuestionnaireProps {
  onComplete: (result: any) => void;
}

export const HookahQuestionnaire = ({ onComplete }: HookahQuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<HookahPreferences>({
    defaultValues: {
      name: "",
      tastes: [],
      zodiacSign: "",
      moods: [],
      intensity: "",
    },
  });

  const formValues = watch();

  // Check if at least one preference is selected
  const hasAnyPreference = () => {
    return (
      (formValues.name && formValues.name.trim().length > 0) ||
      (formValues.tastes && formValues.tastes.length > 0) ||
      (formValues.zodiacSign && formValues.zodiacSign.length > 0) ||
      (formValues.moods && formValues.moods.length > 0) ||
      (formValues.intensity && formValues.intensity.length > 0)
    );
  };

  const currentQuestion = questionSteps[currentStep - 1];
  const isLastStep = currentStep === questionSteps.length;

  const handleNext = () => {
    if (currentStep < questionSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: HookahPreferences) => {
    if (!hasAnyPreference()) {
      toast.error(t('hookahPicker.selectAtLeastOne', 'Please select at least one preference'));
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading(t('hookahPicker.generatingMixes', 'Generating your perfect hookah mix...'));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/hookah-picker/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t('hookahPicker.failedToGenerate', 'Failed to generate suggestions'));
      }

      toast.success(t('hookahPicker.suggestionsReady', 'Your hookah suggestions are ready!'), { id: loadingToast });
      onComplete(result);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || t('hookahPicker.failedToGenerate', 'Failed to generate suggestions'), { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {t('hookahPicker.step', 'Step')} {currentStep} {t('hookahPicker.of', 'of')} {questionSteps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / questionSteps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / questionSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Question Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{currentQuestion.title}</h2>
          {currentQuestion.subtitle && (
            <p className="text-gray-600">{currentQuestion.subtitle}</p>
          )}
        </div>

        {/* Question Content */}
        <div className="min-h-[300px]">
          {currentQuestion.type === "text" && (
            <input
              {...register(currentQuestion.fieldName as any)}
              type="text"
              placeholder="Enter your name (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}

          {currentQuestion.type === "checkbox" && currentQuestion.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <input
                    type="checkbox"
                    {...register(currentQuestion.fieldName as any)}
                    value={option.value}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-lg">{option.label}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === "radio" && currentQuestion.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <input
                    type="radio"
                    {...register(currentQuestion.fieldName as any)}
                    value={option.value}
                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-lg">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('common.previous', 'Previous')}
          </button>

          {!isLastStep ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('common.next', 'Next')}
            </button>
          ) : (
            <PrimaryButton
              text={t('hookahPicker.getSuggestions', 'Get Suggestions')}
              isLoading={isLoading}
              isDisabled={!hasAnyPreference() || isLoading}
            />
          )}
        </div>

        {isLastStep && !hasAnyPreference() && (
          <p className="text-center text-sm text-red-500 mt-2">
            {t('hookahPicker.selectAtLeastOne', 'Please select at least one preference to get suggestions')}
          </p>
        )}
      </form>
    </div>
  );
};
