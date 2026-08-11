import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export interface TutorApplication {
  id: string;
  email: string;
  fullName: string;
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
  state: string;
  district: string;
  city: string;
  pinCode: string;
  fullAddress: string;
  languages: string[];
  aadharFront: string;
  aadharBack: string;
  applicationDate: string;
  verified: boolean;
}

export async function saveTutorApplication(data: TutorApplication) {
  const ref = doc(db, "tutor_applications", data.id);
  await setDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getTutorApplicationByEmail(email: string): Promise<TutorApplication | null> {
  const q = query(collection(db, "tutor_applications"), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as TutorApplication;
}
