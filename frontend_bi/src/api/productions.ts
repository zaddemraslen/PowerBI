export const fetchProductions = async () => {
    const response = await fetch('http://localhost:8000/productions/flat'); // adjust if needed
    if (!response.ok) {
      throw new Error('Failed to fetch production data');
    }
    return response.json();
  };
  