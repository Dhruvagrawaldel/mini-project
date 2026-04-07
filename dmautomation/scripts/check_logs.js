const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const envVars = fs.readFileSync(".env.local", "utf8")
  .split("\n")
  .filter(line => line && !line.startsWith("#"))
  .reduce((acc, line) => {
    const [key, ...val] = line.split("=");
    if (key && val.length) acc[key.trim()] = val.join("=").trim().replace(/['"]/g, '');
    return acc;
  }, {});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from("automation_logs")
    .select("*")
    .order("triggered_at", { ascending: false })
    .limit(5);
  
  if (error) {
    console.error("ERROR Fetching logs:", error.message);
  } else {
    console.log("Recent webhook logs:", data);
  }
}
run();
