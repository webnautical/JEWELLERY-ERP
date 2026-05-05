import { useSelector } from 'react-redux';
import translations from '../helper/translations.json';

export const labelToKey = (label) => {
  if (!label) return '';
  return label
    .trim()
    .split(' ')
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
};

export const useTranslation = () => {
  const language = useSelector((state) => state.global?.language ?? 'en');

  const t = (key) => {
    if (!key) return '';
    
    // direct key try karo
    if (translations[language]?.[key]) return translations[language][key];
    
    // camelCase convert karke try karo
    const resolvedKey = labelToKey(key);
    return translations[language]?.[resolvedKey] || translations['en']?.[resolvedKey] || key;
  };

  return { t, language };
};