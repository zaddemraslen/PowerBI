// src/hooks/useFetchProductions.ts
import { useEffect, useState } from 'react';
import { fetchCommandes } from '../api/commandes';
import { Commande} from '../types/CommandeType';

export const useFetchCommandes = () => {
  const [data, setData] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCommandes()
      .then((res) => {setData(res);
        console.log('Fetched commandes:', res); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
