import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  User,
  GraduationCap,
  BookOpenCheck,
  Upload,
  X,
  CheckCircle2,
  FileText,
  Globe,
  MapPin,
  Languages,
  IndianRupee,
  Monitor,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { saveTutorApplication } from "@/lib/firebase-data";
import { subjectCategories, type Subject } from "@/data/subjects";

type Role = "student" | "tutor" | null;

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    mobile: z.string().min(10, "Enter a valid mobile number"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    agreeTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

const STATE_DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Anantapur",
    "Chittoor",
    "East Godavari",
    "Guntur",
    "Krishna",
    "Kurnool",
    "Nellore",
    "Prakasam",
    "Srikakulam",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "Kadapa",
    "Vijayawada",
    "Guntur",
  ],
  "Arunachal Pradesh": [
    "Tawang",
    "West Kameng",
    "East Kameng",
    "Papum Pare",
    "Kurung Kumey",
    "Kra Daadi",
    "Lower Subansiri",
    "Upper Subansiri",
    "West Siang",
    "East Siang",
    "Siang",
    "Upper Siang",
    "Lower Siang",
    "Lower Dibang Valley",
    "Dibang Valley",
    "Anjaw",
    "Lohit",
    "Namsai",
    "Changlang",
    "Tirap",
    "Longding",
  ],
  Assam: [
    "Baksa",
    "Barpeta",
    "Biswanath",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Hojai",
    "Jorhat",
    "Kamrup",
    "Kamrup Metropolitan",
    "Karbi Anglong",
    "Karimganj",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "South Salmara-Mankachar",
    "Tinsukia",
    "Udalguri",
    "West Karbi Anglong",
  ],
  Bihar: [
    "Araria",
    "Arwal",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "East Champaran",
    "Gaya",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Lakhisarai",
    "Madhepura",
    "Madhubani",
    "Munger",
    "Muzaffarpur",
    "Nalanda",
    "Nawada",
    "Patna",
    "Purnia",
    "Rohtas",
    "Saharsa",
    "Samastipur",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali",
    "West Champaran",
  ],
  Chhattisgarh: [
    "Balod",
    "Baloda Bazar",
    "Balrampur",
    "Bastar",
    "Bemetara",
    "Bijapur",
    "Bilaspur",
    "Dantewada",
    "Dhamtari",
    "Durg",
    "Gariaband",
    "Janjgir-Champa",
    "Jashpur",
    "Kabirdham",
    "Kanker",
    "Kondagaon",
    "Korba",
    "Korea",
    "Mahasamund",
    "Mungeli",
    "Narayanpur",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sukma",
    "Surajpur",
    "Surguja",
  ],
  Goa: ["North Goa", "South Goa"],
  Gujarat: [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udepur",
    "Dahod",
    "Dangs",
    "Devbhoomi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad",
  ],
  Haryana: [
    "Ambala",
    "Bhiwani",
    "Charkhi Dadri",
    "Faridabad",
    "Fatehabad",
    "Gurugram",
    "Hisar",
    "Jhajjar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Mahendragarh",
    "Nuh",
    "Palwal",
    "Panchkula",
    "Panipat",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
    "Yamunanagar",
  ],
  "Himachal Pradesh": [
    "Bilaspur",
    "Chamba",
    "Hamirpur",
    "Kangra",
    "Kinnaur",
    "Kullu",
    "Lahaul and Spiti",
    "Mandi",
    "Shimla",
    "Sirmaur",
    "Solan",
    "Una",
  ],
  Jharkhand: [
    "Bokaro",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "East Singhbhum",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribagh",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Pakur",
    "Palamu",
    "Ramgarh",
    "Ranchi",
    "Sahibganj",
    "Seraikela Kharsawan",
    "Simdega",
    "West Singhbhum",
  ],
  Karnataka: [
    "Bagalkot",
    "Ballari",
    "Belagavi",
    "Bengaluru Rural",
    "Bengaluru Urban",
    "Bidar",
    "Chamarajanagar",
    "Chikkaballapur",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwad",
    "Gadag",
    "Hassan",
    "Haveri",
    "Kalaburagi",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru",
    "Raichur",
    "Ramanagara",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayapura",
    "Yadgir",
  ],
  Kerala: [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
  ],
  "Madhya Pradesh": [
    "Agar Malwa",
    "Alirajpur",
    "Anuppur",
    "Ashoknagar",
    "Balaghat",
    "Barwani",
    "Betul",
    "Bhind",
    "Bhopal",
    "Burhanpur",
    "Chhatarpur",
    "Chhindwara",
    "Damoh",
    "Datia",
    "Dewas",
    "Dhar",
    "Dindori",
    "Guna",
    "Gwalior",
    "Harda",
    "Hoshangabad",
    "Indore",
    "Jabalpur",
    "Jhabua",
    "Katni",
    "Khandwa",
    "Khargone",
    "Mandla",
    "Mandsaur",
    "Morena",
    "Narsinghpur",
    "Neemuch",
    "Panna",
    "Raisen",
    "Rajgarh",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Satna",
    "Sehore",
    "Seoni",
    "Shahdol",
    "Shajapur",
    "Sheopur",
    "Shivpuri",
    "Sidhi",
    "Singrauli",
    "Tikamgarh",
    "Ujjain",
    "Umaria",
    "Vidisha",
  ],
  Maharashtra: [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Nashik",
    "Osmanabad",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal",
  ],
  Manipur: [
    "Bishnupur",
    "Chandel",
    "Churachandpur",
    "Imphal East",
    "Imphal West",
    "Jiribam",
    "Kakching",
    "Kamjong",
    "Kangpokpi",
    "Noney",
    "Pherzawl",
    "Senapati",
    "Tamenglong",
    "Tengnoupal",
    "Thoubal",
    "Ukhrul",
  ],
  Meghalaya: ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
  Mizoram: ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
  Nagaland: ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
  Odisha: [
    "Angul",
    "Balangir",
    "Balasore",
    "Bargarh",
    "Bhadrak",
    "Boudh",
    "Cuttack",
    "Debagarh",
    "Dhenkanal",
    "Gajapati",
    "Ganjam",
    "Jagatsinghpur",
    "Jajpur",
    "Jharsuguda",
    "Kalahandi",
    "Kandhamal",
    "Kendrapara",
    "Kendujhar",
    "Khordha",
    "Koraput",
    "Malkangiri",
    "Mayurbhanj",
    "Nabarangpur",
    "Nayagarh",
    "Nuapada",
    "Puri",
    "Rayagada",
    "Sambalpur",
    "Subarnapur",
    "Sundargarh",
  ],
  Punjab: [
    "Amritsar",
    "Barnala",
    "Bathinda",
    "Faridkot",
    "Fatehgarh Sahib",
    "Fazilka",
    "Ferozepur",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Kapurthala",
    "Ludhiana",
    "Malerkotla",
    "Moga",
    "Muktsar",
    "Nawanshahr",
    "Pathankot",
    "Patiala",
    "Rupnagar",
    "Sangrur",
    "Shaheed Bhagat Singh Nagar",
    "Tarn Taran",
  ],
  Rajasthan: [
    "Ajmer",
    "Alwar",
    "Banswara",
    "Baran",
    "Barmer",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Bundi",
    "Chittorgarh",
    "Churu",
    "Dausa",
    "Dholpur",
    "Dungarpur",
    "Hanumangarh",
    "Jaipur",
    "Jaisalmer",
    "Jalore",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
    "Karauli",
    "Kota",
    "Nagaur",
    "Pali",
    "Pratapgarh",
    "Rajsamand",
    "Sawai Madhopur",
    "Sikar",
    "Sirohi",
    "Sri Ganganagar",
    "Tonk",
    "Udaipur",
  ],
  Sikkim: ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "Tamil Nadu": [
    "Ariyalur",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kancheepuram",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Nagapattinam",
    "Namakkal",
    "Perambalur",
    "Pudukottai",
    "Ramanathapuram",
    "Salem",
    "Sivaganga",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
  ],
  Telangana: [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hanamkonda",
    "Hyderabad",
    "Jagitial",
    "Jangaon",
    "Jayashankar Bhupalapally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Komaram Bheem",
    "Mahabubabad",
    "Mahbubnagar",
    "Mancherial",
    "Medak",
    "Medchal",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Ranga Reddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri",
  ],
  Tripura: ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Ambedkar Nagar",
    "Amethi",
    "Amroha",
    "Auraiya",
    "Ayodhya",
    "Azamgarh",
    "Baghpat",
    "Bahraich",
    "Ballia",
    "Balrampur",
    "Banda",
    "Barabanki",
    "Bareilly",
    "Basti",
    "Bhadohi",
    "Bijnor",
    "Budaun",
    "Bulandshahr",
    "Chandauli",
    "Chitrakoot",
    "Deoria",
    "Etah",
    "Etawah",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hapur",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kannauj",
    "Kanpur Dehat",
    "Kanpur Nagar",
    "Kasganj",
    "Kaushambi",
    "Kushinagar",
    "Lakhimpur Kheri",
    "Lalitpur",
    "Lucknow",
    "Maharajganj",
    "Mahoba",
    "Mainpuri",
    "Mathura",
    "Mau",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Pilibhit",
    "Pratapgarh",
    "Prayagraj",
    "Raebareli",
    "Rampur",
    "Saharanpur",
    "Sant Kabir Nagar",
    "Sant Ravidas Nagar",
    "Shahjahanpur",
    "Shamli",
    "Shrawasti",
    "Siddharthnagar",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi",
  ],
  Uttarakhand: [
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi",
  ],
  "West Bengal": [
    "Alipurduar",
    "Bankura",
    "Birbhum",
    "Cooch Behar",
    "Dakshin Dinajpur",
    "Darjeeling",
    "Hooghly",
    "Howrah",
    "Jalpaiguri",
    "Jhargram",
    "Kalimpong",
    "Kolkata",
    "Malda",
    "Murshidabad",
    "Nadia",
    "North 24 Parganas",
    "Paschim Bardhaman",
    "Paschim Medinipur",
    "Purba Bardhaman",
    "Purba Medinipur",
    "Purulia",
    "South 24 Parganas",
    "Uttar Dinajpur",
  ],
  Delhi: ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Jammu and Kashmir": [
    "Anantnag",
    "Bandipora",
    "Baramulla",
    "Budgam",
    "Doda",
    "Ganderbal",
    "Jammu",
    "Kargil",
    "Kathua",
    "Kishtwar",
    "Kulgam",
    "Kupwara",
    "Leh",
    "Poonch",
    "Pulwama",
    "Rajouri",
    "Ramban",
    "Reasi",
    "Samba",
    "Shopian",
    "Srinagar",
    "Udhampur",
  ],
  Ladakh: ["Kargil", "Leh"],
};

const INDIAN_STATES = Object.keys(STATE_DISTRICTS);

const INDIAN_CITIES = [
  "New Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "Lucknow",
  "Indore",
  "Kochi",
  "Nagpur",
  "Coimbatore",
  "Bhopal",
  "Varanasi",
  "Gurgaon",
  "Noida",
  "Patna",
  "Surat",
  "Thane",
  "Visakhapatnam",
  "Mangalore",
  "Mysore",
  "Dehradun",
  "Ranchi",
  "Bhubaneswar",
  "Goa",
  "Jammu",
  "Faridabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Vadodara",
  "Rajkot",
  "Meerut",
  "Kanpur",
  "Prayagraj",
  "Ghaziabad",
];

const LANGUAGES = [
  "English",
  "Hindi",
  "Punjabi",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Marathi",
  "Gujarati",
  "Bengali",
  "Kannada",
  "Urdu",
  "Odia",
  "Assamese",
  "Rajasthani",
  "Bhojpuri",
  "Haryanvi",
];

const SPECIALIZATIONS = [
  "NEET Chemistry",
  "NEET Physics",
  "NEET Biology",
  "JEE Physics",
  "JEE Math",
  "JEE Chemistry",
  "Organic Chemistry",
  "Inorganic Chemistry",
  "Physical Chemistry",
  "Class 8-10 Math",
  "Class 11-12 Math",
  "Class 8-10 Science",
  "Class 11-12 Physics",
  "Class 11-12 Chemistry",
  "Class 11-12 Biology",
  "CBSE/ICSE Math",
  "CBSE/ICSE Science",
  "CBSE/ICSE English",
  "Spoken English",
  "Grammar & Writing",
  "Python Programming",
  "Java Programming",
  "C/C++ Programming",
  "Web Development",
  "Data Science",
  "Machine Learning",
  "Robotics",
  "Abacus & Vedic Math",
  "Hindi Literature",
  "Sanskrit",
  "Social Science",
  "Economics",
  "Accountancy",
  "Business Studies",
];

const ALL_SUBJECTS = subjectCategories.flatMap((cat) => cat.subjects);

interface TutorFormData {
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
  state: string;
  district: string;
  city: string;
  pinCode: string;
  fullAddress: string;
  languages: string[];
  aadharFront: string;
  aadharBack: string;
}

const initialTutorData: TutorFormData = {
  profilePic: "",
  bio: "",
  experience: "",
  degree: "",
  college: "",
  yearOfPassing: "",
  specializations: [],
  subjectsToTeach: [],
  chargePerSession: "",
  teachingMode: "online",
  state: "",
  district: "",
  city: "",
  pinCode: "",
  fullAddress: "",
  languages: [],
  aadharFront: "",
  aadharBack: "",
};

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function compressImage(file: File, maxBase64Length: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxWidth = 1200;
        const maxHeight = 1200;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        while (dataUrl.length > maxBase64Length && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        if (dataUrl.length > maxBase64Length) {
          canvas.width = Math.round(width / 1.5);
          canvas.height = Math.round(height / 1.5);
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          quality = 0.7;
          dataUrl = canvas.toDataURL("image/jpeg", quality);

          while (dataUrl.length > maxBase64Length && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
        }

        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function validateStep1(data: SignupForm): string | null {
  if (!data.fullName || data.fullName.length < 2) return "Full name must be at least 2 characters";
  if (!data.mobile || data.mobile.length < 10) return "Enter a valid mobile number";
  if (!data.email || !z.string().email().safeParse(data.email).success) return "Enter a valid email address";
  if (!data.password || data.password.length < 6) return "Password must be at least 6 characters";
  if (data.password !== data.confirmPassword) return "Passwords do not match";
  if (!data.agreeTerms) return "You must agree to the terms";
  return null;
}

function validateTutorStep2(data: TutorFormData): string | null {
  if (!data.profilePic) return "Please upload a profile picture";
  if (!data.bio || data.bio.length < 100) return "Bio must be at least 100 characters";
  if (data.bio.length > 500) return "Bio must not exceed 500 characters";
  if (!data.experience || Number(data.experience) < 0) return "Please enter your experience";
  if (!data.college.trim()) return "Please enter your college/institution";
  if (!data.degree.trim()) return "Please enter your degree";
  if (!data.yearOfPassing) return "Please select year of passing";
  if (data.specializations.length === 0) return "Please select at least one specialization";
  if (data.specializations.length > 5) return "You can select up to 5 specializations only";
  if (data.subjectsToTeach.length === 0) return "Please select at least one subject to teach";
  if (data.subjectsToTeach.length > 3) return "You can select up to 3 subjects only";
  if (!data.chargePerSession || Number(data.chargePerSession) <= 0) return "Please enter a valid charge per session";
  return null;
}

function validateTutorStep3(data: TutorFormData): string | null {
  if (!data.teachingMode) return "Please select a teaching mode";
  if (!data.state) return "Please select your state";
  if (!data.district) return "Please enter your district";
  if (!data.city) return "Please enter your city";
  if (!data.pinCode) return "Please enter your pin code";
  if (!data.fullAddress.trim()) return "Please enter your full address";
  if (data.languages.length === 0) return "Please select at least one language";
  if (data.languages.length > 5) return "You can select up to 5 languages only";
  if (!data.aadharFront) return "Please upload Aadhar card front";
  if (!data.aadharBack) return "Please upload Aadhar card back";
  return null;
}

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step < currentStep
                  ? "bg-primary text-primary-foreground"
                  : step === currentStep
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)] scale-110"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step < currentStep ? <CheckCircle2 className="h-4 w-4" /> : step}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                step <= currentStep ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step === 1 && "Basic"}
              {step === 2 && "Profile"}
              {step === 3 && "Prefs"}
            </span>
          </div>
          {step < totalSteps && (
            <div className="w-8 sm:w-12 h-0.5 bg-muted rounded-full overflow-hidden mx-1">
              <div
                className={`h-full transition-all duration-500 ${
                  step < currentStep ? "bg-primary w-full" : "bg-transparent w-0"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MultiSelectField({
  label,
  options,
  selected,
  onToggle,
  columns = 2,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  columns?: number;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className={`grid grid-cols-1 ${columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-2`}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer transition-all duration-200 text-sm ${
              selected.includes(opt.value)
                ? "border-primary bg-primary-soft/50"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={selected.includes(opt.value)}
              onCheckedChange={() => onToggle(opt.value)}
            />
            <span className={selected.includes(opt.value) ? "font-medium" : ""}>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function SubjectSelect({
  label,
  options,
  selected,
  onChange,
  max = 3,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  max?: number;
}) {
  const [open, setOpen] = useState(false);

  const available = options.filter((opt) => !selected.includes(opt.value));

  const handleSelect = (value: string) => {
    if (selected.includes(value)) return;
    if (selected.length >= max) return;
    onChange([...selected, value]);
    setOpen(false);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} <span className="text-destructive">*</span>
      </Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-left h-11 hover:border-primary/50 transition-colors"
        >
          <span className="text-muted-foreground">
            {selected.length === 0
              ? `Select up to ${max} subjects`
              : `${selected.length}/${max} selected`}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-border bg-popover shadow-lg">
              {available.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">No more subjects available</div>
              ) : (
                available.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    {opt.label}
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selected.map((val) => {
            const option = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary-soft/40 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {option?.label || val}
                <button
                  type="button"
                  onClick={() => handleRemove(val)}
                  className="rounded-full hover:bg-primary/10 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FileUpload({
  label,
  preview,
  onChange,
  onRemove,
  accept = "image/*",
  required = false,
  note,
}: {
  label: string;
  preview: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  accept?: string;
  required?: boolean;
  note?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label} {required && <span className="text-destructive">*</span>}</Label>
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt={label}
            className="h-32 w-32 object-cover rounded-xl border-2 border-border"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 h-32 w-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 cursor-pointer"
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Upload</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

function TeachingModeCards({
  value,
  onChange,
}: {
  value: "online" | "offline" | "hybrid";
  onChange: (v: "online" | "offline" | "hybrid") => void;
}) {
  const modes = [
    { value: "online" as const, icon: Monitor, label: "Online", desc: "Teach remotely" },
    { value: "offline" as const, icon: MapPin, label: "Offline", desc: "In-person classes" },
    { value: "hybrid" as const, icon: Globe, label: "Hybrid", desc: "Both modes" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={() => onChange(mode.value)}
          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer ${
            value === mode.value
              ? "border-primary bg-primary-soft/50 shadow-[var(--shadow-glow)]"
              : "border-border hover:border-primary/30 hover:bg-muted/30"
          }`}
        >
          <mode.icon className={`h-6 w-6 ${value === mode.value ? "text-primary" : "text-muted-foreground"}`} />
          <span className={`text-sm font-semibold ${value === mode.value ? "text-foreground" : "text-muted-foreground"}`}>
            {mode.label}
          </span>
          <span className="text-xs text-muted-foreground">{mode.desc}</span>
        </button>
      ))}
    </div>
  );
}

function SearchableCitySelect({
  value,
  onChange,
  cities,
}: {
  value: string;
  onChange: (v: string) => void;
  cities: string[];
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = cities.filter((c) => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative">
      <Label className="text-sm font-medium">Location</Label>
      <div className="relative mt-1.5">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          placeholder="Search city..."
          value={value || search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="pl-10 h-11"
        />
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-lg">
            {filtered.length > 0 ? (
              filtered.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    onChange(city);
                    setSearch("");
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${
                    value === city ? "bg-primary-soft/50 font-medium" : ""
                  }`}
                >
                  {city}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">No cities found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — SeekhoSaath" },
      { name: "description", content: "Create your SeekhoSaath account as a student or tutor." },
    ],
    links: [{ rel: "canonical", href: "/signup" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, user } = useAuth();
  const [step, setStep] = useState<"role" | "form">("role");
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [tutorStep, setTutorStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [tutorData, setTutorData] = useState<TutorFormData>(initialTutorData);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", mobile: "", email: "", password: "", confirmPassword: "" },
  });

  if (user) {
    navigate({ to: "/" });
    return null;
  }

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep("form");
    setTutorStep(1);
    setTutorData(initialTutorData);
    setStepError(null);
    form.reset();
  };

  const handleStudentSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, data.fullName);
      toast.success("Account created successfully!");
      navigate({ to: "/" });
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err ? (err as { code: string }).code : "";
      if (code === "auth/email-already-in-use") {
        form.setError("email", { message: "An account with this email already exists" });
      } else if (code === "auth/weak-password") {
        form.setError("password", { message: "Password is too weak. Use at least 6 characters." });
      } else {
        toast.error("Sign up failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTutorSubmit = async (step1Data: SignupForm) => {
    setIsLoading(true);
    setStepError(null);
    try {
      const step2Error = validateTutorStep2(tutorData);
      if (step2Error) {
        setStepError(step2Error);
        setTutorStep(2);
        setIsLoading(false);
        return;
      }
      const step3Error = validateTutorStep3(tutorData);
      if (step3Error) {
        setStepError(step3Error);
        setTutorStep(3);
        setIsLoading(false);
        return;
      }

      await Promise.race([
        signUp(step1Data.email, step1Data.password, step1Data.fullName),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Sign up timed out. Please check your connection and try again.")), 15000)
        ),
      ]);

      const applicationId = `tutor-app-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      
      const application: TutorFormData & { id: string; applicationDate: string; verified: boolean } = {
        ...tutorData,
        id: applicationId,
        applicationDate: new Date().toISOString(),
        verified: false,
      };

      await saveTutorApplication(application);

      toast.success("Your tutor application has been submitted for review!");
      navigate({ to: "/" });
    } catch (err: unknown) {
      console.error("Tutor submit error:", err);
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Submission failed. Please try again.";
      const code =
        err && typeof err === "object" && "code" in err ? (err as { code: string }).code : "";
      if (code === "auth/email-already-in-use") {
        form.setError("email", { message: "An account with this email already exists" });
      } else {
        toast.error(message);
      }
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!selectedRole) return;
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Account created with Google!");
      navigate({ to: "/" });
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err ? (err as { code: string }).code : "";
      if (code !== "auth/popup-closed-by-user") {
        toast.error("Google sign-up failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const tutorStepFields = useMemo(() => {
    const specOptions = SPECIALIZATIONS.map((s) => ({ value: s, label: s }));
    const teachOptions = ALL_SUBJECTS.map((s) => ({ value: s.id, label: `${s.emoji} ${s.name}` }));
    const langOptions = LANGUAGES.map((l) => ({ value: l, label: l }));
    return { specOptions, teachOptions, langOptions };
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof TutorFormData
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    try {
      const maxSize =
        field === "profilePic" ? 14000 : 21000;
      const base64 = await compressImage(file, maxSize);
      setTutorData((prev) => ({ ...prev, [field]: base64 }));
    } catch {
      toast.error("Failed to process image");
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />

      <header className="absolute inset-x-0 top-0 z-50 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex flex-col items-start gap-3">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/hero-tutor-rounded.jpg" alt="SeekhoSaath" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-display text-lg font-bold tracking-tight">
              Seekho<span className="text-primary">Saath</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex items-start justify-center px-4 pt-32 sm:pt-32 pb-8 min-h-screen">
        {step === "role" ? (
          <Card className="w-full max-w-lg border-border shadow-[var(--shadow-card)]">
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-display text-2xl font-bold tracking-tight">
                Create your account
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Choose how you want to get started with SeekhoSaath
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <button
                type="button"
                onClick={() => handleRoleSelect("student")}
                className="w-full group relative flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 text-left transition-all duration-200 hover:border-primary hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5"
              >
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg font-semibold tracking-tight">
                    Register as Student
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Find tutors, book sessions, and learn at your pace
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("tutor")}
                className="w-full group relative flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 text-left transition-all duration-200 hover:border-primary hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5"
              >
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <BookOpenCheck className="h-7 w-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg font-semibold tracking-tight">
                    Register as Tutor
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Share your expertise, teach students, and earn
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary shrink-0" />
              </button>
            </CardContent>

            <CardFooter className="justify-center pb-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        ) : selectedRole === "student" ? (
          <Card className="w-full max-w-2xl border-border shadow-[var(--shadow-card)]">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
                <GraduationCap className="h-6 w-6" />
              </div>
              <CardTitle className="font-display text-2xl font-bold tracking-tight">
                Student Registration
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Fill in your details to create your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleStudentSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your full name"
                              className="pl-10 h-11"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your mobile number"
                              className="pl-10 h-11"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10 h-11"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              className="pl-10 pr-10 h-11"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className="pl-10 pr-10 h-11"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreeTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start gap-3 space-y-0 md:col-span-2 pt-1">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <Label className="text-sm font-normal text-muted-foreground cursor-pointer">
                            I agree to the{" "}
                            <span className="text-primary font-medium hover:underline">
                              Terms & Conditions
                            </span>{" "}
                            and{" "}
                            <span className="text-primary font-medium hover:underline">
                              Privacy Policy
                            </span>
                          </Label>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-semibold shadow-[var(--shadow-glow)]"
                      disabled={isLoading || googleLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Sign Up <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                  
                  <div className="relative md:col-span-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground font-medium">
                        or continue with
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 gap-2 font-medium"
                      onClick={handleGoogleSignUp}
                      disabled={isLoading || googleLoading}
                    >
                      {googleLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Signing up...
                        </span>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" className="h-5 w-5">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                          Sign up with Google
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("role");
                        form.reset();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Change registration type
                    </button>
                  </div>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="justify-center pb-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-3xl border-border shadow-[var(--shadow-card)]">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
                <BookOpenCheck className="h-6 w-6" />
              </div>
              <CardTitle className="font-display text-2xl font-bold tracking-tight">
                Tutor Registration
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Complete all steps to submit your tutor application
              </CardDescription>
              <StepIndicator currentStep={tutorStep} totalSteps={3} />
            </CardHeader>

            <CardContent className="pt-2 pb-4">
              {stepError && (
                <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {stepError}
                </div>
              )}

              {tutorStep === 1 && (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(() => {
                      const err = validateStep1(form.getValues());
                      if (err) {
                        toast.error(err);
                        return;
                      }
                      setStepError(null);
                      setTutorStep(2);
                    })}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter your full name" className="pl-10 h-11" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter your mobile number" className="pl-10 h-11" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="email" placeholder="Enter your email" className="pl-10 h-11" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a password"
                                  className="pl-10 pr-10 h-11"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm your password"
                                  className="pl-10 pr-10 h-11"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="agreeTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start gap-3 space-y-0 md:col-span-2 pt-1">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <Label className="text-sm font-normal text-muted-foreground cursor-pointer">
                                I agree to the{" "}
                                <span className="text-primary font-medium hover:underline">Terms & Conditions</span>{" "}
                                and{" "}
                                <span className="text-primary font-medium hover:underline">Privacy Policy</span>
                              </Label>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-center pt-4">
                      <Button type="submit" className="h-11 px-6 font-semibold shadow-[var(--shadow-glow)]">
                        Continue <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

               {tutorStep === 2 && (
                 <div className="space-y-5">
                   <div className="flex items-center gap-2 mb-2">
                     <Briefcase className="h-5 w-5 text-primary" />
                     <h3 className="font-display text-lg font-semibold">Professional Profile</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label className="text-sm font-medium">Profile Picture <span className="text-destructive">*</span></Label>
                       <FileUpload
                         preview={tutorData.profilePic}
                         onChange={(e) => handleFileUpload(e, "profilePic")}
                         onRemove={() => setTutorData((p) => ({ ...p, profilePic: "" }))}
                         required
                       />
                     </div>

                     <div className="space-y-2">
                       <Label className="text-sm font-medium">Bio / Description <span className="text-destructive">*</span></Label>
                        <Textarea
                          placeholder="Tell students about yourself, your teaching style, and what makes you a great tutor (min 100, max 500 characters)..."
                          value={tutorData.bio}
                          onChange={(e) => setTutorData((p) => ({ ...p, bio: e.target.value }))}
                          className="min-h-[100px] resize-none"
                        />
                        <p className={`text-xs ${tutorData.bio.length >= 100 && tutorData.bio.length <= 500 ? "text-green-600" : "text-muted-foreground"}`}>
                          {tutorData.bio.length}/100-500 characters
                        </p>
                     </div>

                     <div className="space-y-2">
                       <Label className="text-sm font-medium">Years of Experience <span className="text-destructive">*</span></Label>
                       <Select
                         value={tutorData.experience}
                         onValueChange={(v) => setTutorData((p) => ({ ...p, experience: v }))}
                       >
                         <SelectTrigger className="h-11">
                           <SelectValue placeholder="Select experience" />
                         </SelectTrigger>
                         <SelectContent>
                           {["Less than 1 year", "1-2 years", "2-3 years", "3-5 years", "5-8 years", "8-12 years", "12+ years"].map((y) => (
                             <SelectItem key={y} value={y}>{y}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>

                     <div className="space-y-2">
                       <Label className="text-sm font-medium">Charge per Session (₹) <span className="text-destructive">*</span></Label>
                       <div className="relative">
                         <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input
                           type="number"
                           placeholder="e.g. 499"
                           className="pl-10 h-11"
                           value={tutorData.chargePerSession}
                           onChange={(e) => setTutorData((p) => ({ ...p, chargePerSession: e.target.value }))}
                         />
                       </div>
                     </div>

                     <div className="space-y-2">
                       <Label className="text-sm font-medium">College / Institution Name <span className="text-destructive">*</span></Label>
                       <div className="relative">
                         <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input
                           placeholder="e.g. IIT Delhi"
                           className="pl-10 h-11"
                           value={tutorData.college}
                           onChange={(e) => setTutorData((p) => ({ ...p, college: e.target.value }))}
                         />
                       </div>
                     </div>

                     <div className="space-y-2">
                       <Label className="text-sm font-medium">Degree <span className="text-destructive">*</span></Label>
                       <Input
                         placeholder="e.g. B.Tech CSE"
                         className="h-11"
                         value={tutorData.degree}
                         onChange={(e) => setTutorData((p) => ({ ...p, degree: e.target.value }))}
                       />
                     </div>

                     <div className="space-y-2">
                       <Label className="text-sm font-medium">Year of Passing <span className="text-destructive">*</span></Label>
                       <Select
                         value={tutorData.yearOfPassing}
                         onValueChange={(v) => setTutorData((p) => ({ ...p, yearOfPassing: v }))}
                       >
                         <SelectTrigger className="h-11">
                           <SelectValue placeholder="Select status" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="currently-pursuing">Currently Pursuing</SelectItem>
                           {Array.from({ length: 20 }, (_, i) => 2025 - i).map((y) => (
                             <SelectItem key={y} value={String(y)}>Passed Out - {y}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>

                     <div className="space-y-2">
                       <SubjectSelect
                         label="Specializations"
                         options={tutorStepFields.specOptions}
                         selected={tutorData.specializations}
                         onChange={(val) =>
                           setTutorData((p) => ({ ...p, specializations: val }))
                         }
                         max={5}
                       />
                     </div>

                     <div className="space-y-2">
                       <SubjectSelect
                         label="Subjects to Teach"
                         options={tutorStepFields.teachOptions}
                         selected={tutorData.subjectsToTeach}
                         onChange={(val) =>
                           setTutorData((p) => ({ ...p, subjectsToTeach: val }))
                         }
                         max={3}
                       />
                     </div>
                   </div>

                   <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4">
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => { setTutorStep(1); setStepError(null); }}
                       className="h-11 px-6"
                     >
                       <ArrowLeft className="h-4 w-4 mr-1" /> Back
                     </Button>
                     <Button
                       type="button"
                       onClick={() => {
                         const err = validateTutorStep2(tutorData);
                         if (err) {
                           setStepError(err);
                           return;
                         }
                         setStepError(null);
                         setTutorStep(3);
                       }}
                       className="h-11 px-6 font-semibold shadow-[var(--shadow-glow)]"
                     >
                       Continue <ArrowRight className="h-4 w-4 ml-1" />
                     </Button>
                   </div>
                 </div>
               )}

               {tutorStep === 3 && (
                 <div className="space-y-5">
                   <div className="flex items-center gap-2 mb-2">
                     <Globe className="h-5 w-5 text-primary" />
                     <h3 className="font-display text-lg font-semibold">Teaching Preferences & Documents</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="md:col-span-2 space-y-2">
                       <Label className="text-sm font-medium">Teaching Mode <span className="text-destructive">*</span></Label>
                       <TeachingModeCards
                         value={tutorData.teachingMode}
                         onChange={(v) => setTutorData((p) => ({ ...p, teachingMode: v }))}
                       />
                     </div>

                     <div className="space-y-2">
                       <Label className="text-sm font-medium">State <span className="text-destructive">*</span></Label>
                       <Select
                         value={tutorData.state}
                         onValueChange={(v) => setTutorData((p) => ({ ...p, state: v, district: "", city: "", pinCode: "", fullAddress: "" }))}
                       >
                         <SelectTrigger className="h-11 mt-1.5">
                           <SelectValue placeholder="Select state" />
                         </SelectTrigger>
                         <SelectContent>
                           {INDIAN_STATES.map((s) => (
                             <SelectItem key={s} value={s}>{s}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>

                     <div className="space-y-2">
                       <Label className="text-sm font-medium">District <span className="text-destructive">*</span></Label>
                       <Select
                         value={tutorData.district}
                         onValueChange={(v) => setTutorData((p) => ({ ...p, district: v, city: "", pinCode: "", fullAddress: "" }))}
                         disabled={!tutorData.state}
                       >
                         <SelectTrigger className="h-11">
                           <SelectValue placeholder={tutorData.state ? "Select district" : "Select state first"} />
                         </SelectTrigger>
                         <SelectContent>
                           {(STATE_DISTRICTS[tutorData.state] || []).map((d) => (
                             <SelectItem key={d} value={d}>{d}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>

                     <div className="space-y-2">
                       <Label className="text-sm font-medium">City <span className="text-destructive">*</span></Label>
                       <Input
                         placeholder="Enter your city"
                         className="h-11"
                         value={tutorData.city}
                         onChange={(e) => setTutorData((p) => ({ ...p, city: e.target.value }))}
                       />
                     </div>

                     <div className="space-y-2">
                       <Label className="text-sm font-medium">Pin Code <span className="text-destructive">*</span></Label>
                       <Input
                         placeholder="Enter pin code"
                         className="h-11"
                         value={tutorData.pinCode}
                         onChange={(e) => setTutorData((p) => ({ ...p, pinCode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                       />
                     </div>

                     <div className="space-y-2">
                       <Label className="text-sm font-medium">Full Address <span className="text-destructive">*</span></Label>
                       <Textarea
                         placeholder="Enter your complete address"
                         value={tutorData.fullAddress}
                         onChange={(e) => setTutorData((p) => ({ ...p, fullAddress: e.target.value }))}
                         className="min-h-[80px] resize-none"
                       />
                     </div>

                     <div className="space-y-2">
                       <SubjectSelect
                         label="Languages Spoken & Can Teach"
                         options={tutorStepFields.langOptions}
                         selected={tutorData.languages}
                         onChange={(val) =>
                           setTutorData((p) => ({ ...p, languages: val }))
                         }
                         max={5}
                       />
                     </div>

                     <div className="md:col-span-2 border-t-2 border-border pt-5 mt-2">
                       <div className="flex items-center gap-2 mb-4">
                         <FileText className="h-5 w-5 text-primary" />
                         <h3 className="font-display text-lg font-semibold">Verification Documents</h3>
                       </div>
                       <p className="text-xs text-muted-foreground mb-4">Your documents are securely stored and only used for verification purposes.</p>
                     </div>

                     <FileUpload
                       label="Aadhar Card - Front"
                       preview={tutorData.aadharFront}
                       onChange={(e) => handleFileUpload(e, "aadharFront")}
                       onRemove={() => setTutorData((p) => ({ ...p, aadharFront: "" }))}
                       required
                     />
                     <FileUpload
                       label="Aadhar Card - Back"
                       preview={tutorData.aadharBack}
                       onChange={(e) => handleFileUpload(e, "aadharBack")}
                       onRemove={() => setTutorData((p) => ({ ...p, aadharBack: "" }))}
                       required
                     />
                   </div>

                   <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4">
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => { setTutorStep(2); setStepError(null); }}
                       className="h-11 px-6"
                     >
                       <ArrowLeft className="h-4 w-4 mr-1" /> Back
                     </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          try {
                            const step1Data = form.getValues();
                            const err = validateStep1(step1Data);
                            if (err) {
                              setStepError(err);
                              setTutorStep(1);
                              return;
                            }
                            const step3Err = validateTutorStep3(tutorData);
                            if (step3Err) {
                              setStepError(step3Err);
                              return;
                            }
                            setStepError(null);
                            handleTutorSubmit(step1Data);
                          } catch (e) {
                            console.error("Submit handler error:", e);
                            toast.error("Something went wrong. Please try again.");
                            setIsLoading(false);
                          }
                        }}
                        disabled={isLoading}
                        className="h-11 px-6 font-semibold shadow-[var(--shadow-glow)]"
                      >
                       {isLoading ? (
                         <span className="flex items-center gap-2">
                           <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                           </svg>
                           Submitting...
                         </span>
                       ) : (
                         <span className="flex items-center gap-2">
                           Submit Application <ArrowRight className="h-4 w-4 ml-1" />
                         </span>
                       )}
                     </Button>
                   </div>
                 </div>
               )}
            </CardContent>

            <CardFooter className="justify-center pb-6 flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep("role");
                  setSelectedRole(null);
                  setTutorStep(1);
                  setTutorData(initialTutorData);
                  setStepError(null);
                  form.reset();
                }}
                className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change registration type
              </button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
}
