import React, { createContext, useContext, useEffect, useState } from 'react';
import { ElementData } from '../../types';
import { PERIODIC_ELEMENTS, ATOMIC_MASSES } from '../../constants';
import { subscribeToElements, FirestoreElement } from '../../services/firestore';

interface ElementsContextValue {
  elements: ElementData[];
  atomicMasses: Record<string, number>;
  loading: boolean;
  error: string | null;
  source: 'firestore' | 'local';
}

const ElementsContext = createContext<ElementsContextValue>({
  elements: PERIODIC_ELEMENTS,
  atomicMasses: ATOMIC_MASSES,
  loading: false,
  error: null,
  source: 'local',
});

function firestoreToElementData(fe: FirestoreElement, lang: string = 'ru'): ElementData {
  return {
    number: fe.number,
    symbol: fe.symbol,
    name: fe.names[lang as keyof typeof fe.names] || fe.names.ru,
    mass: fe.mass,
    category: fe.category as ElementData['category'],
    group: fe.group,
    period: fe.period,
  };
}

export const ElementsProvider: React.FC<{ children: React.ReactNode; language?: string }> = ({
  children,
  language = 'ru',
}) => {
  const [firestoreElements, setFirestoreElements] = useState<FirestoreElement[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToElements(
      (elements) => {
        if (elements.length > 0) {
          setFirestoreElements(elements);
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Firestore elements unavailable, using local fallback:', err.message);
        setError(err.message);
        setLoading(false);
      }
    );

    // Timeout fallback — if Firestore hasn't responded in 5s, use local data
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const elements = firestoreElements
    ? firestoreElements.map((fe) => firestoreToElementData(fe, language))
    : PERIODIC_ELEMENTS;

  const atomicMasses = firestoreElements
    ? firestoreElements.reduce((acc, fe) => {
        acc[fe.symbol] = fe.mass;
        return acc;
      }, {} as Record<string, number>)
    : ATOMIC_MASSES;

  return (
    <ElementsContext.Provider
      value={{
        elements,
        atomicMasses,
        loading,
        error,
        source: firestoreElements ? 'firestore' : 'local',
      }}
    >
      {children}
    </ElementsContext.Provider>
  );
};

export function useElements(): ElementsContextValue {
  return useContext(ElementsContext);
}
