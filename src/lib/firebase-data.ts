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
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
} from "firebase/firestore";

export interface TutorApplication {
  id: string;
  userId?: string;
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
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export interface Tutor {
  id: string;
  userId: string;
  name: string;
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
  state: string;
  district: string;
  city: string;
  pinCode: string;
  fullAddress: string;
  aadharFront: string;
  aadharBack: string;
  applicationDate: string;
  verified: boolean;
  rating: number;
  sessions: number;
  responseTime: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  tutorId: string;
  tutorName: string;
  tutorSubject: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  mode: "online" | "offline" | "hybrid";
  date?: string;
  time?: string;
  tuitionType?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  amount: number;
  paymentId?: string;
  razorpayOrderId?: string;
  orderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  tutorId: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed" | "refunded";
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  method?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function saveTutorApplication(data: TutorApplication) {
  const ref = doc(db, "tutor_applications", data.id);
  await setDoc(ref, {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getTutorApplicationByEmail(email: string): Promise<TutorApplication | null> {
  const q = query(collection(db, "tutor_applications"), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as TutorApplication;
}

export async function getAllTutorApplications(): Promise<TutorApplication[]> {
  const q = query(collection(db, "tutor_applications"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TutorApplication));
}

export async function approveTutorApplication(applicationId: string, adminId: string): Promise<Tutor> {
  const appRef = doc(db, "tutor_applications", applicationId);
  const appDoc = await getDoc(appRef);
  if (!appDoc.exists()) throw new Error("Application not found");
  
  const appData = appDoc.data() as TutorApplication;
  if (appData.status !== "pending") throw new Error("Application already processed");
  
  const tutorId = `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const tutorRef = doc(db, "tutors", tutorId);
  
  const tutor: Tutor = {
    id: tutorId,
    userId: appData.userId || "",
    name: appData.fullName,
    email: appData.email,
    mobile: appData.mobile,
    profilePic: appData.profilePic,
    bio: appData.bio,
    experience: appData.experience,
    degree: appData.degree,
    college: appData.college,
    yearOfPassing: appData.yearOfPassing,
    specializations: appData.specializations,
    subjectsToTeach: appData.subjectsToTeach,
    chargePerSession: appData.chargePerSession,
    teachingMode: appData.teachingMode,
    location: `${appData.city}, ${appData.district}, ${appData.state}`,
    languages: appData.languages,
    state: appData.state,
    district: appData.district,
    city: appData.city,
    pinCode: appData.pinCode,
    fullAddress: appData.fullAddress,
    aadharFront: appData.aadharFront,
    aadharBack: appData.aadharBack,
    applicationDate: appData.applicationDate,
    verified: true,
    rating: 0,
    sessions: 0,
    responseTime: "< 1 hour",
    status: "approved",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await setDoc(tutorRef, {
    ...tutor,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  await updateDoc(appRef, {
    status: "approved",
    verified: true,
    updatedAt: serverTimestamp(),
  });
  
  return tutor;
}

export async function rejectTutorApplication(applicationId: string, reason: string): Promise<void> {
  const appRef = doc(db, "tutor_applications", applicationId);
  await updateDoc(appRef, {
    status: "rejected",
    rejectionReason: reason,
    updatedAt: serverTimestamp(),
  });
}

export async function getApprovedTutors(): Promise<Tutor[]> {
  const q = query(collection(db, "tutors"), where("status", "==", "approved"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Tutor));
}

export async function getTutorById(tutorId: string): Promise<Tutor | null> {
  const ref = doc(db, "tutors", tutorId);
  const docSnap = await getDoc(ref);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Tutor;
}

export async function createBooking(data: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
  const id = `booking-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const ref = doc(db, "bookings", id);
  const booking: Booking = {
    ...data,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await setDoc(ref, {
    ...booking,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return booking;
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const ref = doc(db, "bookings", bookingId);
  const docSnap = await getDoc(ref);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Booking;
}

export async function getBookingByOrderId(orderId: string): Promise<Booking | null> {
  const q = query(collection(db, "bookings"), where("orderId", "==", orderId));
  const querySnap = await getDocs(q);
  if (querySnap.empty) return null;
  const doc = querySnap.docs[0];
  return { id: doc.id, ...doc.data() } as Booking;
}

export async function updateBookingStatus(bookingId: string, status: Booking["status"], paymentStatus: Booking["paymentStatus"]): Promise<void> {
  const ref = doc(db, "bookings", bookingId);
  await updateDoc(ref, {
    status,
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function createPayment(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
  const id = `payment-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const ref = doc(db, "payments", id);
  const payment: Payment = {
    ...data,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await setDoc(ref, {
    ...payment,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return payment;
}

export async function updatePaymentStatus(paymentId: string, status: Payment["status"], razorpayPaymentId?: string, razorpaySignature?: string, method?: string): Promise<void> {
  const ref = doc(db, "payments", paymentId);
  const update: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
  };
  if (razorpayPaymentId) update.razorpayPaymentId = razorpayPaymentId;
  if (razorpaySignature) update.razorpaySignature = razorpaySignature;
  if (method) update.method = method;
  await updateDoc(ref, update);
}

export async function updateUserRole(uid: string, role: "student" | "tutor" | "admin"): Promise<void> {
  const ref = doc(db, "users", uid);
  await setDoc(ref, {
    uid,
    role,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getUserRole(uid: string): Promise<string | null> {
  const ref = doc(db, "users", uid);
  const docSnap = await getDoc(ref);
  if (!docSnap.exists()) return null;
  return docSnap.data()?.role || null;
}

export async function saveUserProfile(uid: string, data: Record<string, unknown>): Promise<void> {
  const ref = doc(db, "users", uid);
  await setDoc(ref, {
    ...data,
    uid,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
