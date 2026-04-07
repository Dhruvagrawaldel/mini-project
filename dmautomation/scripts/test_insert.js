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
  const { error } = await supabase.from("automations").insert([{
    user_id: "00000000-0000-0000-0000-000000000000",
    name: "Test",
    keywords: "test",
    response_message: "test",
    post_id: "all",
    is_active: true,
    is_ai_enabled: false,
    brand_tone: "Friendly",
    goal: "Move to DM"
  }]);
  
  if (error) {
    console.error("ERROR:", error.message);
  } else {
    console.log("SUCCESS");
  }
}
run();
