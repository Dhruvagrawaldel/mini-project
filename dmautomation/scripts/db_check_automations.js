const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('c:\\Users\\DHRUV AGRAWAL\\mini project\\dmautomation\\.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase
    .from('automations')
    .select('*');
  
  if (error) console.error(error);
  else console.log("AUTOMATIONS: \n", JSON.stringify(data, null, 2));

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*');

  if (userError) console.error(userError);
  else console.log("USERS: \n", JSON.stringify(userData, null, 2));
}

run();
