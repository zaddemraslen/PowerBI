import { useEffect, useState } from 'react';
import { fetchStocks } from '../api/stocks';
import { Stock} from '../types/stocksType';

export const useFetchStocks = () => {
  const [data, setData] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStocks()
      .then((res) => {setData(res);
        /*console.log('Fetched stocks:', res);*/ })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
