import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createOrder = async (orderDetails, token) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in createOrder:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateOrderAddress = async (orderId, newAddress, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/orders/${orderId}/update-address`,
      { newAddress },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in updateOrderAddress:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const cancelOrder = async (orderId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in cancelOrder:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};