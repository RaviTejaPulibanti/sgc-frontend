"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Menu, 
  X,
  Home,
  Users,
  Info,
  Calendar,
  Puzzle,
  FileText,
  ChevronRight,
  ChevronDown,
  Users2,
  UserCog,
  UsersRound,
  Code2,
  CalendarDays
} from 'lucide-react';

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: Home,
      description: 'Welcome to Gymkhana'
    },
    { 
      name: 'Board', 
      path: '/board', 
      icon: Users,
      description: 'Our leadership team',
      subsections: [
        { name: 'Advisory Board', path: '/advisory', icon: UserCog },
        { name: 'Executive Board', path: '/executive', icon: UsersRound },
        { name: 'Members', path: '/members', icon: Users2 },
        { name: 'Web Team', path: '/webteam', icon: Code2 }
      ]
    },
    { 
      name: 'About', 
      path: '/about', 
      icon: Info,
      description: 'Our story & mission'
    },
    { 
      name: 'News & Events', 
      path: '/news-events', 
      icon: Calendar,
      description: 'Updates & happenings'
    },
    { 
      name: 'Clubs', 
      path: '/clubs', 
      icon: Puzzle,
      description: 'Join our communities'
    },
    { 
      name: 'Reports', 
      path: '/reports', 
      icon: FileText,
      description: 'Annual reports & docs',
      subsections: [
        { name: '2021-2022', path: '/reports/2021-22', icon: CalendarDays },
        { name: '2022-2023', path: '/reports/2022-23', icon: CalendarDays },
        { name: '2023-2024', path: '/reports/2023-24', icon: CalendarDays },
        { name: '2024-2025', path: '/reports/2024-25', icon: CalendarDays },
        { name: '2025-2026', path: '/reports/2025-26', icon: CalendarDays }
      ]
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setOpenMobileDropdown(null);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileDropdown = (name: string) => {
    setOpenMobileDropdown(openMobileDropdown === name ? null : name);
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Logo />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl' 
            : 'py-4 bg-white dark:bg-gray-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo with animation */}
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                const hasSubsections = item.subsections && item.subsections.length > 0;
                const Icon = item.icon;
                const isDropdownOpen = activeDropdown === item.name;
                
                return (
                  <div
                    key={item.path}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {hasSubsections ? (
                      <button
                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 group ${
                          isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.path}
                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 group ${
                          isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                        
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Link>
                    )}

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isDropdownOpen && hasSubsections && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50 border border-gray-100 dark:border-gray-700"
                        >
                          {item.subsections?.map((subsection) => {
                            const SubIcon = subsection.icon;
                            const isSubActive = pathname === subsection.path;
                            
                            return (
                              <Link
                                key={subsection.path}
                                href={subsection.path}
                                className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                                  isSubActive
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                              >
                                <SubIcon className="h-4 w-4" />
                                <span>{subsection.name}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tooltip on hover for items without subsections */}
                    {!hasSubsections && (
                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-50"
                          >
                            {item.description}
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle with animation */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors overflow-hidden group"
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'dark' ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  )}
                </motion.div>
                
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Slide from Right only */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black lg:hidden"
              style={{ zIndex: 45 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel - Always from right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 right-0 h-full w-[85%] sm:w-96 bg-white dark:bg-gray-900 shadow-2xl lg:hidden overflow-y-auto"
              style={{ zIndex: 50 }}
            >
              {/* Menu Header with Gradient */}
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-6">
                <div className="absolute top-4 right-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <X className="h-5 w-5 text-white" />
                  </motion.button>
                </div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8"
                >
                  <h2 className="text-xl font-bold text-white mb-1">Menu</h2>
                  <p className="text-white/80 text-xs">Explore Student Gymkhana Center</p>
                </motion.div>
              </div>

              {/* Navigation Items */}
              <div className="p-4 pb-32">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                  const hasSubsections = item.subsections && item.subsections.length > 0;
                  const isMobileDropdownOpen = openMobileDropdown === item.name;
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="mb-1"
                    >
                      {hasSubsections ? (
                        <>
                          <button
                            onClick={() => toggleMobileDropdown(item.name)}
                            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg ${
                              isActive 
                                ? 'bg-blue-100 dark:bg-blue-900' 
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.description}
                              </p>
                            </div>
                            
                            <ChevronDown className={`h-4 w-4 transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Mobile Subsections */}
                          <AnimatePresence>
                            {isMobileDropdownOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-10 pr-2"
                              >
                                {item.subsections?.map((subsection, subIndex) => {
                                  const SubIcon = subsection.icon;
                                  const isSubActive = pathname === subsection.path;
                                  
                                  return (
                                    <motion.div
                                      key={subsection.path}
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: subIndex * 0.03 }}
                                    >
                                      <Link
                                        href={subsection.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center space-x-2 p-2.5 rounded-lg my-0.5 text-xs transition-colors ${
                                          isSubActive
                                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                      >
                                        <SubIcon className="h-3.5 w-3.5" />
                                        <span>{subsection.name}</span>
                                      </Link>
                                    </motion.div>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg ${
                            isActive 
                              ? 'bg-blue-100 dark:bg-blue-900' 
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                          
                          <ChevronRight className={`h-4 w-4 transition-transform ${
                            isActive ? 'translate-x-0.5' : ''
                          }`} />
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Menu Footer */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="fixed bottom-0 right-0 w-[85%] sm:w-96 p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      Student Gymkhana
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      © 2026 All rights reserved
                    </p>
                  </div>
                  <div className="flex space-x-1.5">
                    {['1', '2', '3'].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};

// Updated Logo Component with image logos
const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      href="/" 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="flex items-center space-x-2 sm:space-x-3"
        animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* RGUKT Logo */}
        <div className="relative">
          <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
            <Image
              src="/rgukt-logo.png"
              alt="RGUKT Logo"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 2rem, 2.5rem"
              priority
            />
          </div>
          <motion.div
            className="absolute -inset-1 bg-blue-400 rounded-full blur-lg opacity-0 group-hover:opacity-50"
            animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* SGC Logo */}
        <div className="relative">
          <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
            <Image
              src="/sgc-logo.png"
              alt="SGC Logo"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 2rem, 2.5rem"
              priority
            />
          </div>
          <motion.div
            className="absolute -inset-1 bg-purple-400 rounded-full blur-lg opacity-0 group-hover:opacity-50"
            animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <div className="flex flex-col">
          <motion.span 
            className="text-[10px] sm:text-sm font-light text-gray-500 dark:text-gray-400"
            animate={isHovered ? { y: -2 } : { y: 0 }}
          >
            STUDENT
          </motion.span>
          <motion.span 
            className="text-xs sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            animate={isHovered ? { y: 2 } : { y: 0 }}
          >
            GYMKHANA CENTER
          </motion.span>
        </div>
      </motion.div>
    </Link>
  );
};

export default Navbar;