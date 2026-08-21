import { supabase } from "@/lib/supabase";

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
  state: string;
  district: string;
  city: string;
  pinCode: string;
  fullAddress: string;
  languages: string[];
  aadharFront: string;
  aadharBack: string;
  aadharNumber?: string;
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
  const { data: result, error } = await supabase
    .from("tutor_applications")
    .insert({
      ...data,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return result as TutorApplication;
}

export async function getTutorApplicationByEmail(email: string): Promise<TutorApplication | null> {
  const { data, error } = await supabase
    .from("tutor_applications")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;
  return data as TutorApplication;
}

export async function getAllTutorApplications(): Promise<TutorApplication[]> {
  const { data, error } = await supabase
    .from("tutor_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as TutorApplication[];
}

export async function approveTutorApplication(applicationId: string, adminId: string): Promise<Tutor> {
  const { data: appData, error: fetchError } = await supabase
    .from("tutor_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (fetchError || !appData) throw new Error("Application not found");

  const tutorId = `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const tutor: Tutor = {
    id: tutorId,
    userId: appData.user_id || "",
    name: appData.full_name,
    email: appData.email,
    mobile: appData.mobile,
    profilePic: appData.profile_pic,
    bio: appData.bio,
    experience: appData.experience,
    degree: appData.degree,
    college: appData.college,
    yearOfPassing: appData.year_of_passing,
    specializations: appData.specializations,
    subjectsToTeach: appData.subjects_to_teach,
    chargePerSession: appData.charge_per_session,
    teachingMode: appData.teaching_mode,
    location: `${appData.city}, ${appData.district}, ${appData.state}`,
    languages: appData.languages,
    state: appData.state,
    district: appData.district,
    city: appData.city,
    pinCode: appData.pin_code,
    fullAddress: appData.full_address,
    aadharFront: appData.aadhar_front,
    aadharBack: appData.aadhar_back,
    applicationDate: appData.application_date,
    verified: true,
    rating: 0,
    sessions: 0,
    responseTime: "< 1 hour",
    status: "approved",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const { error: insertError } = await supabase.from("tutors").insert({
    id: tutorId,
    user_id: tutor.userId,
    name: tutor.name,
    email: tutor.email,
    mobile: tutor.mobile,
    profile_pic: tutor.profilePic,
    bio: tutor.bio,
    experience: tutor.experience,
    degree: tutor.degree,
    college: tutor.college,
    year_of_passing: tutor.yearOfPassing,
    specializations: tutor.specializations,
    subjects_to_teach: tutor.subjectsToTeach,
    charge_per_session: tutor.chargePerSession,
    teaching_mode: tutor.teachingMode,
    location: tutor.location,
    languages: tutor.languages,
    state: tutor.state,
    district: tutor.district,
    city: tutor.city,
    pin_code: tutor.pinCode,
    full_address: tutor.fullAddress,
    aadhar_front: tutor.aadharFront,
    aadhar_back: tutor.aadharBack,
    application_date: tutor.applicationDate,
    verified: true,
    rating: 0,
    sessions: 0,
    response_time: tutor.responseTime,
    status: "approved",
  });

  if (insertError) throw insertError;

  const { error: updateError } = await supabase
    .from("tutor_applications")
    .update({ status: "approved", verified: true })
    .eq("id", applicationId);

  if (updateError) throw updateError;

  return tutor;
}

export async function rejectTutorApplication(applicationId: string, reason: string): Promise<void> {
  const { error } = await supabase
    .from("tutor_applications")
    .update({
      status: "rejected",
      rejection_reason: reason,
    })
    .eq("id", applicationId);

  if (error) throw error;
}

export async function getApprovedTutors(): Promise<Tutor[]> {
  const { data, error } = await supabase
    .from("tutors")
    .select("*")
    .eq("status", "approved");

  if (error) throw error;
  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    email: row.email as string,
    mobile: row.mobile as string,
    profilePic: row.profile_pic as string,
    bio: row.bio as string,
    experience: row.experience as string,
    degree: row.degree as string,
    college: row.college as string,
    yearOfPassing: row.year_of_passing as string,
    specializations: (row.specializations as string[]) || [],
    subjectsToTeach: (row.subjects_to_teach as string[]) || [],
    chargePerSession: row.charge_per_session as string,
    teachingMode: row.teaching_mode as "online" | "offline" | "hybrid",
    location: row.location as string,
    languages: (row.languages as string[]) || [],
    state: row.state as string,
    district: row.district as string,
    city: row.city as string,
    pinCode: row.pin_code as string,
    fullAddress: row.full_address as string,
    aadharFront: row.aadhar_front as string,
    aadharBack: row.aadhar_back as string,
    applicationDate: row.application_date as string,
    verified: row.verified as boolean,
    rating: (row.rating as number) || 0,
    sessions: (row.sessions as number) || 0,
    responseTime: row.response_time as string,
    status: row.status as "pending" | "approved" | "rejected",
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  }));
}

export async function getTutorById(tutorId: string): Promise<Tutor | null> {
  const { data, error } = await supabase
    .from("tutors")
    .select("*")
    .eq("id", tutorId)
    .single();

  if (error || !data) return null;
  const row = data as Record<string, unknown>;
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    email: row.email as string,
    mobile: row.mobile as string,
    profilePic: row.profile_pic as string,
    bio: row.bio as string,
    experience: row.experience as string,
    degree: row.degree as string,
    college: row.college as string,
    yearOfPassing: row.year_of_passing as string,
    specializations: (row.specializations as string[]) || [],
    subjectsToTeach: (row.subjects_to_teach as string[]) || [],
    chargePerSession: row.charge_per_session as string,
    teachingMode: row.teaching_mode as "online" | "offline" | "hybrid",
    location: row.location as string,
    languages: (row.languages as string[]) || [],
    state: row.state as string,
    district: row.district as string,
    city: row.city as string,
    pinCode: row.pin_code as string,
    fullAddress: row.full_address as string,
    aadharFront: row.aadhar_front as string,
    aadharBack: row.aadhar_back as string,
    applicationDate: row.application_date as string,
    verified: row.verified as boolean,
    rating: (row.rating as number) || 0,
    sessions: (row.sessions as number) || 0,
    responseTime: row.response_time as string,
    status: row.status as "pending" | "approved" | "rejected",
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function createBooking(data: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
  const { data: result, error } = await supabase
    .from("bookings")
    .insert({
      user_id: data.userId,
      tutor_id: data.tutorId,
      tutor_name: data.tutorName,
      tutor_subject: data.tutorSubject,
      student_name: data.studentName,
      student_phone: data.studentPhone,
      student_email: data.studentEmail,
      mode: data.mode,
      date: data.date,
      time: data.time,
      tuition_type: data.tuitionType,
      status: data.status,
      payment_status: data.paymentStatus,
      amount: data.amount,
      payment_id: data.paymentId,
      razorpay_order_id: data.razorpayOrderId,
      order_id: data.orderId,
    })
    .select()
    .single();

  if (error) throw error;
  const row = result as Record<string, unknown>;
  return {
    id: row.id as string,
    userId: row.user_id as string,
    tutorId: row.tutor_id as string,
    tutorName: row.tutor_name as string,
    tutorSubject: row.tutor_subject as string,
    studentName: row.student_name as string,
    studentPhone: row.student_phone as string,
    studentEmail: row.student_email as string,
    mode: row.mode as "online" | "offline" | "hybrid",
    date: row.date as string | undefined,
    time: row.time as string | undefined,
    tuitionType: row.tuition_type as string | undefined,
    status: row.status as "pending" | "confirmed" | "cancelled" | "completed",
    paymentStatus: row.payment_status as "pending" | "paid" | "failed" | "refunded",
    amount: row.amount as number,
    paymentId: row.payment_id as string | undefined,
    razorpayOrderId: row.razorpay_order_id as string | undefined,
    orderId: row.order_id as string | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (error || !data) return null;
  const row = data as Record<string, unknown>;
  return {
    id: row.id as string,
    userId: row.user_id as string,
    tutorId: row.tutor_id as string,
    tutorName: row.tutor_name as string,
    tutorSubject: row.tutor_subject as string,
    studentName: row.student_name as string,
    studentPhone: row.student_phone as string,
    studentEmail: row.student_email as string,
    mode: row.mode as "online" | "offline" | "hybrid",
    date: row.date as string | undefined,
    time: row.time as string | undefined,
    tuitionType: row.tuition_type as string | undefined,
    status: row.status as "pending" | "confirmed" | "cancelled" | "completed",
    paymentStatus: row.payment_status as "pending" | "paid" | "failed" | "refunded",
    amount: row.amount as number,
    paymentId: row.payment_id as string | undefined,
    razorpayOrderId: row.razorpay_order_id as string | undefined,
    orderId: row.order_id as string | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function getBookingByOrderId(orderId: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (error || !data) return null;
  const row = data as Record<string, unknown>;
  return {
    id: row.id as string,
    userId: row.user_id as string,
    tutorId: row.tutor_id as string,
    tutorName: row.tutor_name as string,
    tutorSubject: row.tutor_subject as string,
    studentName: row.student_name as string,
    studentPhone: row.student_phone as string,
    studentEmail: row.student_email as string,
    mode: row.mode as "online" | "offline" | "hybrid",
    date: row.date as string | undefined,
    time: row.time as string | undefined,
    tuitionType: row.tuition_type as string | undefined,
    status: row.status as "pending" | "confirmed" | "cancelled" | "completed",
    paymentStatus: row.payment_status as "pending" | "paid" | "failed" | "refunded",
    amount: row.amount as number,
    paymentId: row.payment_id as string | undefined,
    razorpayOrderId: row.razorpay_order_id as string | undefined,
    orderId: row.order_id as string | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"],
  paymentStatus: Booking["paymentStatus"]
): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .update({ status, payment_status: paymentStatus })
    .eq("id", bookingId);

  if (error) throw error;
}

export async function createPayment(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
  const { data: result, error } = await supabase
    .from("payments")
    .insert({
      booking_id: data.bookingId,
      user_id: data.userId,
      tutor_id: data.tutorId,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      razorpay_order_id: data.razorpayOrderId,
      razorpay_payment_id: data.razorpayPaymentId,
      razorpay_signature: data.razorpaySignature,
      method: data.method,
    })
    .select()
    .single();

  if (error) throw error;
  const row = result as Record<string, unknown>;
  return {
    id: row.id as string,
    bookingId: row.booking_id as string,
    userId: row.user_id as string,
    tutorId: row.tutor_id as string,
    amount: row.amount as number,
    currency: row.currency as string,
    status: row.status as "created" | "paid" | "failed" | "refunded",
    razorpayOrderId: row.razorpay_order_id as string,
    razorpayPaymentId: row.razorpay_payment_id as string | undefined,
    razorpaySignature: row.razorpay_signature as string | undefined,
    method: row.method as string | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function updatePaymentStatus(
  paymentId: string,
  status: Payment["status"],
  razorpayPaymentId?: string,
  razorpaySignature?: string,
  method?: string
): Promise<void> {
  const update: Record<string, unknown> = { status };
  if (razorpayPaymentId) update.razorpay_payment_id = razorpayPaymentId;
  if (razorpaySignature) update.razorpay_signature = razorpaySignature;
  if (method) update.method = method;

  const { error } = await supabase
    .from("payments")
    .update(update)
    .eq("id", paymentId);

  if (error) throw error;
}

export async function updateUserRole(uid: string, role: "student" | "tutor" | "admin"): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: uid, role, updated_at: new Date().toISOString() });

  if (error) throw error;
}

export async function getUserRole(uid: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", uid)
    .single();

  if (error || !data) return null;
  return (data as { role: string }).role;
}

export async function saveUserProfile(uid: string, data: Record<string, unknown>): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: uid,
      ...data,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
}

export async function uploadImage(file: File, path: string): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).slice(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("tutor-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("tutor-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function createMeeting(data: {
  fullName: string;
  phone: string;
  email: string;
  tuitionType: string;
  date: string;
  time: string;
  tutorName?: string;
  tutorSubject?: string;
}): Promise<void> {
  const { error } = await supabase
    .from("meetings")
    .insert({
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      tuition_type: data.tuitionType,
      date: data.date,
      time: data.time,
      tutor_name: data.tutorName,
      tutor_subject: data.tutorSubject,
      type: "meeting",
    });

  if (error) throw error;
}
