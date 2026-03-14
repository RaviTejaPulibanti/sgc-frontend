// src/components/ClubHome.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { 
  Users, 
  Calendar, 
  Trophy, 
  ArrowRight,
  Sparkles,
  GraduationCap,
  Palette,
  Code,
  Music,
  Camera,
  BookOpen
} from 'lucide-react';

const ClubHome = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const stats = [
    { label: 'Active Clubs', value: '19+', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Events Yearly', value: '50+', icon: Calendar, color: 'from-purple-500 to-purple-600' },
    { label: 'Achievements', value: '100+', icon: Trophy, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Active Members', value: '500+', icon: GraduationCap, color: 'from-green-500 to-green-600' },
  ];

  const clubCategories = [
    { name: 'Technical', icon: Code, color: 'blue', clubs: ['Coding Club', 'Robotics', 'AI/ML'] },
    { name: 'Cultural', icon: Music, color: 'purple', clubs: ['Music Club', 'Dance Club', 'Drama'] },
    { name: 'Arts', icon: Palette, color: 'pink', clubs: ['Fine Arts', 'Photography', 'Design'] },
    { name: 'Academic', icon: BookOpen, color: 'green', clubs: ['Quiz Club', 'Debate', 'Literature'] },
  ];

  const featuredEvents = [
    {
      id: 1,
      title: 'Tech Fest 2026',
      club: 'Technical Council',
      date: 'March 15-20',
      image: '/events/techfest.jpg',
    },
    {
      id: 2,
      title: 'Cultural Night',
      club: 'Cultural Council',
      date: 'April 5',
      image: '/events/cultural.jpg',
    },
    {
      id: 3,
      title: 'Sports Meet',
      club: 'Sports Council',
      date: 'April 10-15',
      image: '/events/sports.jpg',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center p-2 bg-white/20 backdrop-blur-sm rounded-full mb-8"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Welcome to Student Gymkhana Center</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Passion
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Join 19+ vibrant clubs, participate in exciting events, and be part of a community that celebrates talent, creativity, and leadership.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/clubs"
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Explore Clubs
              </Link>
              <Link
                href="/events"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-300"
              >
                View Events
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`inline-flex p-3 bg-gradient-to-br ${stat.color} rounded-xl mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="var(--background)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Club Categories */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Club Categories
            </h2>
            <p className="text-foreground-secondary max-w-2xl mx-auto">
              Explore diverse clubs across multiple categories. Find your passion and join a community of like-minded individuals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubCategories.map((category, index) => {
              const Icon = category.icon;
              const colors = {
                blue: 'from-blue-500 to-blue-600',
                purple: 'from-purple-500 to-purple-600',
                pink: 'from-pink-500 to-pink-600',
                green: 'from-green-500 to-green-600',
              };
              
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  <div className="bg-card-bg rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`inline-flex p-3 bg-gradient-to-br ${colors[category.color as keyof typeof colors]} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">{category.name}</h3>
                    
                    <ul className="space-y-2 mb-4">
                      {category.clubs.map((club) => (
                        <li key={club} className="text-foreground-secondary text-sm flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                          {club}
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      href={`/clubs?category=${category.name.toLowerCase()}`}
                      className="inline-flex items-center text-primary hover:text-primary-hover font-medium text-sm group/link"
                    >
                      Explore {category.name} Clubs
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Events
            </h2>
            <p className="text-foreground-secondary max-w-2xl mx-auto">
              Don't miss out on these upcoming events. Register now and be part of something amazing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-card-bg rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 group-hover:scale-110 transition-transform duration-500" />
                    
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                        {event.club}
                      </span>
                    </div>
                    
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-3 py-1 bg-primary text-white text-xs rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center text-foreground-secondary text-sm mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    
                    <Link
                      href={`/events/${event.id}`}
                      className="inline-flex items-center text-primary hover:text-primary-hover font-medium"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join a club, participate in events, and create memories that last a lifetime.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/subscribe"
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Subscribe for Updates
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ClubHome;