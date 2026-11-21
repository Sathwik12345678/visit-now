# VISIT NOW — Premium Healthcare Website

**SKIP THE WAIT.** A Next.js + TypeScript single-page healthcare technology website, built using the original user-supplied VISIT NOW logo and the supplied 1,120-line design brief.

## Included

- One continuous scrolling landing page in the requested order: intro, navigation, hero, brand, how it works, application showcase, six features, hospital partnerships, download, careers, FAQ, final CTA, footer.
- Responsive navigation, active link highlighting, mobile menu, reduced-motion support, accessible FAQ controls, skip-to-content link.
- Original logo assets: transparency-processed PNG, high-resolution PNG, icon, favicon, horizontal light/dark lockups, monochrome PNG. `logo.svg` is an SVG **container embedding the original transparent PNG**, **NOT** a mathematically traced vector. An exact manually traced vector would require additional design verification; it was intentionally not approximated.
- Interactive CSS 3D smartphone with mouse tilt, subtle floating motion, selectable interface previews; actual React Three Fiber / Drei 3D hospital geometry with lighting, shadows, and pointer rotation.
- Framer Motion intro/ambient transitions; GSAP ScrollTrigger section reveals and step-line animation.
- Routes: `/about-app`, `/download`, `/register-hospital`, `/careers`, `/terms-and-conditions`, `/privacy-policy`, `/refund-policy`, `/contact`.
- React Hook Form + Zod validated enquiry forms; private Supabase backend/API routes for hospital, career and contact submissions; optional private PDF upload (max 5 MB), unique reference numbers.
- SEO metadata, Open Graph image, sitemap, robots rules, semantic HTML.

## Requirements

- Node.js **20.9+** (Node 22 LTS recommended).
- npm and internet access for first dependency install.
- Optional Supabase project for working submissions.

## Quick start — Windows (VS Code / PowerShell)

1. Extract the ZIP file to a folder such as `C:\Projects\visit-now-premium`.
2. Open that folder in Visual Studio Code.
3. Open **Terminal > New Terminal**.
4. Run:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

5. Open **http://localhost:3000** in Chrome or another browser.
6. To stop the server, press **Ctrl+C**.

For Git Bash or macOS/Linux, use `cp .env.example .env.local` instead of `Copy-Item`.

## Production build

```bash
npm run lint
npm run build
npm run start
```

Deploy on Vercel as a standard Next.js app. Set environment variables on the hosting platform. Update `NEXT_PUBLIC_SITE_URL` to the real HTTPS domain and redeploy.

> **Verification status:** Source files have been generated and packaged. An `npm install` attempt in the creation environment timed out due to dependency fetching, so the build and browser experience **have not been fully verified** here. Run the commands above in a network-connected environment and resolve any version-related build errors that arise before deployment.

## Enable form submissions (optional, required for real form functionality)

1. Create a Supabase project.
2. Open **SQL Editor**, paste and run `supabase/schema.sql`.
3. Use **Project Settings / API** to obtain the project URL and service role key (in some UI versions the key is called a secret key). **Never expose this key in frontend variables or commits.**
4. Set in `.env.local`:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET_SERVER_KEY
```

5. Restart `npm run dev`.
6. Submit a test enquiry using `/contact`, `/careers`, or `/register-hospital`.
7. Confirm its reference appears in the private `submissions` table. PDF files are saved in the **private** `visit-now-uploads` bucket.

The API validates entries server-side, checks the request origin and file signature/type/size, stores only authorized data, and returns a reference **after** a successful database write. With no keys configured it correctly returns a 503 error instead of a false success. Before a public launch, add distributed rate limiting, spam protection, malware scanning of uploads, role-based administrative review, verified retention/deletion workflows, monitoring, email acknowledgement and appropriate privacy compliance. Neither emails nor staff dashboards are implemented in this starter.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical website URL used by metadata and sitemap |
| `SUPABASE_URL` | Server-only Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only secret key, **never** `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_PLAY_STORE_URL` | Verified official Google Play link only |
| `NEXT_PUBLIC_APP_STORE_URL` | Verified official Apple App Store link only |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Confirmed support email |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Confirmed official Instagram account |
| `NEXT_PUBLIC_LINKEDIN_URL` | Confirmed official LinkedIn account |
| `NEXT_PUBLIC_FACEBOOK_URL` | Confirmed official Facebook account |

The store sections show **Coming soon** until verified links are set. No fake QR code, unverified URLs, partner logos, medical claims, jobs, or user testimonials are inserted. Only configured official social links appear.

## Editing the website

- **Text / main sections:** `components/landing.tsx`
- **Brand colors, spacing and responsive styling:** `app/globals.css`, `tailwind.config.ts`
- **Logo assets:** `public/brand/` (original preserved in shape and colors)
- **Phone mockup / screens:** `components/phone.tsx` (currently **illustrative, not real app screenshots**)
- **Interactive hospital 3D scene:** `components/hospital-3d.tsx`
- **Navbar/footer:** `components/header-footer.tsx`
- **Forms:** `components/forms.tsx`
- **Server submission logic:** `lib/submit.ts` + `app/api/*/route.ts`
- **Supporting pages/legal drafts:** `app/[slug]/page.tsx`

## Important launch checklist

- [ ] Obtain approved screenshots from the actual VISIT NOW app and replace illustrative phone content.
- [ ] Verify all real app features mentioned on the website.
- [ ] Add the real store destinations; optionally generate a QR code **only after a verified download URL is known**.
- [ ] Configure the database and test all forms, permissioning and uploads.
- [ ] Add a proper privacy policy, terms and refund policy reviewed by qualified counsel, consistent with actual data/payment processing. Current legal texts are **clearly marked drafts**.
- [ ] Confirm company legal name, jurisdiction, support email and official social profiles.
- [ ] Add production-grade rate limits, spam controls, monitoring, malware scanning and retention workflow.
- [ ] Verify application flows in Chrome, Safari, Firefox, iOS and Android devices.
- [ ] Run automated accessibility / performance / security reviews and measure actual Lighthouse results rather than assuming a score.
- [ ] Optimize/remove heavy 3D effects on low-power devices as needed.
- [ ] Add analytics only after required privacy disclosures and consent mechanisms are in place.

## Architectural notes

The hero uses an animated **CSS three-dimensional phone mockup**, intentionally not a heavy GLB phone asset. The hospital scene is real geometry rendered using **Three.js via React Three Fiber**. The logo is the original image composited transparently rather than an invented mesh. A truly faithful volumetric logo model should be produced from approved vector paths and compared against the original artwork before production.

## Medical safety / truthful positioning

VISIT NOW is portrayed as a healthcare access platform, **not** a substitute for clinicians. Hospital names displayed in the phone are clearly labelled sample interface entries, not real partners. Hospital registration and career opportunities are expressions of interest, not confirmed partnerships or job vacancies.

---

Built as an editable starting implementation, not a claim of production certification or global #1 ranking.
