export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface QuestionStep {
  id: number;
  title: string;
  subtitle?: string;
  type: 'text' | 'checkbox' | 'radio';
  fieldName: 'name' | 'tastes' | 'zodiacSign' | 'moods' | 'intensity' | 'occasion';
  options?: QuestionOption[];
}

export const questionSteps: QuestionStep[] = [
  {
    id: 1,
    title: "What's your name?",
    subtitle: "Optional - just to personalize your experience",
    type: 'text',
    fieldName: 'name',
  },
  {
    id: 2,
    title: "What flavors do you enjoy?",
    subtitle: "Select all that appeal to you",
    type: 'checkbox',
    fieldName: 'tastes',
    options: [
      { id: 'fruity', label: '🍓 Fruity', value: 'fruity' },
      { id: 'minty', label: '🌿 Minty', value: 'minty' },
      { id: 'citrus', label: '🍋 Citrus', value: 'citrus' },
      { id: 'floral', label: '🌸 Floral', value: 'floral' },
      { id: 'spicy', label: '🌶️ Spicy', value: 'spicy' },
      { id: 'sweet', label: '🍬 Sweet', value: 'sweet' },
      { id: 'earthy', label: '🌱 Earthy', value: 'earthy' },
      { id: 'vanilla', label: '🍦 Vanilla/Creamy', value: 'vanilla' },
    ],
  },
  {
    id: 3,
    title: "What's your zodiac sign?",
    subtitle: "Just for fun - we'll consider your cosmic preferences",
    type: 'radio',
    fieldName: 'zodiacSign',
    options: [
      { id: 'aries', label: '♈ Aries', value: 'aries' },
      { id: 'taurus', label: '♉ Taurus', value: 'taurus' },
      { id: 'gemini', label: '♊ Gemini', value: 'gemini' },
      { id: 'cancer', label: '♋ Cancer', value: 'cancer' },
      { id: 'leo', label: '♌ Leo', value: 'leo' },
      { id: 'virgo', label: '♍ Virgo', value: 'virgo' },
      { id: 'libra', label: '♎ Libra', value: 'libra' },
      { id: 'scorpio', label: '♏ Scorpio', value: 'scorpio' },
      { id: 'sagittarius', label: '♐ Sagittarius', value: 'sagittarius' },
      { id: 'capricorn', label: '♑ Capricorn', value: 'capricorn' },
      { id: 'aquarius', label: '♒ Aquarius', value: 'aquarius' },
      { id: 'pisces', label: '♓ Pisces', value: 'pisces' },
    ],
  },
  {
    id: 4,
    title: "What's your current vibe?",
    subtitle: "How are you feeling today?",
    type: 'checkbox',
    fieldName: 'moods',
    options: [
      { id: 'relaxed', label: '😌 Relaxed & Chill', value: 'relaxed' },
      { id: 'energetic', label: '⚡ Energetic & Active', value: 'energetic' },
      { id: 'social', label: '🎉 Social & Fun', value: 'social' },
      { id: 'contemplative', label: '🧘 Contemplative & Calm', value: 'contemplative' },
      { id: 'adventurous', label: '🚀 Adventurous', value: 'adventurous' },
    ],
  },
  {
    id: 5,
    title: "Preferences & Occasion",
    subtitle: "Tell us about your session",
    type: 'radio',
    fieldName: 'intensity',
    options: [
      { id: 'light', label: '💨 Light & Smooth', value: 'light' },
      { id: 'medium', label: '🌀 Medium Intensity', value: 'medium' },
      { id: 'strong', label: '💪 Strong & Bold', value: 'strong' },
    ],
  },
];

export interface HookahPreferences {
  name?: string;
  tastes: string[];
  zodiacSign?: string;
  moods: string[];
  intensity?: string;
  occasion?: string;
}
