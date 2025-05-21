export const fetchEquipes = async () => {
    const response = await fetch('http://localhost:8000/equipes'); // adjust if needed
    if (!response.ok) {
      throw new Error('Failed to fetch équipe data');
    }
    return response.json();
  };
  