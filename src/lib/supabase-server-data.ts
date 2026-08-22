import { createServerClient } from "./supabase-server";

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

const supabase = createServerClient();

export async function saveTutorApplication(data: TutorApplication) {
  const { data: result, error } = await supabase
    .from("tutor_applications")
    .insert({
      user_id: data.userId,
      full_name: data.fullName,
      email: data.email,
      mobile: data.mobile,
      profile_pic: data.profilePic,
      bio: data.bio,
      experience: data.experience,
      degree: data.degree,
      college: data.college,
      year_of_passing: data.yearOfPassing,
      specializations: data.specializations,
      subjects_to_teach: data.subjectsToTeach,
      charge_per_session: data.chargePerSession,
      teaching_mode: data.teachingMode,
      state: data.state,
      district: data.district,
      city: data.city,
      pin_code: data.pinCode,
      full_address: data.fullAddress,
      languages: data.languages,
      aadhar_front: data.aadharFront,
      aadhar_back: data.aadharBack,
      aadhar_number: data.aadharNumber,
      application_date: data.applicationDate,
      verified: data.verified,
      status: data.status,
      rejection_reason: data.rejectionReason,
    })
    .select()
    .single();

  if (error) throw error;
  return result as TutorApplication;
}

export async function getAllTutorApplications(): Promise<TutorApplication[]> {
  const { data, error } = await supabase
    .from("tutor_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as TutorApplication[];
}

export async function approveTutorApplication(applicationId: string) {
  const { data: appData, error: fetchError } = await supabase
    .from("tutor_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (fetchError || !appData) throw new Error("Application not found");

  const tutorId = `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const { error: insertError } = await supabase.from("tutors").insert({
    id: tutorId,
    user_id: appData.user_id,
    name: appData.full_name,
    email: appData.email,
    mobile: appData.mobile,
    profile_pic: appData.profile_pic,
    bio: appData.bio,
    experience: appData.experience,
    degree: appData.degree,
    college: appData.college,
    year_of_passing: appData.year_of_passing,
    specializations: appData.specializations,
    subjects_to_teach: appData.subjects_to_teach,
    charge_per_session: appData.charge_per_session,
    teaching_mode: appData.teaching_mode,
    location: `${appData.city}, ${appData.district}, ${appData.state}`,
    languages: appData.languages,
    state: appData.state,
    district: appData.district,
    city: appData.city,
    pin_code: appData.pin_code,
    full_address: appData.full_address,
    aadhar_front: appData.aadhar_front,
    aadhar_back: appData.aadhar_back,
    application_date: appData.application_date,
    verified: true,
    rating: 0,
    sessions: 0,
    response_time: "< 1 hour",
    status: "approved",
  });

  if (insertError) throw insertError;

  const { error: updateError } = await supabase
    .from("tutor_applications")
    .update({ status: "approved", verified: true })
    .eq("id", applicationId);

  if (updateError) throw updateError;

  return { success: true, tutorId };
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
