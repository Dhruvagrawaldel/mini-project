const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('c:\\Users\\DHRUV AGRAWAL\\mini project\\dmautomation\\.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);
const token = 'EAAXh37lDB70BREbqbgi8m9Ygpi2otUIfRCDb62qmIhlgDUQsnQsGmTrkw8xn0ngjzwTH8e5srR7oZBUSexFjbZBZBPexPSZAppoiIPUPb8zLaMTXYkc8QQzSD0gZAdWIvRZAG6q9ouGXPAHqkiCN42Rlv8If8XpNsKY9CyRaWbtoKQJjHZArShLPZAX3Xt5YKnK39XODR55dBZA6tO2t9nEVrAnFBMZAbX2MiVbIrrp6Hobq7pNejnfZA2pF6fmKFYyQHW5PgZBj4V1ZA3ARrRLJqQ7Ou';

async function run() {
  const res = await fetch(`https://graph.facebook.com/v21.0/me?fields=id,name,instagram_business_account&access_token=${token}`);
  const data = await res.json();
  console.log("Token Graph API Test:", data);

  if (data.id) {
    const igAccountId = data.instagram_business_account ? data.instagram_business_account.id : data.id;
    console.log("Updating account to token:", token.substring(0, 5) + '...', "and account ID:", igAccountId);
    
    // Check old state
    const { data: user } = await supabase.from('users').select('*').eq('id', '8a91f4a5-459c-4f54-a91a-ceeab005ca08').single();
    if (!user) console.error("User not found!");

    const { error } = await supabase
      .from('users')
      .update({ ig_access_token: token, ig_account_id: igAccountId })
      .eq('id', '8a91f4a5-459c-4f54-a91a-ceeab005ca08');
    
    if (error) console.error(error);
    else console.log("Successfully updated Supabase DB!");
  } else {
    console.error("Token might be invalid!");
  }
}
run();
