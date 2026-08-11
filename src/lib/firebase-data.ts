import { db, storage } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, uploadString, getDownloadURL, deleteObject } from "firebase/storage";

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

export async function uploadBase64Image(path: string, base64: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadString(storageRef, base64, "data_url");
  return getDownloadURL(storageRef);
}

export async function deleteImage(path: string) {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
