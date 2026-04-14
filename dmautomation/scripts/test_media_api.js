const token = "EAAXh37lDB70BRLE4RE0sQr8b0madkyOZBd9St0D1DJ4efpBeaV9KMgiipUxYRBxkIfyt3587xyMhOI3SJdJihfcKVmvQkJJ7IKKZAnSyBvKeZCVv3fBxCDBf24YkOvIdo2dmO6hIXZCrUeDAsRwJNU5YTiOB9P2bkyCPL5cMrLk5pD8zW8VEBXlBwzQHGVZBbBk7sUTj3mj5NE03HfCCujZAcep8eAZC1Kx";
const accountId = "26318286464529761";
const MEDIA_FIELDS = "id,caption,media_type,media_url,thumbnail_url,timestamp,permalink,like_count,comments_count";

async function test() {
  const igUrl = `https://graph.instagram.com/${accountId}/media?fields=${MEDIA_FIELDS}&access_token=${token}&limit=24`;
  console.log("Testing Strategy 1 (IG API)...");
  const igRes = await fetch(igUrl);
  console.log(await igRes.json());
  
  const fbUrl = `https://graph.facebook.com/${accountId}/media?fields=${MEDIA_FIELDS}&access_token=${token}&limit=24`;
  console.log("Testing Strategy 2 (FB API)...");
  const fbRes = await fetch(fbUrl);
  console.log(await fbRes.json());
}
test();
