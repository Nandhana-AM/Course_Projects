import React, { useState } from 'react';
import { Layout, Palette, Code, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styling/CreatePort.css';
import { template } from 'handlebars';

const CreatePort = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const navigate = useNavigate();

  const templates = [
    { 
      id: 1, 
      name: 'Modern Minimal',
      icon: <Layout size={48} className="text-gray-200" />, 
      description: 'Clean and minimalist design focused on content',
      features: ['Sleek typography', 'Subtle animations', 'White space layout', 'Optimized readability'],
      bestFor: 'Professionals wanting a distraction-free portfolio',
      colorScheme: 'Monochromatic grayscale with accents'
    },
    { 
      id: 2, 
      name: 'Creative Professional',
      icon: <Palette size={48} className="text-blue-300" />,
      description: 'Bold, dynamic design for creatives',
      features: ['Gradient backgrounds', 'Card-based layout', 'Interactive elements', 'Visual emphasis'],
      bestFor: 'Designers, artists, and creative professionals',
      colorScheme: 'Vibrant gradients and bold contrasts'
    },
    { 
      id: 3, 
      name: 'Developer Portfolio',
      icon: <Code size={48} className="text-green-300" />,
      description: 'Tech-focused modern design',
      features: ['Terminal-inspired elements', 'Code syntax highlighting', 'Dark mode', 'Skill showcase'],
      bestFor: 'Developers and tech professionals',
      colorScheme: 'Dark theme with neon accents'
    }
  ];

  const handleGeneratePortfolio = () => {
    navigate('/createdportfolio', { state: { templateId: selectedTemplate } });
  };


  const selectedTemplateDetails = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="create-port-container">
  
    <div className="template-grid">
      {templates.map(template => (
        <div 
          key={template.id} 
          className={`template-card ${selectedTemplate === template.id ? 'selected-template' : ''}`} 
          onClick={() => setSelectedTemplate(template.id)}
        >
          <div className="flex flex-col items-center text-center">
            {template.icon}
            <p className="text-2xl font-bold mt-4">{template.name}</p>
            <p className="text-gray-300 mt-2 text-sm">{template.description}</p>
          </div>
        </div>
      ))}
    </div>
  
    <div className="template-details">
      <h2>{selectedTemplateDetails.name}</h2>
      <p>{selectedTemplateDetails.description}</p>
    </div>
  
    <button onClick={handleGeneratePortfolio} className="generate-btn">
      <RefreshCw size={24} /> Generate Portfolio
    </button>
  </div>
  
  );
};

export default CreatePort;
