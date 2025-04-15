const API_URL = process.env.REACT_APP_API_URL;

export const getTransactions = async () => {
  const token = localStorage.getItem('token');
  return await axios.get(`${API_URL}/api/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addTransaction = async (transaction) => {
  const token = localStorage.getItem('token');
  return await axios.post(`${API_URL}/api/transactions`, transaction, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTransaction = async (id) => {
  const token = localStorage.getItem('token');
  return await axios.delete(`${API_URL}/api/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
