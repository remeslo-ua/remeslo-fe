export const useLocalStorage = (key: string) => {
  let LSItem: string | null;
  let setLSItem: (value: string) => void;
  let removeLSItem: () => void;

  if (typeof window !== 'undefined') {
    LSItem = localStorage.getItem(key);
    setLSItem = (value: string) => {
      localStorage.setItem(key, value);
    };
    removeLSItem = () => {
      localStorage.removeItem(key);
    };
    return {LSItem, setLSItem, removeLSItem};
  };

  return {LSItem: null, setLSItem: () => {}, removeLSItem: () => {}};
};