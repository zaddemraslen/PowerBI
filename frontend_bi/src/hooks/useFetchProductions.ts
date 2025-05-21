// src/hooks/useFetchProductions.ts
import { useEffect, useState } from 'react';
import { fetchProductions } from '../api/productions';
import { ProductionFlat} from '../types/ProductionType';

export const useFetchProductions = () => {
  const [data, setData] = useState<ProductionFlat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductions()
      .then((res) => {setData(res);
        /*console.log('Fetched productions:', res);*/ })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
