// api.js
import axios from "axios";
const API_BASE_URL = "http://localhost:5555/api"; // Adjust this to your backend URL

export const saveToCollections = async (userId, templateId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/${userId}/collections`,
      { templateId }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFromCollections = async (userId, templateId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/users/${userId}/collections/${templateId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveToFavorites = async (userId, templateId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/${userId}/favorites`,
      { templateId }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in saveToFavorites:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const removeFromFavorites = async (userId, templateId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/users/${userId}/favorites/${templateId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTemplateDetails = async (templateId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/templates/${templateId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getTemplateDetailEditByUser = async (userId, resumeId) => {
  if (!userId || !resumeId) {
    throw new Error("User ID or Resume ID is undefined");
  }
  try {
    const response = await axios.get(`http://localhost:5555/api/resume/edit/${userId}/${resumeId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching resume data:", error);
    throw error;
  }
};

export const saveFormData = async (uid, id, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resumes/${uid}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error saving form data:", error);
    throw error;
  }
};