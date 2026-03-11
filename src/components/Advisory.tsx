"use client";

import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaEnvelope, FaGlobe, FaArrowRight } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes'; // Import from next-themes

interface BoardMember {
  id: number;
  name: string;
  position: string;
  department: string;
  image: string;
  bio: string;
  linkedin?: string;
  email?: string;
  website?: string;
  accentColor: string;
  isFeatured?: boolean;
}

const AdvisoryBoard = () => {
  const { theme, systemTheme } = useTheme(); // Get theme from next-themes
  const [mounted, setMounted] = useState(false);
  const [activeMember, setActiveMember] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Determine if dark mode is active
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageError = (id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  // Fallback function when image fails to load
  const getFallbackAvatar = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff&size=128`;
  };

  const boardMembers: BoardMember[] = [
    {
      id: 1,
      name: "Prof. K. V. G. D. Balaji",
      position: "Director",
      department: "University Leadership",
      image: "/advisoryboard/director.webp",
      bio: "Distinguished professor with 25 years of academic leadership experience. Spearheading our strategic initiatives and global partnerships. Authored several influential papers on educational reform. Committed to fostering innovation and excellence in higher education through transformative leadership and strategic vision.",
      linkedin: "#",
      email: "director@university.edu",
      website: "https://university.edu/director",
      accentColor: "#3B82F6",
      isFeatured: true
    },
    {
      id: 2,
      name: "Dr. Ravi Gedela",
      position: "Dean of Student Welfare",
      department: "Computer Science",
      image: "/advisoryboard/chairman.webp",
      bio: "PhD in Computer Engineering with 15 years of industry experience. Specializes in AI research and has led multiple successful tech startups. Currently heading the AI ethics committee. Passionate about mentoring students and bridging the gap between academia and industry.",
      linkedin: "#",
      email: "dsw@university.edu",
      website: "https://university.edu/dsw",
      accentColor: "#8B5CF6"
    },
    {
      id: 3,
      name: "Mr. Rama Krishna Muni",
      position: "Administrative Officer",
      department: "Business Administration",
      image: "/advisoryboard/ao.webp",
      bio: "Former CEO of TechCorp with expertise in business strategy and innovation management. Advisor to Fortune 500 companies and government think tanks on digital transformation. Brings extensive corporate experience to academic administration.",
      linkedin: "#",
      email: "ao@university.edu",
      website: "https://university.edu/ao",
      accentColor: "#10B981"
    },
    {
      id: 4,
      name: "Dr. Sivarama Krishna Merugu",
      position: "Dean Of Academics",
      department: "Electrical Engineering",
      image: "/advisoryboard/dean.webp",
      bio: "Published researcher in renewable energy systems with multiple patent awards. Leads the university's green energy initiative and international research collaborations. Recognized globally for contributions to sustainable energy solutions.",
      linkedin: "#",
      email: "da@university.edu",
      website: "https://university.edu/da",
      accentColor: "#F59E0B"
    },
    {
      id: 5,
      name: "Dr. Ch Vasu",
      position: "Finance Officer",
      department: "Mechanical Engineering",
      image: "/advisoryboard/vc1.webp",
      bio: "Industrial designer with 20+ years of experience in automotive engineering. Bridges academia and industry through innovative partnership programs and student internships. Instrumental in securing industry collaborations and research funding.",
      linkedin: "#",
      email: "fo@university.edu",
      website: "https://university.edu/fo",
      accentColor: "#EC4899"
    }
  ];

  const toggleBio = (id: number) => {
    setActiveMember(activeMember === id ? null : id);
  };

  const closeBio = () => {
    setActiveMember(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const featuredMember = boardMembers.find(m => m.isFeatured);
  const otherMembers = boardMembers.filter(m => !m.isFeatured);

  return (
    <div className="min-h-screen transition-colors duration-300"
         style={{ 
           backgroundColor: 'var(--background)',
           color: 'var(--foreground)'
         }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Advisory Board</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Visionary leaders guiding our institution's future with expertise, innovation, and dedication
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Member */}
        {featuredMember && (
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl shadow-xl overflow-hidden border"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <div 
                      className="w-40 h-40 rounded-full overflow-hidden"
                      style={{ 
                        boxShadow: `0 0 0 4px ${featuredMember.accentColor}`,
                      }}
                    >
                      {!imageErrors[featuredMember.id] ? (
                        <img
                          src={featuredMember.image}
                          alt={featuredMember.name}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(featuredMember.id)}
                        />
                      ) : (
                        <img
                          src={getFallbackAvatar(featuredMember.name)}
                          alt={featuredMember.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                      {featuredMember.name}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                      <span className="px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                        {featuredMember.position}
                      </span>
                      <span style={{ color: 'var(--foreground-secondary)' }}>
                        {featuredMember.department}
                      </span>
                    </div>
                    <p className="mb-6 line-clamp-3" style={{ color: 'var(--foreground-secondary)' }}>
                      {featuredMember.bio}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <div className="flex gap-3">
                        {featuredMember.linkedin && (
                          <a 
                            href={featuredMember.linkedin} 
                            className="p-2 rounded-lg transition-colors"
                            style={{ 
                              backgroundColor: 'var(--accent-light)',
                              color: featuredMember.accentColor
                            }}
                          >
                            <FaLinkedin className="w-5 h-5" />
                          </a>
                        )}
                        {featuredMember.email && (
                          <a 
                            href={`mailto:${featuredMember.email}`} 
                            className="p-2 rounded-lg transition-colors"
                            style={{ 
                              backgroundColor: 'var(--accent-light)',
                              color: featuredMember.accentColor
                            }}
                          >
                            <FaEnvelope className="w-5 h-5" />
                          </a>
                        )}
                        {featuredMember.website && (
                          <a 
                            href={featuredMember.website} 
                            className="p-2 rounded-lg transition-colors"
                            style={{ 
                              backgroundColor: 'var(--accent-light)',
                              color: featuredMember.accentColor
                            }}
                          >
                            <FaGlobe className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => toggleBio(featuredMember.id)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Full Bio
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Other Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="rounded-xl shadow-lg overflow-hidden border transition-all duration-300 hover:shadow-xl"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="p-6">
                {/* Image */}
                <div className="flex justify-center mb-4">
                  <div 
                    className="w-24 h-24 rounded-full overflow-hidden"
                    style={{ 
                      boxShadow: `0 0 0 2px ${member.accentColor}`,
                    }}
                  >
                    {!imageErrors[member.id] ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(member.id)}
                      />
                    ) : (
                      <img
                        src={getFallbackAvatar(member.name)}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="text-center mb-4">
                  <h3 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>{member.name}</h3>
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-2"
                    style={{ backgroundColor: member.accentColor }}
                  >
                    {member.position}
                  </span>
                  <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                    {member.department}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {member.linkedin && (
                      <a 
                        href={member.linkedin} 
                        className="p-2 rounded-lg transition-colors"
                        style={{ 
                          backgroundColor: 'var(--accent-light)',
                          color: member.accentColor
                        }}
                      >
                        <FaLinkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`} 
                        className="p-2 rounded-lg transition-colors"
                        style={{ 
                          backgroundColor: 'var(--accent-light)',
                          color: member.accentColor
                        }}
                      >
                        <FaEnvelope className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => toggleBio(member.id)}
                    className="px-4 py-2 text-sm text-white rounded-lg transition-colors"
                    style={{ backgroundColor: member.accentColor }}
                  >
                    View Bio
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bio Modal */}
      <AnimatePresence>
        {activeMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={closeBio}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--card-bg)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const member = boardMembers.find(m => m.id === activeMember);
                if (!member) return null;

                return (
                  <>
                    {/* Modal Header */}
                    <div className="p-6 border-b flex items-start gap-4" 
                         style={{ borderColor: 'var(--border)' }}>
                      <div 
                        className="w-16 h-16 rounded-full overflow-hidden"
                        style={{ 
                          boxShadow: `0 0 0 2px ${member.accentColor}`,
                        }}
                      >
                        {!imageErrors[member.id] ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={getFallbackAvatar(member.name)}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{member.name}</h3>
                        <p className="text-sm font-medium" style={{ color: member.accentColor }}>
                          {member.position}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                          {member.department}
                        </p>
                      </div>
                      <button
                        onClick={closeBio}
                        className="p-2 rounded-lg transition-colors"
                        style={{ 
                          backgroundColor: 'var(--accent-light)',
                          color: 'var(--foreground)'
                        }}
                      >
                        <IoMdClose className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6">
                      <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Biography</h4>
                      <p className="leading-relaxed mb-6" style={{ color: 'var(--foreground-secondary)' }}>
                        {member.bio}
                      </p>

                      <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Contact</h4>
                      <div className="space-y-3">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                            style={{ 
                              backgroundColor: 'var(--accent-light)',
                              color: 'var(--foreground-secondary)'
                            }}
                          >
                            <FaEnvelope style={{ color: member.accentColor }} />
                            <span className="text-sm">{member.email}</span>
                          </a>
                        )}
                        {member.website && (
                          <a
                            href={member.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                            style={{ 
                              backgroundColor: 'var(--accent-light)',
                              color: 'var(--foreground-secondary)'
                            }}
                          >
                            <FaGlobe style={{ color: member.accentColor }} />
                            <span className="text-sm">Official Website</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add line-clamp utilities */}
      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AdvisoryBoard;