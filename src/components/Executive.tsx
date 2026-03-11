"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

interface BoardMember {
  id: number;
  name: string;
  position: string;
  image: string;
  department?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

const ExecutiveBoard: React.FC = () => {
  const { theme, systemTheme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  const boardMembers: BoardMember[] = [
    {
      id: 1,
      name: "Mr. Ravi Gedela",
      position: "Chairman",
      image: "/advisoryboard/chairman.webp",
      social: {
        linkedin: "https://www.linkedin.com/in/ravi-gedela",
      },
    },
    {
      id: 2,
      name: "Mr. P.Kutti",
      position: "Vice Chairman",
      image: "/advisoryboard/vc1.webp",
      department: "IT",
      social: {
        linkedin: "https://www.linkedin.com/in/p-kutti-123456789/",
      },
    },
    {
      id: 3,
      name: "Mrs. R.Deepa",
      position: "Vice Chairman",
      image: "/advisoryboard/vc2.webp",
      department: "IT",
      social: {
        linkedin: "https://www.linkedin.com/in/r-deepa-123456789/",
      },
    },
    {
      id: 4,
      name: "Mr. T.Narashimaappadu",
      position: "Vice Chairman",
      image: "/advisoryboard/vc3.webp",
      department: "CSE",
      social: {
        linkedin: "https://www.linkedin.com/in/t-narashimaappadu-123456789/",
      },
    },
    {
      id: 5,
      name: "K. Guna Sri",
      position: "President",
      image: "/executiveboard/president.webp",
      department: "CSE",
      social: {
        linkedin:
          "https://www.linkedin.com/in/kimidi-gunasri-38151931a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 6,
      name: "K. Jai Sheel",
      position: "Vice President (CSE)",
      image: "/executiveboard/default-avatar.jpg",
      department: "CSE",
      social: {
        linkedin:
          "https://www.linkedin.com/in/jaisheel-karlapudi-b5a558325?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 7,
      name: "K. Pavan Kumar",
      position: "Vice President (ECE)",
      image: "/executiveboard/default-avatar.jpg",
      department: "ECE",
      social: {
        linkedin: "https://www.linkedin.com/in/kyvpkr/",
      },
    },
    {
      id: 8,
      name: "Vyshnavi",
      position: "Vice President (CIVIL)",
      image: "/executiveboard/civilvp.webp",
      department: "CIVIL",
      social: {
        linkedin:
          "https://www.linkedin.com/in/vyeshnavi-kandapu-5a3033322?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 9,
      name: "G. Rakesh",
      position: "Vice President (MECH)",
      image: "/executiveboard/default-avatar.jpg",
      department: "MECH",
      social: {
        linkedin: "https://www.linkedin.com/in/g-rakesh-123456789/",
      },
    },
    {
      id: 10,
      name: "G. Nishanth Reddy",
      position: "Vice President (EEE)",
      image: "/executiveboard/eeevp.webp",
      department: "EEE",
      social: {
        linkedin:
          "https://www.linkedin.com/in/nishanth-reddy-1174a735b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 11,
      name: "K. Smily Grace",
      position: "Vice President (PUC)",
      image: "/executiveboard/pucvp2.webp",
      department: "CSE",
      social: {
        linkedin:
          "https://www.linkedin.com/in/smily-grace-kommala-1b6552325?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 12,
      name: "D. Sandhya",
      position: "Vice President (PUC)",
      image: "/executiveboard/pucvp1.webp",
      department: "ECE",
      social: {
        linkedin:
          "https://www.linkedin.com/in/sandhya-desetti-b04686297?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 13,
      name: "Y. Srinivas",
      position: "Public Relations Manager",
      image: "/executiveboard/pr.webp",
      department: "ECE",
      social: {
        linkedin:
          "https://www.linkedin.com/in/srinivas262?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 14,
      name: "P. Gangadhar",
      position: "Associate Public Relations Manager",
      image: "/executiveboard/apr1.webp",
      department: "CSE",
      social: {
        linkedin:
          "https://www.linkedin.com/in/gangadhar-pamisetty-3ba74131b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 15,
      name: "N. Govardhan",
      position: "Associate Public Relations Manager",
      image: "/executiveboard/default-avatar.jpg",
      department: "ECE",
      social: {
        linkedin:
          "https://www.linkedin.com/in/neelanti-govardhan-5548aa320?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 16,
      name: "K. Gayathri",
      position: "Social Media Manager",
      image: "/executiveboard/sm.webp",
      department: "ECE",
      social: {
        linkedin:
          "https://www.linkedin.com/in/gayathri-killada-6461b4267?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 17,
      name: "P. Gireesh Satya",
      position: "Associate Social Media Manager",
      image: "/executiveboard/asm2.webp",
      department: "EEE",
      social: {
        linkedin:
          "https://www.linkedin.com/in/gireesh-satya-170358370?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 18,
      name: "Ch. Jeevan Sai",
      position: "Associate Social Media Manager",
      image: "/executiveboard/asm1.webp",
      department: "CSE",
      social: {
        linkedin:
          "https://www.linkedin.com/in/chukka-jeevan-sai-530400335?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 19,
      name: "Harish",
      position: "Associate Web Operations Manager",
      image: "/executiveboard/awom.webp",
      department: "CSE",
      social: {
        linkedin: "https://www.linkedin.com/in/harish-123456789/",
      },
    },
    {
      id: 20,
      name: "Raviteja",
      position: "Web Operations Manager",
      image: "/executiveboard/wom.webp",
      department: "CSE",
      social: {
        linkedin: "https://www.linkedin.com/in/raviteja-123456789/",
      },
    },
  ];

  // Simple animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  // Group members by position
  const chairman = boardMembers.find(m => m.position === "Chairman");
  const viceChairmen = boardMembers.filter(m => m.position === "Vice Chairman");
  const president = boardMembers.find(m => m.position === "President");
  const others = boardMembers.filter(m => 
    m.position !== "Chairman" && 
    m.position !== "Vice Chairman" && 
    m.position !== "President"
  );

  const MemberCard = ({ member }: { member: BoardMember }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
          {member.name}
        </h3>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
          {member.position}
        </p>
        {member.department && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {member.department}
          </p>
        )}
        
        {member.social && (
          <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            {member.social.linkedin && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
            )}
            {member.social.twitter && (
              <a
                href={member.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
            )}
            {member.social.instagram && (
              <a
                href={member.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600 transition-colors"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Executive Board
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Meet the leadership team driving our vision forward
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Chairman */}
          {chairman && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Chairman
              </h2>
              <div className="max-w-xs mx-auto sm:mx-0">
                <MemberCard member={chairman} />
              </div>
            </div>
          )}

          {/* Vice Chairmen */}
          {viceChairmen.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Vice Chairmen
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {viceChairmen.map(member => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}

          {/* President */}
          {president && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                President
              </h2>
              <div className="max-w-xs mx-auto sm:mx-0">
                <MemberCard member={president} />
              </div>
            </div>
          )}

          {/* Other Members */}
          {others.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Executive Council
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {others.map(member => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ExecutiveBoard;