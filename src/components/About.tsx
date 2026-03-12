// app/about/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const AboutPage = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20 px-4 border-b border-gray-200 dark:border-gray-700">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              About Our <span className="text-blue-600 dark:text-blue-400">SGC</span>
            </h1>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto my-6"></div>
          </motion.div>
          <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            &ldquo;The Vibrant Role of the Students&apos; Gymkhana Centre (SGC), in the
            heart of our campus community...&rdquo;
          </motion.p>
        </motion.div>
      </section>

      {/* Director Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[450px] w-full rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/advisoryboard/director.webp"
                  alt="Director"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Message from the Director
              </h2>
              <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium">
                Director
              </div>
              <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed">
                I am delighted to share my thoughts on the pivotal role of the
                Students&apos; Gymkhana Center (SGC) in fostering both curricular and
                extracurricular activities. Our commitment to balancing academics
                with a diverse array of activities is a cornerstone of our
                educational philosophy, ensuring the &ldquo;holistic development of
                the students&rdquo;. The SGC stands as a testament to our dedication to
                creating a comprehensive development platform. Through the
                technical wing, cultural wing, and sports wing, we provide
                numerous opportunities for students to explore their interests,
                develop their talents, and grow as individuals.
              </blockquote>
              <div className="pt-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">Dr. Amarendra Kumar Sandra</p>
                <p className="text-gray-600 dark:text-gray-400">Director</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chairman Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative md:order-2"
            >
              <div className="relative h-[450px] w-full rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/advisoryboard/chairman.webp"
                  alt="Chairman"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-5 md:order-1"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                From the Chairman&apos;s Desk
              </h2>
              <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm font-medium">
                Chairman, SGC
              </div>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  The Vibrant Role of the Students&apos; Gymkhana Centre (SGC), in the
                  heart of our campus community lies a hub of extra curricular and
                  co-curricular activities. The Students&apos; Gymkhana Centre (SGC)
                  stands as a testament to the dedication and passion for nurturing
                  students&apos; holistic development with a rich background in student
                  development.
                </p>
                <p>
                  The Chairman brings wealth of experience to the table, having co-founded 
                  the Student Development Campus Activities Cell (SDCAC) at RGUKT Nuzvid in 
                  2013, later establishing the Students&apos; Gymkhana Centre (SGC) at RGUKT-
                  Srikakulam in 2022. His vision is clear: To empower students across 
                  diverse interests, providing them with a platform to explore, grow, and excel.
                </p>
              </div>
              <div className="pt-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">Dr. Ravi Gedela</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">M.Sc, M.Tech (IIT G) (Ph.D IIT G)</p>
                <p className="text-gray-600 dark:text-gray-400">Chairman, SGC</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-white dark:bg-gray-900"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Vision
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Beyond extracurricular pursuits, the SGC fosters leadership
              development, skill acquisition, and meaningful social interaction,
              ensuring that students thrive both inside and outside the classroom.
              At the heart of the SGC are 19 dynamic student clubs, ranging from 
              Arts & Crafts to Robotics, each offering a unique avenue for students 
              to pursue their passions and interests.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Central to the SGC&apos;s mandate is advocating for students&apos; welfare 
              and representing their interests in extracurricular matters. Through 
              enthusiastic involvement, students under the auspices of the SGC are 
              poised to shape the academic and cultural landscape of RGUKT - AP 
              Srikakulam, leaving an indelible mark on the institution&apos;s ethos and legacy.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;