/* ============================================================
   store.js
   Acts as the system's "database" for this prototype using
   localStorage. Swap the read/write functions here for real
   API calls when wiring this up to a backend.
   ============================================================ */

const DB_KEYS = {
  users: 'medtech_users',
  session: 'medtech_session',
  courses: 'medtech_courses',
  enrollments: 'medtech_enrollments'
};

/* ---------- Seed data (used only on first load) ---------- */
const SEED_COURSES = [
  {
    id: 'ultrasound-101',
    title: 'Ultrasound Fundamentals',
    category: 'Imaging',
    level: 'Beginner',
    description: 'Core principles of diagnostic ultrasound: probe handling, image optimization, and common artifacts to watch for in abdominal and obstetric scans.',
    videoUrl: '', // leave blank until you have a real video link
    durationMins: 42,
    modules: [
      'Introduction to ultrasound physics',
      'Probe selection and patient positioning',
      'Reading and optimizing the image',
      'Recognizing common artifacts'
    ],
    quiz: [
      { q: 'What does higher frequency ultrasound generally provide?', opts: ['Deeper penetration, lower resolution', 'Shallower penetration, higher resolution', 'No change in resolution', 'Only works on bone'], correct: 1 },
      { q: 'Gel is applied to the skin before scanning mainly to:', opts: ['Sterilize the skin', 'Eliminate air gaps for sound transmission', 'Cool the probe', 'Improve screen brightness'], correct: 1 },
      { q: 'An artifact that mirrors a structure on the opposite side of a strong reflector is called:', opts: ['Shadowing', 'Mirror image artifact', 'Enhancement', 'Reverberation'], correct: 1 },
      { q: 'Which patient position is most common for an abdominal scan?', opts: ['Prone', 'Supine', 'Standing', 'Lateral only'], correct: 1 }
    ]
  },
  {
    id: 'xray-basics',
    title: 'X-Ray Machine Operation Basics',
    category: 'Imaging',
    level: 'Beginner',
    description: 'Safe, correct operation of fixed and portable X-ray units, including exposure settings, patient shielding, and radiation safety practice.',
    videoUrl: '', // leave blank until you have a real video link
    durationMins: 38,
    modules: [
      'Radiation safety and shielding',
      'Setting exposure factors (kVp, mAs)',
      'Positioning for common views',
      'Equipment maintenance checks'
    ],
    quiz: [
      { q: 'kVp on an X-ray machine primarily controls:', opts: ['Beam penetration/contrast', 'Exposure time only', 'Table height', 'Film speed'], correct: 0 },
      { q: 'A lead apron is used mainly to:', opts: ['Improve image sharpness', 'Shield from scatter radiation', 'Reduce machine noise', 'Speed up the exposure'], correct: 1 },
      { q: 'Which principle guides minimizing radiation dose to staff and patients?', opts: ['ALARA (As Low As Reasonably Achievable)', 'Maximum exposure rule', 'Fixed dose rule', 'No standard exists'], correct: 0 },
      { q: 'Before each use, the X-ray unit should be checked for:', opts: ['Only battery level', 'Collimator accuracy and cable condition', 'Wi-Fi signal', 'Screen brightness only'], correct: 1 }
    ]
  },
  {
    id: 'lab-diagnostics',
    title: 'Laboratory Diagnostic Equipment Handling',
    category: 'Laboratory',
    level: 'Intermediate',
    description: 'Proper calibration, sample handling, and troubleshooting for common laboratory diagnostic analyzers used in district hospitals.',
    videoUrl: '', // leave blank until you have a real video link
    durationMins: 35,
    modules: [
      'Analyzer calibration routine',
      'Sample collection and handling',
      'Reading and validating results',
      'Troubleshooting common errors'
    ],
    quiz: [
      { q: 'Calibration of a diagnostic analyzer should be done:', opts: ['Only once, at purchase', 'Regularly, per manufacturer schedule', 'Never, it self-calibrates', 'Only after it breaks'], correct: 1 },
      { q: 'A hemolyzed blood sample can cause:', opts: ['More accurate results', 'Inaccurate lab results', 'Faster processing', 'No effect on results'], correct: 1 },
      { q: 'If an analyzer flags an "error code" on a result, the correct first step is:', opts: ['Ignore and report the result', 'Consult the troubleshooting guide before reporting', 'Restart the hospital network', 'Discard the machine'], correct: 1 },
      { q: 'Quality control samples are run to:', opts: ['Waste reagents', 'Verify the analyzer is producing reliable results', 'Test staff patience', 'Replace patient samples'], correct: 1 }
    ]
  }
];

/* ---------- Low-level helpers ---------- */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- Init ---------- */
function initStore() {
  if (!localStorage.getItem(DB_KEYS.courses)) {
    writeJSON(DB_KEYS.courses, SEED_COURSES);
  }
  if (!localStorage.getItem(DB_KEYS.users)) {
    writeJSON(DB_KEYS.users, []);
  }
  if (!localStorage.getItem(DB_KEYS.enrollments)) {
    writeJSON(DB_KEYS.enrollments, []);
  }
}
initStore();

/* ---------- Users / Auth (FR1, FR2) ---------- */
const Store = {
  getUsers() { return readJSON(DB_KEYS.users, []); },
  saveUsers(u) { writeJSON(DB_KEYS.users, u); },

  registerUser({ name, email, password, role }) {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with that email already exists.' };
    }
    const user = { id: 'u_' + Date.now(), name, email, password, role };
    users.push(user);
    this.saveUsers(users);
    return { ok: true, user };
  },

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { ok: false, error: 'Incorrect email or password.' };
    writeJSON(DB_KEYS.session, { userId: user.id });
    return { ok: true, user };
  },

  logout() { localStorage.removeItem(DB_KEYS.session); },

  currentUser() {
    const session = readJSON(DB_KEYS.session, null);
    if (!session) return null;
    return this.getUsers().find(u => u.id === session.userId) || null;
  },

  requireAuth(redirectTo = 'index.html') {
    const u = this.currentUser();
    if (!u) window.location.href = redirectTo;
    return u;
  },

  requireAdmin(redirectTo = 'dashboard.html') {
    const u = this.requireAuth();
    if (u && u.role !== 'admin') window.location.href = redirectTo;
    return u;
  },

  /* ---------- Courses (FR3, FR4, FR8) ---------- */
  getCourses() { return readJSON(DB_KEYS.courses, []); },
  saveCourses(c) { writeJSON(DB_KEYS.courses, c); },
  getCourse(id) { return this.getCourses().find(c => c.id === id) || null; },

  upsertCourse(course) {
    const courses = this.getCourses();
    const idx = courses.findIndex(c => c.id === course.id);
    if (idx >= 0) courses[idx] = course; else courses.push(course);
    this.saveCourses(courses);
  },

  deleteCourse(id) {
    this.saveCourses(this.getCourses().filter(c => c.id !== id));
  },

  /* ---------- Enrollments / progress / certificates (FR3, FR5, FR6, FR7) ---------- */
  getEnrollments() { return readJSON(DB_KEYS.enrollments, []); },
  saveEnrollments(e) { writeJSON(DB_KEYS.enrollments, e); },

  getEnrollment(userId, courseId) {
    return this.getEnrollments().find(e => e.userId === userId && e.courseId === courseId) || null;
  },

  getUserEnrollments(userId) {
    return this.getEnrollments().filter(e => e.userId === userId);
  },

  enroll(userId, courseId) {
    const existing = this.getEnrollment(userId, courseId);
    if (existing) return existing;
    const enrollments = this.getEnrollments();
    const rec = {
      userId, courseId,
      enrolledAt: new Date().toISOString(),
      completedModules: [],
      quizScore: null,
      quizPassed: false,
      certificateIssued: false,
      certificateDate: null
    };
    enrollments.push(rec);
    this.saveEnrollments(enrollments);
    return rec;
  },

  markModuleDone(userId, courseId, moduleIndex) {
    const enrollments = this.getEnrollments();
    const rec = enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (!rec) return;
    if (!rec.completedModules.includes(moduleIndex)) rec.completedModules.push(moduleIndex);
    this.saveEnrollments(enrollments);
  },

  recordQuizResult(userId, courseId, scorePercent, passed) {
    const enrollments = this.getEnrollments();
    const rec = enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (!rec) return;
    rec.quizScore = scorePercent;
    rec.quizPassed = passed;
    if (passed && !rec.certificateIssued) {
      rec.certificateIssued = true;
      rec.certificateDate = new Date().toISOString();
    }
    this.saveEnrollments(enrollments);
  },

  courseProgressPercent(userId, courseId) {
    const course = this.getCourse(courseId);
    const rec = this.getEnrollment(userId, courseId);
    if (!course || !rec) return 0;
    const moduleWeight = 70; // modules = 70% of progress, quiz pass = remaining 30%
    const moduleShare = course.modules.length ? (rec.completedModules.length / course.modules.length) * moduleWeight : 0;
    const quizShare = rec.quizPassed ? 30 : 0;
    return Math.round(moduleShare + quizShare);
  }
};

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function pulseDividerSVG() {
  return `<span class="pulse-divider"><svg viewBox="0 0 600 34" preserveAspectRatio="none">
    <path class="pulse-path" d="M0,17 L140,17 L160,4 L180,30 L200,17 L230,17 L245,10 L260,24 L275,17 L600,17"/>
  </svg></span>`;
}
