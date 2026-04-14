const url = "http://localhost:3000/api/webhooks/instagram";

const payload = {
  object: "instagram", // ✅ REQUIRED — handler checks body.object === "instagram"
  entry: [
    {
      changes: [
        {
          field: "comments",
          value: {
            id: "fake_comment_id",
            text: "course link",
            from: {
              id: "test_ig_account_id",
              username: "hackinit21"
            },
            media: {
              id: "fake_media_id"
            }
          }
        }
      ]
    }
  ]
};

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
}).then(res => console.log("Webhook triggered. Check Next.js console logs!"));
