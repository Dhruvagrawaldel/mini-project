import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLogs() {
  const { data, error } = await supabase.from("automation_logs").select("*").order("created_at", { ascending: false }).limit(5);
  console.log("automation_logs:", data);
  console.log("Error:", error);

  const { data: logsData, error: logsErr } = await supabase.from("logs").select("*").limit(5).catch(()=>({data:null, error: 'Table not found'}));
  console.log("logs table check:", logsData, logsErr);
}

checkLogs();
