import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { PortfolioTemplate } from "../temp/PortfolioTemplate";
import { PortfolioTemplate2 } from "../temp/PortfolioTemplate2";

const DeployedPortfolio = ({ data }) => {
  const location = useLocation(); // Get the location object
  const { templateId } = location.state || { templateId: 1 }; // Default to 1 if not provided
  const [deployUrl, setDeployUrl] = useState("");

  const deployTemplate = () => {
    const githubRepo = "varshacharappalli/Hackathon";
    const deployedUrl = `https://${githubRepo.split("/")[0]}.github.io/Hackathon/frontend/portfolio-builder/src/temp/PortfolioTemplate${templateId}.jsx`;
    setDeployUrl(deployedUrl);
  };

  // Conditional rendering based on templateId
  const SelectedTemplate = templateId === 1 ? PortfolioTemplate : PortfolioTemplate2;

  return (
    <div className="p-6 space-y-6">
      <SelectedTemplate data={data} />
      <div className="flex justify-center">
        <button
          onClick={deployTemplate}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Click to view Source Code
        </button>
      </div>
      {deployUrl && (
        <p className="mt-4 text-green-600 font-medium text-center">
          View the source code:{" "}
          <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {deployUrl}
          </a>
        </p>
      )}
    </div>
  );
};

export default DeployedPortfolio;