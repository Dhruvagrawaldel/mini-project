require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data } = await supabase.from("users").select("ig_account_id").not("ig_account_id", "is", null).limit(1);
  console.log(data[0]?.ig_account_id);
}
run();








