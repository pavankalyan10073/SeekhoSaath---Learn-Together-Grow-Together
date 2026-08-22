import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Supabase credentials missing for /api/profiles");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send(JSON.stringify({ success: false, message: "Method Not Allowed" }));
  }

  try {
    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => { data += chunk; });
      req.on("end", () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
      req.on("error", reject);
    });

    const { userId, email, fullName, mobile, role, profilePic, bio, experience, degree, college, yearOfPassing, specializations, subjectsToTeach, chargePerSession, teachingMode, state, district, city, pinCode, fullAddress, languages, aadharFront, aadharBack } = body;

    if (!userId || !email) {
      return res.status(400).send(JSON.stringify({ success: false, message: "Missing required fields" }));
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email,
        full_name: fullName,
        mobile,
        role: role || "student",
        profile_pic: profilePic,
        bio,
        experience,
        degree,
        college,
        year_of_passing: yearOfPassing,
        specializations: specializations || [],
        subjects_to_teach: subjectsToTeach || [],
        charge_per_session: chargePerSession,
        teaching_mode: teachingMode,
        state,
        district,
        city,
        pin_code: pinCode,
        full_address: fullAddress,
        languages: languages || [],
        aadhar_front: aadharFront,
        aadhar_back: aadharBack,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("/api/profiles upsert error", error);
      return res.status(400).send(JSON.stringify({ success: false, message: error.message || "Failed to upsert profile" }));
    }

    return res.status(200).send(JSON.stringify({ success: true, data }));
  } catch (error) {
    console.error("/api/profiles upsert failed", error);
    return res.status(500).send(JSON.stringify({ success: false, message: error.message || "Failed to upsert profile" }));
  }
}
