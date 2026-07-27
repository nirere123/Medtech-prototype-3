/* ============================================================
   shell.js — renders the sidebar app shell used on every
   authenticated page (dashboard, courses, course, admin).
   ============================================================ */

function renderShell(activePage) {
  const user = Store.requireAuth();
  if (!user) return null;

  const initials = user.name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const navItems = [
    { key: 'dashboard', href: 'dashboard.html', label: 'Dashboard', icon: 'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z' },
    { key: 'courses', href: 'courses.html', label: 'Courses', icon: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5v-14Z M6.5 17H20 M4 19.5A2.5 2.5 0 0 1 6.5 17' },
    { key: 'certificates', href: 'certificates.html', label: 'My certificates', icon: 'M12 2l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 2Z' }
  ];
  if (user.role === 'admin') {
    navItems.push({ key: 'admin', href: 'admin.html', label: 'Manage courses', icon: 'M4 6h16M4 12h16M4 18h16' });
  }

  const navHTML = navItems.map(item => `
    <a href="${item.href}" class="${activePage === item.key ? 'active' : ''}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="${item.icon}"/></svg>
      ${item.label}
    </a>`).join('');

  const shell = document.getElementById('appShell');
  shell.innerHTML = `
    <aside class="sidebar">
      <div class="brand" style="color:var(--paper)">
        <svg class="brand-mark" viewBox="0 0 28 28" fill="none"><path d="M14 2 3 7v6c0 6.5 4.5 10.7 11 13 6.5-2.3 11-6.5 11-13V7L14 2Z" fill="#E8A33D"/><path d="M8 14h4l1.5-4 2 8 1.5-4h3" stroke="#0A2624" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        MedTech Certify
      </div>
      <nav class="sidebar-nav">${navHTML}</nav>
      <div style="margin-top:auto;display:flex;flex-direction:column;gap:12px;">
        <div class="user-chip">
          <div class="user-avatar">${initials}</div>
          <div class="user-meta">
            <strong>${user.name}</strong>
            <span>${user.role === 'admin' ? 'Administrator' : 'Healthcare worker'}</span>
          </div>
        </div>
        <button class="btn btn-on-dark btn-sm btn-block" id="logoutBtn">Log out</button>
        <div class="sidebar-foot">MedTech Training &amp; Certificate System<br>v1.0 prototype</div>
      </div>
    </aside>
    <main class="main" id="mainContent"></main>
  `;

  document.getElementById('logoutBtn').addEventListener('click', () => {
    Store.logout();
    window.location.href = 'index.html';
  });

  return user;
}