import { createClient } from '@supabase/supabase-js';
import path from 'path';

import fs from 'fs';

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : '';
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log("Testing connection to Supabase...");
  console.log("URL:", supabaseUrl);
  
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error connecting to 'users' table:");
    console.error(JSON.stringify(error, null, 2));
    
    if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      console.log("\n>>> FIX: The 'users' table does not exist in the public schema.");
      console.log("Please run the SQL migration I provided in the previous message.");
    }
  } else {
    console.log("Success! 'users' table is accessible.");
    console.log("Table columns:", Object.keys(data[0] || {}));
    console.log("Sample Data:", data[0]);
  }
}

testConnection();
