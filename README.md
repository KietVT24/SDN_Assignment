# Clothing Store (Next.js + MongoDB)

CRUD web app for selling clothing. Frontend + REST API in one Next.js app. MongoDB via Mongoose, optional Cloudinary image upload. Deployable to Vercel.

## Tech stack
- Next.js (Pages Router)
- MongoDB Atlas (Mongoose)
- Optional Cloudinary upload
- Deployed on Vercel

## Features
- Products: name, description, price, image URL, createdAt
- REST API `/api/products` with list/search/pagination and CRUD
- Create/Update supports JSON body or multipart file upload
- Frontend pages: Home, Product detail, Create, Edit
- Basic responsive grid, search, confirm delete, loading states

## Getting started
1. Clone and install
```bash
git clone <your-repo-url>
cd clothing-store
npm install
```

2. Configure environment
Create `.env.local` from `.env.example` and fill:
```env
MONGODB_URI=your_mongo_atlas_connection_string
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. Run dev server
```bash
npm run dev
```
Visit `http://localhost:3000`.

4. Seed sample data
```bash
npm run seed
```

## Scripts
- `dev`: Next dev server
- `build`: Next production build
- `start`: Start production server
- `seed`: Seed 10 sample products

## MongoDB Atlas quick setup
1. Create an Atlas account and a free cluster.
2. Add a Database User with username/password.
3. Network Access: allow your IP (or 0.0.0.0/0 for dev).
4. Get the connection string (Driver: Node.js) and set `MONGODB_URI`.

Docs: `https://www.mongodb.com/atlas/database`

## Cloudinary setup (optional for file upload)
1. Create Cloudinary account. Get Cloud name, API Key, API Secret.
2. Add to env variables. Optionally create an unsigned upload preset.
3. If Cloudinary is not configured, provide an image URL in forms instead.

Docs: `https://cloudinary.com/documentation`

## Deploy to Vercel
1. Push this project to a Git repo.
2. Import to Vercel and set Environment Variables:
   - `MONGODB_URI`
   - `CLOUDINARY_CLOUD_NAME` (optional)
   - `CLOUDINARY_API_KEY` (optional)
   - `CLOUDINARY_API_SECRET` (optional)
   - `CLOUDINARY_UPLOAD_PRESET` (optional)
   - `NEXT_PUBLIC_BASE_URL` = your deployed URL (e.g., `https://your-app.vercel.app`)
3. Deploy.

## API
- `GET /api/products?page=&limit=&q=`
- `POST /api/products` JSON: `{ name, description, price, image? }` or multipart with `image` file
- `GET /api/products/:id`
- `PUT /api/products/:id` JSON or multipart
- `DELETE /api/products/:id`

Responses:
```json
{ "success": true, "data": ... }
{ "success": false, "error": "message" }
```

## Notes
- If uploading files without Cloudinary config, API returns an error advising to use URL or set env.
- Basic ESLint and Prettier included.

## Sample commit message
```
feat: scaffold clothing-store CRUD app (Next.js + MongoDB)
```

## Demo
- Deployed URL: <add-link-after-deploy>

