import axios from "axios";

/**
 * Fetch resume data by uploading a PDF file
 * @param {File} file - PDF file to upload
 * @returns {Promise<Object>} - Resume data
 */
export const fetchResumeData = async (file) => {
  try {
    const API_URL = "http://127.0.0.1:8000/extract";
    
    // Create FormData object to handle file upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Add file metadata if available
    if (file) {
      formData.append('file_name', file.name);
      formData.append('file_size', file.size.toString());
      formData.append('file_type', file.type);
      formData.append('file_last_modified', file.lastModified.toString());
    }

    // Make a POST request with the file
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Accept': 'application/json',
        // Don't set Content-Type here - axios will set it correctly with boundary for multipart/form-data
      },
      withCredentials: false
    });
    
    console.log("API Response:", response.data);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching resume data:", error);
    if (error.response) {
      console.error("Error details:", error.response.data);
    }
    return null;
  }
};