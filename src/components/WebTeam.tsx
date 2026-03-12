// app/components/WebTeam.tsx
"use client";

import { FaLinkedin, FaGithub } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  linkedin: string;
  github?: string;
  image: string;
}

const WebTeam = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "M. Rakesh",
      role: "Fullstack Developer",
      department: "Web Development",
      linkedin: "https://www.linkedin.com/in/rakesh-mummana-16379931a",
      github: "https://github.com",
      image: "/webteam/m1.webp",
    },
    {
      id: 2,
      name: "P. Raviteja",
      role: "Frontend Developer",
      department: "Web Development",
      linkedin: "https://www.linkedin.com/in/ravi-teja-pulibanti-28872132b",
      github: "https://github.com",
      image: "/webteam/m2.webp",
    },
    {
      id: 3,
      name: "Harish Majji",
      role: "Backend Developer",
      department: "Web Development",
      linkedin: "https://www.linkedin.com/in/majji-harish-064376325",
      github: "https://github.com",
      image: "/webteam/m3.webp",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900" id="team">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
            OUR TEAM
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Team
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Team Grid - 3 cards per row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Image Container - Perfect square for consistent sizing */}
                <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Social Icons Overlay - Appears on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 transform hover:scale-110"
                      aria-label={`Connect with ${member.name} on LinkedIn`}
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-300 transform hover:scale-110"
                        aria-label={`View ${member.name}'s GitHub`}
                      >
                        <FaGithub className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content - Exactly like your screenshot */}
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {member.department}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebTeam;