const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('c:\\Users\\DHRUV AGRAWAL\\mini project\\dmautomation\\.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      ig_access_token: 'EAAXh37lDB70BRLE4RE0sQr8b0madkyOZBd9St0D1DJ4efpBeaV9KMgiipUxYRBxkIfyt3587xyMhOI3SJdJihfcKVmvQkJJ7IKKZAnSyBvKeZCVv3fBxCDBf24YkOvIdo2dmO6hIXZCrUeDAsRwJNU5YTiOB9P2bkyCPL5cMrLk5pD8zW8VEBXlBwzQHGVZBbBk7sUTj3mj5NE03HfCCujZAcep8eAZC1Kx'
    })
    .eq('id', '8a91f4a5-459c-4f54-a91a-ceeab005ca08')
    .select();
  
  if (error) console.error(error);
  else console.log("Successfully updated token!", data[0].ig_access_token.substring(0, 5) + '...');
}

run();
