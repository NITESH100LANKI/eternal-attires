# 🚀 Deploying Eternal Attires to Production

The application source code, API bindings, CORS security, and database bindings have all been successfully migrated and updated to support scalable cloud instances natively!

Because Vercel and Render require your personal GitHub authorization tokens and private repository access to construct live hooks, I have optimally prepared the codebase so you only need to run the following **3 simple steps** to take your store live.

---

## 1. Deploy the Backend (Render)

Render connects seamlessly to your GitHub. 
1. Create a [Render.com](https://render.com) account and click **New Web Service**.
2. Connect the `server` folder of your GitHub repository.
3. Configure the **Build Command** to `npm install` and **Start Command** to `npm start`.
4. Add the following **Environment Variables** securely into the Render Dashboard:

| Key | Value (Example) |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URL` | `mongodb+srv://<user>:<pwd>@cluster...` |
| `JWT_SECRET` | `your_super_secret_key` |
| `CLOUDINARY_CLOUD_NAME` | *(from Cloudinary Dashboard)* |
| `CLOUDINARY_API_KEY` | *(from Cloudinary Dashboard)* |
| `CLOUDINARY_API_SECRET`| *(from Cloudinary Dashboard)* |
| `RAZORPAY_KEY_ID` | `rzp_live_your_live_key` (Test mode: `rzp_test_...`) |
| `RAZORPAY_KEY_SECRET` | `your_razorpay_secret` |
| `FRONTEND_URL` | `https://eternal-attires.vercel.app` *(add this AFTER deploying Vercel)* |

**Backend Live URL Example:** `https://eternal-attires-api.onrender.com`

---

## 2. Deploy the Frontend (Vercel)

Vercel natively digests React (Webpack) directly.
1. Create a [Vercel.com](https://vercel.com) account.
2. Click **Add New Project** and authorize this GitHub repository, targeting the `client` folder.
3. Overwrite the **Build Command** setting (if needed) with `npm run build`.
4. Open the **Environment Variables** menu on Vercel and add the following connection string matching your successfully deployed Render URL:

| Key | Value (Example) |
| :--- | :--- |
| `REACT_APP_API_URL` | `https://eternal-attires-api.onrender.com` *(Crucial: No trailing slash)* |

Click **Deploy**. 

**Frontend Live URL Example:** `https://eternal-attires.vercel.app`

---

## 3. Post-Deployment (Converting to LIVE)

Once everything boots online successfully and your `FRONTEND_URL` + `REACT_APP_API_URL` have mapped locally, execute a test payment flow locally.

When you're ready to collect *real* money matching Myntra:
1. Open your Razorpay Dashboard Settings.
2. Toggle the switch top-right from **Test Mode** to **Live Mode**.
3. Generate new API Keys natively.
4. Replace the old `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` inside your Render dashboard with the new LIVE keys.
5. Simply **restart** the Render Web Service securely!
