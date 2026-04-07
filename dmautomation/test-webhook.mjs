const payload = {
  "object": "instagram",
  "entry": [
    {
      "id": "178414123456789",
      "time": 1699999999,
      "changes": [
        {
          "field": "comments",
          "value": {
            "id": "180999999999999",
            "text": "Send me the link",
            "from": {
              "id": "178414999999999",
              "username": "test_user"
            },
            "media": {
              "id": "178999999999999",
              "media_product_type": "REELS"
            }
          }
        }
      ]
    }
  ]
};

async function run() {
  console.log("Sending test webhook payload...");
  try {
    const res = await fetch("http://localhost:3000/api/instagram/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      console.error("Error from webhook:", res.status, res.statusText);
      const text = await res.text();
      console.error(text);
    } else {
      const data = await res.json();
      console.log("Response:", data);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

run();
