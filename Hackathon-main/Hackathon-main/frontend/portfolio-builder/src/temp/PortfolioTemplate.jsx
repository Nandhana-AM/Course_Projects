import './PortfolioTemplate.css';
import { Mail, Code, Briefcase, Star } from "lucide-react";

export const PortfolioTemplate = ({ data }) => {
  const {
    name = "Name Not Provided",
    skills = [],
    projects = [],
    email = "Email not provided",
    socialLinks = [],
    work_experience = [], // New prop for work experience
    achievements = [], // New prop for achievements
  } = data;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg space-y-8">
      {/* Header Section */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">{name}</h1>
      </header>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Code className="w-6 h-6 text-gray-700" /> Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience Section */}
      {work_experience.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-gray-700" /> Work Experience
          </h2>
          <div className="space-y-2">
            {work_experience.map((job, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold">{job.position}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500">{job.duration}</p>
                <p className="text-gray-600">{job.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Star className="w-6 h-6 text-gray-700" /> Achievements
          </h2>
          <ul className="list-disc list-inside space-y-2">
            {achievements.map((achievement, index) => (
              <li key={index} className="text-gray-600">
                {achievement}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Project →
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <footer className="border-t pt-8 text-center space-y-4">
        <p className="flex items-center justify-center gap-2 text-gray-700">
          <Mail className="w-5 h-5 text-gray-700" />
          <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800">
            {email}
          </a>
        </p>
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </footer>
    </div>
  );
};

