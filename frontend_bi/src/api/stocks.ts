export const fetchStocks = async () => {
    const response = await fetch('http://localhost:8000/stocks'); // adjust if needed
    if (!response.ok) {
      throw new Error('Failed to fetch stocks data');
    }
    return response.json();
  };
  