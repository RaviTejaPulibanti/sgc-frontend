// app/data/clubsData.ts
export interface ClubEventType {
  id: string;
  title: string;
  date: string;
  description: string;
  clubId?: string;
}

export interface ClubType {
  id: string;
  name1: string;
  name2?: string;
  founded: number;
  about: string[];
  description: string;
  image?: string;
  heroImage: string;
  backgroundImage: string;
  events: ClubEventType[];
  members: {
    id: number;
    name: string;
    role: string;
    linkedin: string;
    image: string;
  }[];
}

export const clubsData: ClubType[] = [
  {
    id: "Arts-Craftd",
    name1: "Arts & Crafts",
    founded: 2015,
    description: "Annual technology conference featuring industry leaders",
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    backgroundImage: "/clubBgimgs/artsBg.webp",
    heroImage: "/clubimgs/arts.webp",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "coding-club",
    name1: "Coding",
    founded: 2015,
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/coding.webp",
    backgroundImage: "/clubBgimgs/codingBg.webp",
    description: "Annual technology conference featuring industry leaders",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "competitive",
    name1: "Competitive",
    name2: "",
    founded: 2015,
    description: "Annual technology conference featuring industry leaders",
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/competative.webp",
    backgroundImage: "/clubBgimgs/competativeBg.webp",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "Cultural-choreography-club",
    name1: "Cultural &",
    name2: "Choreography",
    founded: 2015,
    description: "Annual technology conference featuring industry leaders",
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/cc.webp",
    backgroundImage: "/clubBgimgs/ccBg.webp",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "d-p",
    name1: "Designing and",
    name2: "Photography",
    founded: 2015,
    description: "Annual technology conference featuring industry leaders",
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/photography.webp",
    backgroundImage: "/clubBgimgs/photographyBg.webp",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "eco-club",
    name1: "Eco",
    founded: 2015,
    description: "Annual technology conference featuring industry leaders",
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/eco.webp",
    backgroundImage: "/clubBgimgs/ecoBg.webp",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "electronics-club",
    name1: "Electronics",
    founded: 2015,
    description: "Annual technology conference featuring industry leaders",
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/electronics.webp",
    backgroundImage: "/clubBgimgs/electronics.webp",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "Finance-club",
    name1: "Finance",
    founded: 2015,
    description: "Annual technology conference featuring industry leaders",
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/finance.webp",
    backgroundImage: "/clubBgimgs/finance.webp",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "Games-sports-club",
    name1: "Sports &",
    name2: "Games",
    founded: 2015,
    description: "Annual technology conference featuring industry leaders",
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/sports.webp",
    backgroundImage: "/clubBgimgs/sportsBg.webp",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "higher-club",
    name1: "Higher Education",
    founded: 2015,
    description: "Annual technology conference featuring industry leaders",
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/hoe.webp",
    backgroundImage: "/clubBgimgs/heBg.webp",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "Internship&carrer-oppertunities",
    name1: "Internship & Career",
    name2: "Opportunities",
    founded: 2015,
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/internship.webp",
    backgroundImage: "/clubBgimgs/internshipBg.webp",
    description: "Annual technology conference featuring industry leaders",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "Lecturers-series-club",
    name1: "Lecturers",
    name2: "Series",
    founded: 2015,
    description: "Annual technology conference featuring industry leaders",
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/ls.webp",
    backgroundImage: "/clubBgimgs/lsBg.webp",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "Linguistic-club",
    name1: "Linguistic & Personality",
    name2: "Development",
    founded: 2015,
    description: "Annual technology conference featuring industry leaders",
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/linguistic.webp",
    backgroundImage: "/clubBgimgs/linguisticBg.webp",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
   {
    id: "research-club",
    name1: "Research",
    founded: 2015,
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/research.webp",
    backgroundImage: "/clubBgimgs/researchBg.webp",
    description: "Annual technology conference featuring industry leaders",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "robotics-club",
    name1: "Robotics",
    founded: 2015,
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/robotics.webp",
    backgroundImage: "/clubBgimgs/roboticsBg.webp",
    description: "Annual technology conference featuring industry leaders",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "Startup-club",
    name1: "Startup",
    founded: 2015,
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/startup.webp",
    backgroundImage: "/clubBgimgs/startupBg.webp",
    description: "Annual technology conference featuring industry leaders",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
  {
    id: "yoga-club",
    name1: "Yoga",
    founded: 2015,
    description: "Annual technology conference featuring industry leaders",
    about: [
      "The Tech Innovators Club is a vibrant community of technology enthusiasts dedicated to exploring cutting-edge innovations, sharing knowledge, and building meaningful connections.",
      "Our mission is to create a platform where students can develop technical skills, work on real-world projects, and connect with industry professionals.",
    ],
    heroImage: "/clubimgs/yoga.webp",
    backgroundImage: "/clubBgimgs/yogaBg.webp",
    events: [
      {
        id: "1",
        title: "Tech Conference 2023",
        date: "Oct 15, 2023",
        description: "Annual technology conference featuring industry leaders",
      },
      {
        id: "2",
        title: "Hackathon",
        date: "Nov 20, 2023",
        description: "24-hour coding competition with exciting prizes",
      },
    ],
    members: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Member ${i + 1}`,
      role: i % 3 === 0 ? "President" : i % 2 === 0 ? "Coordinator" : "Member",
      linkedin: `https://linkedin.com/in/member${i + 1}`,
      image: `https://i.pravatar.cc/150?img=${i + 120}`,
    })),
  },
];