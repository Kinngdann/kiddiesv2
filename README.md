## Cloudinary image uploads

Registration stores contestant pictures in Cloudinary in production. Add these
environment variables locally and in Vercel:

```env
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

In the Cloudinary console, open **Dashboard** and copy:

- `Cloud name` into `CLOUDINARY_CLOUD_NAME`
- `API Key` into `CLOUDINARY_API_KEY`
- `API Secret` into `CLOUDINARY_API_SECRET`

After updating Vercel environment variables, redeploy the app. Local development
falls back to `public/uploads`, but production requires Cloudinary.
