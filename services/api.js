// services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

// Configuração do axios com CORS
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// DEBUG: Interceptor de request
api.interceptors.request.use(
  (config) => {
    console.log('🚀 === REQUEST INTERCEPTOR ===');
    console.log('📤 URL:', config.method?.toUpperCase(), config.baseURL + config.url);
    console.log('📦 Headers:', config.headers);
    console.log('📊 Data:', config.data);
    console.log('==============================');
    return config;
  },
  (error) => {
    console.error('💥 REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// DEBUG: Interceptor de response
api.interceptors.response.use(
  (response) => {
    console.log('✅ === RESPONSE SUCCESS ===');
    console.log('📥 Status:', response.status);
    console.log('📦 Data:', response.data);
    console.log('📋 Headers:', response.headers);
    console.log('============================');
    return response;
  },
  (error) => {
    console.error('❌ === RESPONSE ERROR ===');
    console.error('📥 Status:', error.response?.status);
    console.error('📦 Data:', error.response?.data);
    console.error('📋 Headers:', error.response?.headers);
    console.error('⚡ Message:', error.message);
    console.error('🔧 Code:', error.code);
    console.error('📡 Request:', error.request);
    console.log('============================');
    return Promise.reject(error);
  }
);

/**
 * Registra um novo usuário - VERSÃO COM DEBUG COMPLETO
 */
export const register = async (username, password) => {
  console.log('🎯 === REGISTER FUNCTION START ===');
  console.log('👤 Username:', username);
  console.log('🔑 Password:', password);
  
  try {
    console.log('📤 Making POST request to /users/register...');
    
    const requestData = {
      username: username.trim(),
      password: password.trim()
    };
    
    console.log('📦 Request data:', requestData);
    
    const response = await api.post("/users/register", requestData);
    
    console.log('🎉 REGISTER SUCCESS!');
    console.log('📥 Response status:', response.status);
    console.log('📦 Response data:', response.data);
    
    return { 
      success: true, 
      status: response.status,
      data: response.data 
    };
    
  } catch (error) {
    console.error('💥 REGISTER FAILED!');
    
    // Análise detalhada do erro
    if (error.response) {
      // A API respondeu com erro
      console.error('📥 Error response received:');
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
      console.error('   Headers:', error.response.headers);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('📡 No response received:');
      console.error('   Request:', error.request);
      console.error('   This usually means:');
      console.error('   - API is not running');
      console.error('   - Network connection issue');
      console.error('   - CORS problem');
    } else {
      // Outro erro
      console.error('⚡ Request setup error:');
      console.error('   Message:', error.message);
    }
    
    console.error('🔧 Error code:', error.code);
    console.error('📝 Error config:', error.config);
    
    throw error;
  }
};

/**
 * Login do usuário
 */
export const login = async (username, password) => {
  console.log('🔐 === LOGIN FUNCTION START ===');
  
  try {
    const response = await api.post("/users/login", { 
      username: username.trim(), 
      password: password.trim() 
    });
    
    console.log('🎉 LOGIN SUCCESS!');
    return { 
      token: response.data.token, 
      success: true 
    };
    
  } catch (error) {
    console.error('💥 LOGIN FAILED!');
    throw error;
  }
};

// ... (as outras funções permanecem iguais)
export const getItems = async (token) => {
  try {
    const response = await api.get("/items", {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('💥 GET ITEMS ERROR:', error);
    throw error;
  }
};

export const createItem = async (name, token) => {
  try {
    const response = await api.post(
      "/items",
      { name: name.trim() },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('💥 CREATE ITEM ERROR:', error);
    throw error;
  }
};

export const updateItem = async (id, name, token) => {
  try {
    const response = await api.put(
      `/items/${id}`,
      { name: name.trim() },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('💥 UPDATE ITEM ERROR:', error);
    throw error;
  }
};

export const deleteItem = async (id, token) => {
  try {
    await api.delete(`/items/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return { success: true };
  } catch (error) {
    console.error('💥 DELETE ITEM ERROR:', error);
    throw error;
  }
};

export default api;