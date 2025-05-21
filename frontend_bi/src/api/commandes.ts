export const fetchCommandes = async () => {
    const response = await fetch('http://localhost:8000/commandes'); // adjust if needed
    if (!response.ok) {
      throw new Error('Failed to fetch commande data');
    }
    return response.json();
  };
  