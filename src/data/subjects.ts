export interface Subject {
  id: string;
  name: string;
  emoji: string;
  tutorCount: number;
  description: string;
  topics?: string[];
}

export interface SubjectCategory {
  id: string;
  name: string;
  subtitle: string;
  subjects: Subject[];
}

export const subjectCategories: SubjectCategory[] = [
  {
    id: "class-1-5",
    name: "Class 1–5",
    subtitle: "Build strong foundations early",
    subjects: [
      {
        id: "primary-math",
        name: "Primary Mathematics",
        emoji: "🔢",
        tutorCount: 342,
        description: "Number sense, arithmetic, basic geometry, and problem-solving skills for young learners.",
        topics: ["Addition & Subtraction", "Multiplication & Division", "Fractions", "Basic Geometry", "Measurement", "Patterns"],
      },
      {
        id: "primary-english",
        name: "English (Primary)",
        emoji: "📖",
        tutorCount: 418,
        description: "Reading, writing, grammar, and vocabulary building for primary school students.",
        topics: ["Reading Comprehension", "Grammar Basics", "Creative Writing", "Vocabulary", "Phonics", "Spelling"],
      },
      {
        id: "primary-hindi",
        name: "Hindi (Primary)",
        emoji: "🪷",
        tutorCount: 156,
        description: "Hindi alphabet, basic grammar, and literature for young learners.",
        topics: ["Varnmala", "Shabd Rachna", "Vakya", "Kahaniya", "Hindi Grammar"],
      },
      {
        id: "primary-science",
        name: "Environmental Science",
        emoji: "🌱",
        tutorCount: 198,
        description: "Explore the natural world through fun experiments and observations.",
        topics: ["Plants & Animals", "Weather", "Our Body", "Food & Nutrition", "Water", "Air"],
      },
      {
        id: "primary-evs",
        name: "General Knowledge",
        emoji: "🧠",
        tutorCount: 124,
        description: "Fun facts, current affairs, and general awareness for curious young minds.",
        topics: ["Current Affairs", "Famous Personalities", "Countries & Capitals", "Science Facts", "Sports"],
      },
      {
        id: "vedic-math",
        name: "Vedic Mathematics",
        emoji: "🕉️",
        tutorCount: 87,
        description: "Ancient Indian techniques for fast mental calculations and math tricks.",
        topics: ["Sutras", "Mental Math", "Quick Calculations", "Number Patterns"],
      },
    ],
  },
  {
    id: "class-6-10",
    name: "Class 6–10",
    subtitle: "Excel in middle & high school",
    subjects: [
      {
        id: "math-6-10",
        name: "Mathematics",
        emoji: "📐",
        tutorCount: 1240,
        description: "Algebra, geometry, trigonometry, and statistics for middle and high school students.",
        topics: ["Algebra", "Geometry", "Trigonometry", "Statistics", "Mensuration", "Number Systems"],
      },
      {
        id: "physics-6-10",
        name: "Physics",
        emoji: "⚛️",
        tutorCount: 892,
        description: "Mechanics, optics, electricity, and magnetism with hands-on experiments.",
        topics: ["Motion", "Force", "Energy", "Light", "Electricity", "Magnetism"],
      },
      {
        id: "chemistry-6-10",
        name: "Chemistry",
        emoji: "🧪",
        tutorCount: 734,
        description: "Elements, compounds, reactions, and the periodic table made easy.",
        topics: ["Periodic Table", "Chemical Reactions", "Acids & Bases", "Metals", "Organic Chemistry"],
      },
      {
        id: "biology-6-10",
        name: "Biology",
        emoji: "🧬",
        tutorCount: 512,
        description: "Cell biology, genetics, ecology, and human physiology for school students.",
        topics: ["Cell Biology", "Genetics", "Human Body", "Ecology", "Evolution", "Microorganisms"],
      },
      {
        id: "english-6-10",
        name: "English",
        emoji: "📚",
        tutorCount: 2108,
        description: "Grammar, literature, creative writing, and comprehension skills.",
        topics: ["Grammar", "Literature", "Creative Writing", "Comprehension", "Poetry", "Essay Writing"],
      },
      {
        id: "social-science",
        name: "Social Science",
        emoji: "🌍",
        tutorCount: 456,
        description: "History, geography, civics, and economics for a well-rounded understanding.",
        topics: ["History", "Geography", "Civics", "Economics", "Indian Constitution"],
      },
      {
        id: "computer-6-10",
        name: "Computer Science",
        emoji: "💻",
        tutorCount: 312,
        description: "Introduction to computers, programming basics, and digital literacy.",
        topics: ["MS Office", "Scratch Programming", "HTML Basics", "Internet Safety", "Typing"],
      },
      {
        id: "science-olympiad",
        name: "Science Olympiad",
        emoji: "🏆",
        tutorCount: 198,
        description: "Preparation for NSO, NSTSE, and other science olympiads.",
        topics: ["Logical Reasoning", "Science MCQs", "Puzzle Solving", "Mock Tests"],
      },
    ],
  },
  {
    id: "class-11-12",
    name: "Class 11–12",
    subtitle: "Board exams & competitive prep",
    subjects: [
      {
        id: "math-11-12",
        name: "Mathematics (11-12)",
        emoji: "📊",
        tutorCount: 980,
        description: "Advanced calculus, algebra, and probability for board exams and JEE.",
        topics: ["Calculus", "Probability", "Vectors", "3D Geometry", "Linear Programming", "Matrices"],
      },
      {
        id: "physics-11-12",
        name: "Physics (11-12)",
        emoji: "🔭",
        tutorCount: 876,
        description: "Advanced mechanics, electromagnetism, optics, and modern physics.",
        topics: ["Mechanics", "Thermodynamics", "Waves", "Optics", "Electromagnetism", "Modern Physics"],
      },
      {
        id: "chemistry-11-12",
        name: "Chemistry (11-12)",
        emoji: "⚗️",
        tutorCount: 712,
        description: "Physical, organic, and inorganic chemistry for boards and NEET.",
        topics: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Electrochemistry", "Solutions"],
      },
      {
        id: "biology-11-12",
        name: "Biology (11-12)",
        emoji: "🦠",
        tutorCount: 634,
        description: "Advanced biology for NEET aspirants and board exam preparation.",
        topics: ["Genetics", "Biotechnology", "Ecology", "Human Physiology", "Plant Physiology", "Reproduction"],
      },
      {
        id: "economics-11-12",
        name: "Economics",
        emoji: "📈",
        tutorCount: 388,
        description: "Micro and macro economics with real-world case studies.",
        topics: ["Microeconomics", "Macroeconomics", "Indian Economy", "Statistics", "Banking"],
      },
      {
        id: "english-11-12",
        name: "English (11-12)",
        emoji: "✍️",
        tutorCount: 567,
        description: "Advanced literature, writing skills, and board exam preparation.",
        topics: ["Literature Analysis", "Essay Writing", "Grammar", "Comprehension", "Creative Writing"],
      },
      {
        id: "commerce",
        name: "Commerce",
        emoji: "💼",
        tutorCount: 445,
        description: "Accountancy, business studies, and economics for commerce stream.",
        topics: ["Accountancy", "Business Studies", "Economics", "Financial Statements"],
      },
      {
        id: "jee-prep",
        name: "IIT-JEE Prep",
        emoji: "🚀",
        tutorCount: 1200,
        description: "Comprehensive preparation for JEE Main and Advanced.",
        topics: ["JEE Physics", "JEE Math", "JEE Chemistry", "Mock Tests", "Previous Year Papers"],
      },
      {
        id: "neet-prep",
        name: "NEET Prep",
        emoji: "🩺",
        tutorCount: 1450,
        description: "Complete NEET preparation with biology, physics, and chemistry.",
        topics: ["NEET Biology", "NEET Physics", "NEET Chemistry", "Mock Tests", "AIIMS Prep"],
      },
    ],
  },
  {
    id: "programming",
    name: "Programming Languages",
    subtitle: "Code your way to the future",
    subjects: [
      {
        id: "python",
        name: "Python",
        emoji: "🐍",
        tutorCount: 654,
        description: "From basics to advanced Python including data science and web development.",
        topics: ["Python Basics", "OOP in Python", "NumPy & Pandas", "Django/Flask", "Data Science", "Automation"],
      },
      {
        id: "java",
        name: "Java",
        emoji: "☕",
        tutorCount: 487,
        description: "Core and advanced Java programming with OOP concepts and frameworks.",
        topics: ["Core Java", "OOP", "Collections", "Multithreading", "Spring Boot", "JDBC"],
      },
      {
        id: "c-programming",
        name: "C Programming",
        emoji: "⚙️",
        tutorCount: 398,
        description: "Master the fundamentals of C programming and systems-level coding.",
        topics: ["Pointers", "Memory Management", "Data Structures", "File I/O", "Algorithms"],
      },
      {
        id: "javascript",
        name: "JavaScript",
        emoji: "🟨",
        tutorCount: 534,
        description: "Modern JavaScript for web development, including ES6+ and frameworks.",
        topics: ["ES6+", "DOM Manipulation", "React.js", "Node.js", "Async/Await", "APIs"],
      },
      {
        id: "cpp",
        name: "C++",
        emoji: "➕",
        tutorCount: 312,
        description: "Object-oriented programming with C++ for competitive programming and software development.",
        topics: ["OOP", "STL", "Templates", "Competitive Programming", "Data Structures"],
      },
      {
        id: "web-development",
        name: "Web Development",
        emoji: "🌐",
        tutorCount: 723,
        description: "Full-stack web development with HTML, CSS, JavaScript, and modern frameworks.",
        topics: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB", "Deployment"],
      },
      {
        id: "sql-dbms",
        name: "SQL & DBMS",
        emoji: "🗄️",
        tutorCount: 289,
        description: "Database design, SQL queries, normalization, and NoSQL databases.",
        topics: ["SQL Queries", "Normalization", "ER Diagrams", "MongoDB", "PostgreSQL"],
      },
      {
        id: "data-science",
        name: "Data Science",
        emoji: "📉",
        tutorCount: 345,
        description: "Data analysis, visualization, machine learning, and statistical modeling.",
        topics: ["Statistics", "Pandas", "Matplotlib", "Scikit-learn", "ML Algorithms", "Deep Learning"],
      },
    ],
  },
  {
    id: "btech",
    name: "BTech & Engineering",
    subtitle: "Master your engineering subjects",
    subjects: [
      {
        id: "dsa",
        name: "Data Structures & Algorithms",
        emoji: "🌳",
        tutorCount: 567,
        description: "Essential DSA concepts for coding interviews and competitive programming.",
        topics: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Sorting", "Dynamic Programming", "Greedy Algorithms"],
      },
      {
        id: "operating-systems",
        name: "Operating Systems",
        emoji: "🖥️",
        tutorCount: 234,
        description: "Process management, memory management, file systems, and concurrency.",
        topics: ["Processes", "Threads", "Memory Management", "File Systems", "Scheduling", "Deadlocks"],
      },
      {
        id: "computer-networks",
        name: "Computer Networks",
        emoji: "🔗",
        tutorCount: 198,
        description: "Network protocols, architecture, and security fundamentals.",
        topics: ["OSI Model", "TCP/IP", "Routing", "Network Security", "Wireless Networks"],
      },
      {
        id: "dbms-engineering",
        name: "DBMS (Engineering)",
        emoji: "💾",
        tutorCount: 289,
        description: "Advanced database concepts, transaction management, and distributed databases.",
        topics: ["Relational Model", "SQL", "Transaction Management", "Indexing", "NoSQL", "Distributed DB"],
      },
      {
        id: "machine-learning",
        name: "Machine Learning",
        emoji: "🤖",
        tutorCount: 412,
        description: "Supervised, unsupervised, and reinforcement learning with practical projects.",
        topics: ["Linear Regression", "Classification", "Neural Networks", "CNN", "NLP", "Reinforcement Learning"],
      },
      {
        id: "cloud-computing",
        name: "Cloud Computing",
        emoji: "☁️",
        tutorCount: 178,
        description: "AWS, Azure, and cloud architecture for modern applications.",
        topics: ["AWS", "Azure", "Docker", "Kubernetes", "Serverless", "Microservices"],
      },
      {
        id: "cybersecurity",
        name: "Cybersecurity",
        emoji: "🔒",
        tutorCount: 156,
        description: "Ethical hacking, network security, and cybersecurity fundamentals.",
        topics: ["Ethical Hacking", "Cryptography", "Network Security", "Web Security", "Malware Analysis"],
      },
      {
        id: "software-engineering",
        name: "Software Engineering",
        emoji: "🏗️",
        tutorCount: 145,
        description: "SDLC, design patterns, testing, and software project management.",
        topics: ["SDLC", "Agile", "Design Patterns", "Testing", "UML", "DevOps"],
      },
    ],
  },
];

export function getSubjectById(id: string): { subject: Subject; category: SubjectCategory } | null {
  for (const category of subjectCategories) {
    const subject = category.subjects.find((s) => s.id === id);
    if (subject) {
      return { subject, category };
    }
  }
  return null;
}

export function getSubjectsByTutorId(tutorId: string): Subject[] {
  const tutor = tutors.find((t) => t.id === tutorId);
  if (!tutor) return [];
  const results: Subject[] = [];
  for (const category of subjectCategories) {
    for (const subject of category.subjects) {
      if (
        tutor.specializations.some(
          (s) =>
            s.toLowerCase().includes(subject.name.toLowerCase().split(" ")[0]) ||
            subject.name.toLowerCase().includes(s.toLowerCase().split(" ")[0])
        ) ||
        tutor.subj.toLowerCase().includes(subject.name.toLowerCase().split(" ")[0])
      ) {
        results.push(subject);
      }
    }
  }
  return results;
}

import { tutors } from "./tutors";
