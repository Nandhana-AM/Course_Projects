import './PortfolioTemplate2.css';
import { Mail, Code, Briefcase, Star } from "lucide-react";

export const PortfolioTemplate2 = ({ data }) => {
  const {
    name = "Name Not Provided",
    skills = [],
    projects = [],
    email = "Email not provided",
    socialLinks = [],
    work_experience = [],
    achievements = [],
  } = data;

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-100 to-blue-100 p-8 rounded-lg shadow-xl space-y-8">
      {/* Header Section */}
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold text-gray-900">{name}</h1>
      </header>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold flex items-center gap-2">
            <Code className="w-6 h-6 text-purple-700" /> Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full text-sm font-medium shadow-md"
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
          <h2 className="text-3xl font-semibold flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-700" /> Work Experience
          </h2>
          <div className="space-y-2">
            {work_experience.map((job, index) => (
              <div key={index} className="border-l-4 border-purple-500 bg-white rounded-lg p-4 shadow-md">
                <h3 className="text-xl font-semibold">{job.position}</h3>
                <p className="text-gray-700">{job.company}</p>
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
          <h2 className="text-3xl font-semibold flex items-center gap-2">
            <Star className="w-6 h-6 text-purple-700" /> Achievements
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
          <h2 className="text-3xl font-semibold">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 bg-white hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 font-medium"
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
          <Mail className="w-5 h-5 text-purple-700" />
          <a href={`mailto:${email}`} className="text-purple-600 hover:text-purple-800">
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