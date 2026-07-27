# MedTech Training & Certificate System — Prototype (Full Version)

A web-based training and certification platform that helps healthcare workers in Rwanda and Africa learn to correctly operate medical diagnostic equipment (ultrasound, X-ray, laboratory analyzers), complete quizzes, and earn certificates.

This is the **sophisticated / detailed prototype**: a full multi-page site (separate pages for the dashboard, course catalog, course detail, quiz, and certificates) with a designed sidebar app shell, progress tracking, and an admin course-management screen. It's still just HTML, CSS, and JavaScript — no build step, no backend, no npm install. `localStorage` acts as the database.

It implements the functional requirements from the SRS:

- **FR1 / FR2** — User registration and login (learner or administrator role)
- **FR3** — Course catalog and enrollment
- **FR4** — Training videos and module materials (with an optional-video placeholder, see below)
- **FR5** — Quizzes with automatic scoring
- **FR6** — Auto-generated, downloadable certificates on passing (≥70%)
- **FR7** — Progress-tracking dashboard
- **FR8** — Admin course management (create, edit, delete courses)

## Files

All files sit **flat in one folder** — no subfolders — on purpose, so there are no broken relative paths when you open it with Live Server or on GitHub Pages:

```
medtech-full/
├── index.html          # Landing page + login/signup
├── dashboard.html       # Learner dashboard, progress tracking, vitals stats
├── courses.html          # Course catalog with filtering
├── course.html            # Course detail: video (or placeholder), modules, enroll
├── quiz.html               # Quiz + automatic scoring
├── certificate.html      # Certificate view/download (canvas-generated)
├── certificates.html    # Gallery of all certificates you've earned
├── admin.html              # Admin: create/edit/delete courses
├── style.css                # Full design system (colors, type, layout, components)
├── store.js                  # Data layer — all reads/writes to localStorage
└── shell.js                   # Shared sidebar/app-shell used on every logged-in page
```

Keep every file in this same folder when you download, copy, or push it — the pages link to each other and to `style.css`/`store.js`/`shell.js` using plain filenames (e.g. `href="style.css"`), not folder paths.

## How to run it in VS Code (Live Server)

1. Put all 11 files above into **one folder**.
2. Open that folder in VS Code: `File → Open Folder…`
3. Install the **Live Server** extension (by Ritwick Dey) if you don't have it.
4. Right-click `index.html` → **Open with Live Server**.
5. Confirm the browser address bar shows `http://127.0.0.1:...` — that's how you know it's actually served (not opened directly as a `file://` link, which some browsers restrict).

## How to run it without VS Code

Just double-click `index.html` — the whole site works by opening files directly in a browser too, since nothing here needs a real server.

## Using the app

1. On the landing page, click **Create account**, choose **Doctor / Healthcare worker** or **Administrator**, and sign up.
2. Log in. You'll land on the **Dashboard**, showing your stats (courses enrolled, in progress, certificates earned).
3. Go to **Courses**, pick one, and **Enroll**.
4. On the course page, mark each module as done. If the course has no video link yet, you'll see a clearly labeled placeholder instead of a broken player.
5. Once ready, click **Take quiz**. Score 70% or higher to pass.
6. Passing automatically issues a certificate — view it under **My certificates**, and click **Download certificate** to save it as a PNG image.
7. Log in as an **Administrator** account to see **Manage courses** in the sidebar. From there you can add a new course, edit an existing one (title, category, description, modules, quiz questions), and — when you have a real training video — paste its link into the **Video link** field. Leave it blank and learners will just see the "video coming soon" placeholder.

## Deploying it publicly (for your assignment submission)

Since this is a static site, host it for free with **GitHub Pages**:

1. Push all files to a public GitHub repository (keep them flat, same as above).
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment," set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save. GitHub publishes the site at `https://<your-username>.github.io/<repo-name>/`.
5. Use that URL as your public product link.

## Notes on this prototype

- Data (users, enrollments, courses, certificates) lives in the browser's `localStorage`, so it's per-browser/device and resets if browser storage is cleared. A production version would replace `store.js`'s read/write functions with real API calls to a backend and database.
- Passwords are stored in plain text in `localStorage` for prototype simplicity only — never do this in a production system.
- The certificate is generated on a `<canvas>` element and downloaded as a PNG — no external libraries required.