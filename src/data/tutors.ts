import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor4 from "@/assets/tutor-4.jpg";

export interface Tutor {
  id: string;
  name: string;
  subj: string;
  price: string;
  rating: number;
  sessions: number;
  img: string;
  bio: string;
  experience: string;
  languages: string[];
  specializations: string[];
  location: string;
  education: string;
  responseTime: string;
  profilePic?: string;
  aadharFront?: string;
  aadharBack?: string;
  degree?: string;
  college?: string;
  yearOfPassing?: string;
  subjectsToTeach?: string[];
  chargePerSession?: string;
  teachingMode?: "online" | "offline" | "hybrid";
  aadharNumber?: string;
  verified?: boolean;
  applicationDate?: string;
  userId?: string;
  status?: "pending" | "approved" | "rejected";
}

export interface TutorApplication {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  mobile: string;
  profilePic: string;
  bio: string;
  experience: string;
  degree: string;
  college: string;
  yearOfPassing: string;
  specializations: string[];
  subjectsToTeach: string[];
  chargePerSession: string;
  teachingMode: "online" | "offline" | "hybrid";
  location: string;
  languages: string[];
  aadharFront: string;
  aadharBack: string;
  aadharNumber: string;
  applicationDate: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
}

export const tutors: Tutor[] = [
  {
    id: "aanya-rajput",
    name: "Aanya Rajput",
    subj: "Physics • IIT-JEE",
    price: "₹699",
    rating: 4.9,
    sessions: 1200,
    img: tutor1,
    bio: "IIT Delhi graduate with 6+ years of experience teaching Physics to JEE aspirants. My students have secured ranks under 500 in JEE Advanced. I focus on building strong conceptual foundations and problem-solving strategies.",
    experience: "6 years",
    languages: ["English", "Hindi"],
    specializations: ["IIT-JEE Physics", "Class 11-12 Physics", "NEET Physics"],
    location: "New Delhi",
    education: "B.Tech, IIT Delhi",
    responseTime: "< 1 hour",
  },
  {
    id: "rahul-mehta",
    name: "Rahul Mehta",
    subj: "Mathematics • Class 8-12",
    price: "₹599",
    rating: 4.8,
    sessions: 940,
    img: tutor2,
    bio: "Passionate mathematics teacher who believes every student can excel in math. I use visual aids and real-world examples to make abstract concepts tangible. Specialized in CBSE and ICSE curriculum for classes 8-12.",
    experience: "5 years",
    languages: ["English", "Hindi", "Gujarati"],
    specializations: ["Class 8-10 Math", "Class 11-12 Math", "CBSE/ICSE"],
    location: "Mumbai",
    education: "M.Sc Mathematics, Mumbai University",
    responseTime: "< 2 hours",
  },
  {
    id: "sara-khanna",
    name: "Sara Khanna",
    subj: "Chemistry • NEET",
    price: "₹749",
    rating: 5.0,
    sessions: 1480,
    img: tutor3,
    bio: "Chemistry wizard with a knack for simplifying the most complex reactions. Former AIIMS student with 7 years of NEET coaching experience. My unique teaching methodology covers organic, inorganic, and physical chemistry with equal depth.",
    experience: "7 years",
    languages: ["English", "Hindi", "Punjabi"],
    specializations: ["NEET Chemistry", "Organic Chemistry", "Inorganic Chemistry"],
    location: "Chandigarh",
    education: "MBBS, AIIMS Delhi",
    responseTime: "< 30 mins",
  },
  {
    id: "dev-patel",
    name: "Dev Patel",
    subj: "Spoken English",
    price: "₹499",
    rating: 4.9,
    sessions: 2100,
    img: tutor4,
    bio: "Certified IELTS trainer and communication coach. I've helped over 2000 students gain confidence in spoken English. My sessions focus on fluency, pronunciation, and real-world conversation skills.",
    experience: "8 years",
    languages: ["English", "Hindi", "Gujarati"],
    specializations: ["Spoken English", "IELTS", "Business English", "Public Speaking"],
    location: "Ahmedabad",
    education: "MA English, Gujarat University",
    responseTime: "< 1 hour",
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    subj: "Biology • NEET",
    price: "₹649",
    rating: 4.9,
    sessions: 1350,
    img: tutor1,
    bio: "Biology educator with a passion for life sciences. I make biology come alive with detailed diagrams, mnemonics, and interactive sessions. My students consistently score above 300 in NEET Biology.",
    experience: "5 years",
    languages: ["English", "Hindi"],
    specializations: ["NEET Biology", "Class 11-12 Biology", "Botany", "Zoology"],
    location: "Jaipur",
    education: "M.Sc Biology, Rajasthan University",
    responseTime: "< 1 hour",
  },
  {
    id: "arjun-nair",
    name: "Arjun Nair",
    subj: "Computer Science • Programming",
    price: "₹799",
    rating: 4.8,
    sessions: 870,
    img: tutor2,
    bio: "Full-stack developer turned educator. I teach Python, Java, Data Structures, and Web Development. My project-based approach ensures students build real-world skills while mastering CS fundamentals.",
    experience: "4 years",
    languages: ["English", "Hindi", "Malayalam"],
    specializations: ["Python", "Java", "Data Structures", "Web Development"],
    location: "Bengaluru",
    education: "B.Tech CSE, NIT Calicut",
    responseTime: "< 2 hours",
  },
  {
    id: "meera-krishnan",
    name: "Meera Krishnan",
    subj: "Mathematics • IIT-JEE",
    price: "₹749",
    rating: 5.0,
    sessions: 1600,
    img: tutor3,
    bio: "IIT Madras alumna specializing in advanced mathematics for JEE. I've mentored 50+ students who secured ranks under 1000. My teaching focuses on shortcut techniques and deep conceptual clarity.",
    experience: "8 years",
    languages: ["English", "Tamil", "Hindi"],
    specializations: ["IIT-JEE Math", "Calculus", "Algebra", "Coordinate Geometry"],
    location: "Chennai",
    education: "M.Sc Mathematics, IIT Madras",
    responseTime: "< 30 mins",
  },
  {
    id: "vikram-singh",
    name: "Vikram Singh",
    subj: "Physics • Class 6-10",
    price: "₹449",
    rating: 4.7,
    sessions: 780,
    img: tutor4,
    bio: "Making physics fun and accessible for middle school students. I use experiments, simulations, and storytelling to explain scientific concepts. My goal is to spark curiosity and love for science.",
    experience: "4 years",
    languages: ["English", "Hindi"],
    specializations: ["Class 6-10 Physics", "Science Experiments", "Olympiad Prep"],
    location: "Lucknow",
    education: "B.Sc Physics, Lucknow University",
    responseTime: "< 3 hours",
  },
  {
    id: "ananya-reddy",
    name: "Ananya Reddy",
    subj: "English Literature • Class 6-10",
    price: "₹399",
    rating: 4.8,
    sessions: 650,
    img: tutor1,
    bio: "English literature enthusiast who helps students develop strong reading, writing, and comprehension skills. I make grammar enjoyable through creative writing exercises and interactive storytelling.",
    experience: "3 years",
    languages: ["English", "Telugu", "Hindi"],
    specializations: ["English Grammar", "Creative Writing", "Reading Comprehension"],
    location: "Hyderabad",
    education: "MA English Literature, Osmania University",
    responseTime: "< 2 hours",
  },
  {
    id: "rohan-desai",
    name: "Rohan Desai",
    subj: "Economics • Class 11-12",
    price: "₹549",
    rating: 4.7,
    sessions: 520,
    img: tutor2,
    bio: "Economics tutor who connects textbook theories to real-world market scenarios. I help students understand micro and macro economics through current events, case studies, and data analysis.",
    experience: "4 years",
    languages: ["English", "Hindi", "Marathi"],
    specializations: ["Microeconomics", "Macroeconomics", "Class 11-12 Economics"],
    location: "Pune",
    education: "MA Economics, Symbiosis",
    responseTime: "< 2 hours",
  },
  {
    id: "kavita-joshi",
    name: "Kavita Joshi",
    subj: "Chemistry • Class 6-10",
    price: "₹399",
    rating: 4.8,
    sessions: 890,
    img: tutor3,
    bio: "Chemistry teacher who turns the periodic table into an adventure. I use colorful experiments and everyday examples to make chemistry relatable and exciting for young learners.",
    experience: "5 years",
    languages: ["English", "Hindi", "Marathi"],
    specializations: ["Class 6-10 Chemistry", "Science Olympiad", "Lab Experiments"],
    location: "Nagpur",
    education: "M.Sc Chemistry, Nagpur University",
    responseTime: "< 1 hour",
  },
  {
    id: "suresh-kumar",
    name: "Suresh Kumar",
    subj: "Mathematics • Class 1-5",
    price: "₹299",
    rating: 4.9,
    sessions: 1100,
    img: tutor4,
    bio: "Primary math specialist who builds number sense through games, puzzles, and hands-on activities. I help young learners develop a strong foundation in arithmetic and basic geometry.",
    experience: "6 years",
    languages: ["English", "Hindi", "Tamil"],
    specializations: ["Primary Math", "Vedic Math", "Mental Arithmetic"],
    location: "Coimbatore",
    education: "B.Ed, Bharathiar University",
    responseTime: "< 1 hour",
  },
  {
    id: "deepa-menon",
    name: "Deepa Menon",
    subj: "Biology • Class 6-10",
    price: "₹449",
    rating: 4.8,
    sessions: 720,
    img: tutor1,
    bio: "Biology teacher who brings the natural world into the classroom. I use detailed diagrams, videos, and virtual dissection tools to make biology engaging and memorable for students.",
    experience: "4 years",
    languages: ["English", "Malayalam", "Hindi"],
    specializations: ["Class 6-10 Biology", "Environmental Science", "Science Projects"],
    location: "Kochi",
    education: "M.Sc Zoology, Kerala University",
    responseTime: "< 2 hours",
  },
  {
    id: "amit-verma",
    name: "Amit Verma",
    subj: "C Programming • BTech",
    price: "₹899",
    rating: 4.9,
    sessions: 980,
    img: tutor2,
    bio: "Senior software engineer at a FAANG company teaching C programming and systems. I cover everything from basics to advanced pointers, memory management, and data structures in C.",
    experience: "10 years",
    languages: ["English", "Hindi"],
    specializations: ["C Programming", "Data Structures", "Systems Programming"],
    location: "Noida",
    education: "M.Tech CSE, IIT Kanpur",
    responseTime: "< 1 hour",
  },
  {
    id: "neha-gupta",
    name: "Neha Gupta",
    subj: "Java • BTech",
    price: "₹849",
    rating: 4.8,
    sessions: 850,
    img: tutor3,
    bio: "Java developer and educator with expertise in core and advanced Java. I teach OOP concepts, multithreading, collections framework, and Spring Boot with hands-on coding sessions.",
    experience: "7 years",
    languages: ["English", "Hindi"],
    specializations: ["Core Java", "Advanced Java", "Spring Boot", "OOP"],
    location: "Gurugram",
    education: "MCA, JNU Delhi",
    responseTime: "< 1 hour",
  },
  {
    id: "rajesh-yadav",
    name: "Rajesh Yadav",
    subj: "Python • BTech",
    price: "₹799",
    rating: 4.9,
    sessions: 1050,
    img: tutor4,
    bio: "Python expert specializing in data science and machine learning. I teach Python from basics to advanced libraries like NumPy, Pandas, and Scikit-learn with real-world projects.",
    experience: "6 years",
    languages: ["English", "Hindi"],
    specializations: ["Python", "Data Science", "Machine Learning", "NumPy/Pandas"],
    location: "Indore",
    education: "M.Tech, IIT Indore",
    responseTime: "< 30 mins",
  },
  {
    id: "swati-bose",
    name: "Swati Bose",
    subj: "Music • All Levels",
    price: "₹599",
    rating: 5.0,
    sessions: 1800,
    img: tutor1,
    bio: "Classically trained vocalist and music theory expert. I teach Hindustani classical, Bollywood singing, and music theory. My students have performed at national-level competitions.",
    experience: "12 years",
    languages: ["English", "Hindi", "Bengali"],
    specializations: ["Hindustani Classical", "Vocal Training", "Music Theory", "Guitar"],
    location: "Kolkata",
    education: "Sangeet Prabhakar, Prayag Sangeet Samiti",
    responseTime: "< 1 hour",
  },
  {
    id: "aditya-mishra",
    name: "Aditya Mishra",
    subj: "Social Science • Class 6-10",
    price: "₹349",
    rating: 4.7,
    sessions: 610,
    img: tutor2,
    bio: "History and geography enthusiast who makes social studies come alive. I use timelines, maps, documentaries, and storytelling to help students understand civilizations and cultures.",
    experience: "4 years",
    languages: ["English", "Hindi"],
    specializations: ["History", "Geography", "Civics", "Class 6-10 Social Science"],
    location: "Varanasi",
    education: "MA History, BHU",
    responseTime: "< 3 hours",
  },
  {
    id: "pooja-agarwal",
    name: "Pooja Agarwal",
    subj: "Hindi • Class 1-8",
    price: "₹299",
    rating: 4.8,
    sessions: 920,
    img: tutor3,
    bio: "Hindi language expert who makes learning the mother tongue enjoyable. I focus on grammar, composition, and literature for primary and middle school students.",
    experience: "5 years",
    languages: ["Hindi", "English"],
    specializations: ["Hindi Grammar", "Hindi Literature", "Creative Writing Hindi"],
    location: "Bhopal",
    education: "MA Hindi, Barkatullah University",
    responseTime: "< 2 hours",
  },
  {
    id: "karthik-subramaniam",
    name: "Karthik Subramaniam",
    subj: "DBMS • BTech",
    price: "₹899",
    rating: 4.9,
    sessions: 760,
    img: tutor4,
    bio: "Database expert with industry experience at Oracle. I teach SQL, relational database design, normalization, and NoSQL databases with practical projects and real-world scenarios.",
    experience: "8 years",
    languages: ["English", "Tamil", "Hindi"],
    specializations: ["SQL", "DBMS", "NoSQL", "Database Design"],
    location: "Chennai",
    education: "M.Tech, IIT Madras",
    responseTime: "< 1 hour",
  },
];
