const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('c:\\Users\\DHRUV AGRAWAL\\mini project\\dmautomation\\.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase
    .from('automation_logs')
    .select('*')
    .order('triggered_at', { ascending: false })
    .limit(10);
  
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

run();
