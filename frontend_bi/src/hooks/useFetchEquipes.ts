// src/hooks/useFetchProductions.ts
import { useEffect, useState } from 'react';
import { fetchEquipes } from '../api/equipes';
import { Equipe} from '../types/EquipesType';

export const useFetchEquipes = () => {
  const [data, setData] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipes()
      .then((res) => {setData(res);
        /*console.log('Fetched équipes:', res);*/ })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
