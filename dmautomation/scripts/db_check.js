const { createClient } = require("@supabase/supabase-js");

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: users } = await supabase.from('users').select('id, email, ig_account_id').not('ig_access_token', 'is', null);
  console.log("Users with tokens:", users);

  const { data: automations } = await supabase.from('automations').select('*');
  console.log("Automations:", automations);
}
check();
