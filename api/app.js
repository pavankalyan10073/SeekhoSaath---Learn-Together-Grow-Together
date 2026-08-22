const { createClient } = require("@supabase/supabase-js");

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  return { statusCode: 500, body: JSON.stringify({ success: false, message: "Supabase not configured" }) };
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const urlObj = new URL(req.url || `http://localhost${req.url}`);
  const action = urlObj.searchParams.get("action") || "applications";

  if (req.method === "GET") {
    try {
      if (action === "tutors") {
        const { data, error } = await supabase.from("tutors").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        return res.status(200).send(JSON.stringify({ success: true, data: data || [] }));
      }

      if (action === "bookings") {
        const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        return res.status(200).send(JSON.stringify({ success: true, data: data || [] }));
      }

      const { data, error } = await supabase.from("tutor_applications").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.status(200).send(JSON.stringify({ success: true, data: data || [] }));
    } catch (error) {
      return res.status(500).send(JSON.stringify({ success: false, message: error.message || "Failed to fetch" }));
    }
  }

  if (req.method === "PATCH") {
    try {
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => { data += chunk; });
        req.on("end", () => {
          try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
        });
        req.on("error", reject);
      });

      const id = urlObj.searchParams.get("id");
      if (!id) return res.status(400).send(JSON.stringify({ success: false, message: "Missing id" }));

      if (body.action === "approve") {
        const { data: app, error: appError } = await supabase.from("tutor_applications").select("*").eq("id", id).single();
        if (appError || !app) return res.status(404).send(JSON.stringify({ success: false, message: "Application not found" }));

        const tutorId = `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const { error: insertError } = await supabase.from("tutors").insert({
          id: tutorId,
          user_id: app.user_id,
          name: app.full_name,
          email: app.email,
          mobile: app.mobile,
          profile_pic: app.profile_pic,
          bio: app.bio,
          experience: app.experience,
          degree: app.degree,
          college: app.college,
          year_of_passing: app.year_of_passing,
          specializations: app.specializations || [],
          subjects_to_teach: app.subjects_to_teach || [],
          charge_per_session: app.charge_per_session,
          teaching_mode: app.teaching_mode,
          location: `${app.city}, ${app.district}, ${app.state}`,
          languages: app.languages || [],
          state: app.state,
          district: app.district,
          city: app.city,
          pin_code: app.pin_code,
          full_address: app.full_address,
          aadhar_front: app.aadhar_front,
          aadhar_back: app.aadhar_back,
          application_date: app.application_date,
          verified: true,
          rating: 0,
          sessions: 0,
          response_time: "< 1 hour",
          status: "approved",
        });
        if (insertError) throw insertError;

        await supabase.from("tutor_applications").update({ status: "approved", verified: true }).eq("id", id);
        return res.status(200).send(JSON.stringify({ success: true, data: { tutorId } }));
      }

      if (body.action === "reject") {
        const reason = body.reason;
        if (!reason) return res.status(400).send(JSON.stringify({ success: false, message: "Rejection reason is required" }));
        const { error } = await supabase.from("tutor_applications").update({ status: "rejected", rejection_reason: reason }).eq("id", id);
        if (error) throw error;
        return res.status(200).send(JSON.stringify({ success: true }));
      }

      return res.status(400).send(JSON.stringify({ success: false, message: "Invalid action" }));
    } catch (error) {
      return res.status(500).send(JSON.stringify({ success: false, message: error.message || "Operation failed" }));
    }
  }

  res.setHeader("Allow", "GET, PATCH");
  return res.status(405).send(JSON.stringify({ success: false, message: "Method Not Allowed" }));
};
