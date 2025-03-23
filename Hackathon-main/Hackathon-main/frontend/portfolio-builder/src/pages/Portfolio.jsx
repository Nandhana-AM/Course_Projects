import { useState } from "react";
import { fetchResumeData } from "../api.js";
import DeployedPortfolio from "./DeployedPortfolio.jsx";

const Portfolio = ({ templateId = 1 }) => {
  const [resumeData, setResumeData] = useState({
    name: "",
    phone: "",
    email: "",
    skills: [],
    achievements: [],
    work_experience: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("Please select a valid PDF file");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchResumeData(selectedFile);
      
      if (!data) {
        throw new Error("Failed to fetch resume data");
      }

      // Validate the received data
      const requiredFields = ['name', 'phone', 'email', 'skills', 'achievements', 'work_experience'];
      const missingFields = requiredFields.filter(field => !(field in data));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Update state with the fetched data
      setResumeData({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        skills: data.skills || [],
        achievements: data.achievements || [],
        work_experience: data.work_experience || []
      });
      
      setDataLoaded(true);
      console.log("Resume data successfully loaded:", data);
    } catch (err) {
      console.error("Error loading resume data:", err);
      setError(err.message || "Failed to process resume");
    } finally {
      setLoading(false);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF file
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className={`w-full py-2 px-4 rounded-md font-medium text-white 
              ${!selectedFile || loading 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? "Processing..." : "Extract Resume Data"}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Check if we have the minimum required data
  if (!resumeData.name || !resumeData.email) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-600">Resume data is incomplete</p>
        <button
          onClick={() => setDataLoaded(false)}
          className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render the portfolio with the data
  return (
    <div className="container mx-auto p-4">
      <DeployedPortfolio
        templateId={templateId}
        data={resumeData}
      />
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setDataLoaded(false)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload Different Resume
        </button>
      </div>
      
      {/* Debug section - remove in production */}
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-2">Resume Data Preview:</h2>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(resumeData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Portfolio;