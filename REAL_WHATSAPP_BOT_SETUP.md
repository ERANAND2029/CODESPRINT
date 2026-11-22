# 📱 Connect Snap2Solve to a REAL WhatsApp Number (Live Setup)

Snap2Solve backend already has the **live WhatsApp Webhook API** deployed and running at:
👉 **`https://codesprint-13t1.onrender.com/api/whatsapp`**

Below are the exact steps to connect ANY phone to your live Render backend without spending any money:

---

## 🚀 Method 1: Twilio WhatsApp Free Sandbox (Recommended & Fastest — 5 Mins)

This connects an official WhatsApp number so that **ANY phone** can message the bot.

### Step 1: Get Free Twilio Account
1. Go to **[twilio.com/try-twilio](https://www.twilio.com/try-twilio)** and sign up for free (No credit card required).
2. Go to **Messaging** -> **Try it out** -> **Send a WhatsApp message**.
3. You will see a WhatsApp number (e.g. `+1 415 523 8886`) and a join code like `join <two-words>`.

### Step 2: Set the Webhook URL
1. In Twilio Console, go to **Messaging** -> **Settings** -> **WhatsApp sandbox settings**.
2. Find the field: **"WHEN A MESSAGE COMES IN"**.
3. Paste your live Render webhook URL:
   ```text
   https://codesprint-13t1.onrender.com/api/whatsapp
   ```
4. Set method to: **HTTP POST**.
5. Click **Save**.

### Step 3: Test from ANY Phone!
1. Save the Twilio number on your phone.
2. Send the sandbox join code once (e.g. `join simple-word`).
3. Now send **ANY real photo of a pothole or garbage dump** along with your **Live Location pin**!
4. The Snap2Solve bot will:
   - Receive the image & GPS coordinates.
   - Run Google Gemini Vision AI to detect the exact civic violation.
   - Automatically register the complaint with a permanent ID (e.g. `S2S-GZB-004289`).
   - Email the statutory notice to `commissioner@nagarnigamghaziabad.in`.
   - Lock a 7-day statutory clock.
   - Reply directly on your WhatsApp with the formal notice and a link to the public map!

---

## 🧠 Real Vision AI Setup (Google Gemini 1.5 Flash — 100% Free)

To ensure the AI analyzes what is genuinely inside the image instead of using fallbacks:

1. Open **[aistudio.google.com](https://aistudio.google.com/)** and sign in with your Google account.
2. Click **"Get API key"** -> **"Create API key in new project"**.
3. Copy your key.
4. Go to **[dashboard.render.com](https://dashboard.render.com/)** -> Your Service (`codesprint-13t1`).
5. Click **Environment** on the left menu.
6. Click **Add Environment Variable**:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `your_copied_gemini_api_key`
7. Click **Save Changes**.

Render will automatically restart the server. Now, every single photo sent from WhatsApp or the web app will be processed by real Google Gemini Vision!

---

## 💻 In-App WhatsApp Simulator (For Pitch / Live Demos)
You can also open:
👉 **`https://codesprint-13t1.onrender.com/whatsapp`**

- Click the **Camera icon** at the bottom to snap or upload **ANY real photo** from your laptop or phone camera.
- It calls the real Gemini Vision API, generates the formal notice, and plots it onto the live map!
