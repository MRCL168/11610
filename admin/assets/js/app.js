/* ============================================================
   app.js — Logika utama aplikasi
   Mengatur: routing antar-view & panel, daftar konten (artikel
   & halaman) dengan paginasi, editor, media, modul kategori,
   modul menu navigasi, serta pengaturan situs.
   ============================================================ */

const App = (() => {
  /* ---------- Konstanta ---------- */
  const PER_PAGE = 20; // jumlah item per halaman di daftar admin
  const CONFIG_PATH = "config.json";
  const MEDIA_PATH = "public/images";

  // Slug yang dipakai sistem — tidak boleh dipakai sebagai slug post/halaman
  const RESERVED_SLUGS = new Set([
    "page", "category", "tag", "admin", "theme", "public",
    "assets", "posts", "index", "404",
  ]);

  // Definisi koleksi konten yang dikelola sama (artikel & halaman)
  const COLLECTIONS = {
    posts: {
      label: "artikel", listEl: "#article-list", countEl: "#list-count",
      pagerEl: "#posts-pagination", path: () => Config.getAll().path,
    },
    pages: {
      label: "halaman", listEl: "#page-list", countEl: "#pages-count",
      pagerEl: "#pages-pagination", path: () => Config.getPagesPath(),
    },
  };

  /* ---------- State ---------- */
  const state = {
    data: { posts: [], pages: [] },   // cache penuh per koleksi
    view: { posts: [], pages: [] },   // daftar yang sedang ditampilkan (hasil pencarian)
    page: { posts: 1, pages: 1 },     // halaman aktif paginasi per koleksi
    loaded: { posts: false, pages: false },
    editing: null,                    // item yang sedang diedit (null = baru)
    editingType: "posts",             // 'posts' | 'pages'
    categories: [],                   // [{ name, slug, description }]
    categoriesSha: null,
    catEditingIndex: -1,
    navItems: [],                     // salinan kerja config.nav (mendukung children)
    widgets: [],                      // [{ type, title, ... }]
    widgetsSha: null,
    widgetEditingIndex: -1,
    media: [],                        // cache daftar gambar media
    themePanel: null,                 // { themes:[], activeTheme, manifest, savedOptions }
    siteConfig: null,
    siteConfigSha: null,
    confirmCallback: null,
  };

  /* ---------- Shortcut DOM ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ---------- UI helpers ---------- */

  function showLoader(text = "Memuat…") {
    $("#loader-text").textContent = text;
    $("#loader").classList.remove("hidden");
  }
  function hideLoader() {
    $("#loader").classList.add("hidden");
  }

  function toast(message, type = "info") {
    const icons = { success: "✓", error: "✕", info: "ℹ" };
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span class="toast-icon">${icons[type] || "ℹ"}</span><span>${escapeHtml(message)}</span>`;
    $("#toast-container").appendChild(el);
    setTimeout(() => {
      el.classList.add("toast-out");
      setTimeout(() => el.remove(), 240);
    }, 3400);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function confirmModal(title, message, confirmText, callback) {
    $("#modal-title").textContent = title;
    $("#modal-message").textContent = message;
    $("#modal-confirm-btn").textContent = confirmText || "Hapus";
    state.confirmCallback = callback;
    $("#modal-confirm").classList.remove("hidden");
  }

  function closeModal() {
    $("#modal-confirm").classList.add("hidden");
    state.confirmCallback = null;
  }

  /* ---------- View & panel routing ---------- */

  function showView(name) {
    ["login", "setup", "app"].forEach((v) => {
      $(`#view-${v}`).classList.toggle("hidden", v !== name);
    });
  }

  const PANELS = ["posts", "pages", "categories", "menu", "widgets", "editor", "media", "theme", "settings"];
  function showPanel(name) {
    PANELS.forEach((p) => {
      const el = $(`#panel-${p}`);
      if (el) el.classList.toggle("hidden", p !== name);
    });
    // Sinkronkan highlight navigasi (editor tidak punya item nav sendiri)
    $$(".nav-item[data-nav]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.nav === name);
    });
  }

  /* ============================================================
     INIT — tentukan layar awal berdasarkan konfigurasi
     ============================================================ */
  async function init() {
    bindGlobalEvents();

    if (!Config.hasToken()) {
      showView("login");
      return;
    }

    showLoader("Memverifikasi token…");
    const result = await Auth.validateToken(Config.getToken());
    hideLoader();

    if (!result.ok) {
      Config.clearToken();
      showView("login");
      toast(result.error || "Sesi berakhir, silakan login kembali.", "error");
      return;
    }

    if (!Config.hasRepoConfig()) {
      prefillSetup(result.user);
      showView("setup");
      return;
    }

    enterApp();
  }

  /* ============================================================
     LOGIN
     ============================================================ */
  async function handleLogin() {
    const token = $("#input-token").value.trim();
    if (!token) {
      toast("Masukkan Personal Access Token terlebih dahulu.", "error");
      return;
    }

    showLoader("Menghubungkan…");
    const result = await Auth.validateToken(token);
    hideLoader();

    if (!result.ok) {
      toast(result.error, "error");
      return;
    }

    Config.setToken(token);
    toast(`Berhasil masuk sebagai ${result.user.login}`, "success");

    if (!Config.hasRepoConfig()) {
      prefillSetup(result.user);
      showView("setup");
    } else {
      enterApp();
    }
  }

  function prefillSetup(user) {
    if (user) {
      $("#input-owner").value = user.login;
      $("#setup-user-pill").innerHTML =
        `<img src="${escapeHtml(user.avatar_url)}" alt="" /> Masuk sebagai <strong>${escapeHtml(user.login)}</strong>`;
    }
    const cfg = Config.getAll();
    if (cfg.repo) $("#input-repo").value = cfg.repo;
    if (cfg.branch) $("#input-branch").value = cfg.branch;
    if (cfg.path) $("#input-path").value = cfg.path;
    if ($("#input-pages-path")) $("#input-pages-path").value = cfg.pagesPath;
    if ($("#input-categories-file")) $("#input-categories-file").value = cfg.categoriesFile;
  }

  /* ============================================================
     SETUP REPO
     ============================================================ */
  async function handleSaveConfig() {
    const owner = $("#input-owner").value.trim();
    const repo = $("#input-repo").value.trim();
    const branch = $("#input-branch").value.trim() || "main";
    const path = $("#input-path").value.trim() || "content/posts";
    const pagesPath = ($("#input-pages-path") && $("#input-pages-path").value.trim()) || "content/pages";
    const categoriesFile = ($("#input-categories-file") && $("#input-categories-file").value.trim()) || "content/categories.json";

    if (!owner || !repo) {
      toast("Owner dan nama repository wajib diisi.", "error");
      return;
    }

    Config.setRepoConfig({ owner, repo, branch, path, pagesPath, categoriesFile });

    showLoader("Memverifikasi repository…");
    const check = await API.verifyRepo();
    hideLoader();

    if (!check.ok) {
      toast(check.error, "error");
      return;
    }

    toast("Repository terhubung!", "success");
    enterApp();
  }

  /* ============================================================
     MASUK APLIKASI
     ============================================================ */
  function enterApp() {
    const cfg = Config.getAll();
    $("#repo-badge").textContent = `${cfg.owner}/${cfg.repo} · ${cfg.branch}`;
    showView("app");
    showPanel("posts");
    Editor.initMDE();
    loadCollection("posts");
    // Preload agar dropdown kategori & prefill penulis siap saat menulis
    loadSiteConfig().catch(() => {});
    loadCategories({ silent: true }).catch(() => {});
  }

  /* ============================================================
     DAFTAR KONTEN (artikel & halaman) — generik + paginasi
     ============================================================ */
  async function loadCollection(type) {
    const coll = COLLECTIONS[type];
    const listEl = $(coll.listEl);
    const pager = $(coll.pagerEl);
    listEl.innerHTML = '<div class="skeleton-card"></div>'.repeat(3);
    if (pager) pager.classList.add("hidden");
    $(coll.countEl).textContent = "Memuat…";

    try {
      const files = await API.listFiles(coll.path());
      const mdFiles = files.filter(
        (f) => f.type === "file" && /\.(md|markdown)$/i.test(f.name)
      );

      const items = await Promise.all(
        mdFiles.map(async (f) => {
          try {
            const file = await API.getFile(f.path);
            const { meta } = Editor.parse(file.content);
            return { name: f.name, path: f.path, sha: file.sha, meta, content: file.content };
          } catch (_) {
            return { name: f.name, path: f.path, sha: f.sha, meta: {}, content: "" };
          }
        })
      );

      // Urutkan: terbaru di atas (berdasarkan tanggal, fallback nama)
      items.sort((a, b) => {
        const da = a.meta.date || "";
        const db = b.meta.date || "";
        if (da && db) return db.localeCompare(da);
        if (da) return -1;
        if (db) return 1;
        return a.name.localeCompare(b.name);
      });

      state.data[type] = items;
      state.view[type] = items;
      state.page[type] = 1;
      state.loaded[type] = true;
      renderCollection(type);
    } catch (err) {
      listEl.innerHTML = "";
      $(coll.countEl).textContent = "Gagal memuat";
      toast(`Gagal memuat ${coll.label}: ${err.message}`, "error");
    }
  }

  function renderCollection(type) {
    const coll = COLLECTIONS[type];
    const listEl = $(coll.listEl);
    const list = state.view[type] || [];
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (state.page[type] > totalPages) state.page[type] = totalPages;
    const pageNum = state.page[type];

    $(coll.countEl).textContent =
      total === 0
        ? `Belum ada ${coll.label}`
        : total > PER_PAGE
          ? `${total} ${coll.label} · halaman ${pageNum}/${totalPages}`
          : `${total} ${coll.label}`;

    if (total === 0) {
      listEl.innerHTML = emptyStateHtml(type);
      renderPager(type, 1);
      return;
    }

    const start = (pageNum - 1) * PER_PAGE;
    const slice = list.slice(start, start + PER_PAGE);
    listEl.innerHTML = slice.map((a, i) => itemCardHtml(type, a, start + i)).join("");
    renderPager(type, totalPages);
  }

  function itemCardHtml(type, a, viewIndex) {
    const title = a.meta.title || a.name.replace(/\.(md|markdown)$/i, "");
    const status = (a.meta.status || "published").toLowerCase();
    const statusClass = status === "draft" ? "status-draft" : "status-published";
    const slug = a.meta.slug || a.name.replace(/\.(md|markdown)$/i, "");
    const metaBits =
      type === "posts"
        ? `<span class="status-tag ${statusClass}">${escapeHtml(status)}</span>
           <span>${escapeHtml(a.meta.date || "—")}</span>
           ${a.meta.category ? `<span>${escapeHtml(a.meta.category)}</span>` : ""}
           <span class="mono">${escapeHtml(a.name)}</span>`
        : `<span class="status-tag ${statusClass}">${escapeHtml(status)}</span>
           <span class="mono">/${escapeHtml(slug)}/</span>
           <span class="mono">${escapeHtml(a.name)}</span>`;

    return `
      <article class="article-card">
        <div class="article-info" onclick="App.editItem('${type}', ${viewIndex})">
          <h3>${escapeHtml(title)}</h3>
          <div class="article-meta">${metaBits}</div>
        </div>
        <div class="article-card-actions">
          <button class="btn btn-ghost" onclick="App.editItem('${type}', ${viewIndex})">Edit</button>
          <button class="btn btn-ghost btn-icon" onclick="App.askDeleteItem('${type}', ${viewIndex})" title="Hapus">🗑</button>
        </div>
      </article>`;
  }

  function emptyStateHtml(type) {
    const isPost = type === "posts";
    return `
      <div class="empty-state">
        <div class="empty-icon">${isPost ? "✎" : "▦"}</div>
        <h3>Belum ada ${isPost ? "artikel" : "halaman"}</h3>
        <p>${isPost
          ? "Mulai tulis artikel pertama Anda."
          : "Buat halaman statis seperti Tentang, Kontak, atau Kebijakan Privasi."} File akan disimpan langsung ke repository GitHub.</p>
        <button class="btn btn-primary" onclick="App.newItem('${type}')">+ ${isPost ? "Tulis Artikel Pertama" : "Buat Halaman Pertama"}</button>
      </div>`;
  }

  function renderPager(type, totalPages) {
    const pager = $(COLLECTIONS[type].pagerEl);
    if (!pager) return;
    if (totalPages <= 1) {
      pager.classList.add("hidden");
      pager.innerHTML = "";
      return;
    }
    const pageNum = state.page[type];
    const prevOff = pageNum <= 1 ? "disabled" : "";
    const nextOff = pageNum >= totalPages ? "disabled" : "";
    // Daftar terurut terbaru→lama, jadi "berikutnya" = post lebih lama
    pager.innerHTML = `
      <button class="btn btn-ghost" ${prevOff} onclick="App.gotoPage('${type}', ${pageNum - 1})">← Lebih baru</button>
      <span class="list-page-info">Halaman ${pageNum} dari ${totalPages}</span>
      <button class="btn btn-ghost" ${nextOff} onclick="App.gotoPage('${type}', ${pageNum + 1})">Lebih lama →</button>`;
    pager.classList.remove("hidden");
  }

  function gotoPage(type, n) {
    const list = state.view[type] || [];
    const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    state.page[type] = Math.min(Math.max(1, n), totalPages);
    renderCollection(type);
    const el = $(`#panel-${type}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function filterCollection(type, query) {
    const q = (query || "").toLowerCase().trim();
    state.view[type] = !q
      ? state.data[type]
      : state.data[type].filter((a) => {
          const title = (a.meta.title || a.name).toLowerCase();
          const slug = (a.meta.slug || "").toLowerCase();
          return title.includes(q) || a.name.toLowerCase().includes(q) || slug.includes(q);
        });
    state.page[type] = 1;
    renderCollection(type);
  }

  /* ============================================================
     EDITOR — buat / edit (artikel & halaman)
     ============================================================ */
  function applyEditorMode(type) {
    const isPost = type === "posts";
    // Field khusus artikel disembunyikan saat mengedit halaman
    $$(".post-only").forEach((el) => el.classList.toggle("hidden", !isPost));

    $("#editor-title").textContent = state.editing
      ? (isPost ? "Edit Artikel" : "Edit Halaman")
      : (isPost ? "Tulis Artikel Baru" : "Halaman Baru");
    $("#editor-sub").textContent = isPost
      ? "Markdown akan disimpan sebagai file .md di folder artikel"
      : "Halaman statis (mis. Tentang, Kontak) — disimpan sebagai .md di folder halaman";
    $("#editor-filename").textContent = state.editing
      ? state.editing.path
      : "Akan dibuat dari slug saat disimpan";
  }

  function updateSlugPreview() {
    const slug = ($("#meta-slug").value || "").trim() || "slug";
    const el = $("#slug-preview");
    if (el) el.textContent = `URL: /${slug}/`;
  }

  function newItem(type) {
    state.editing = null;
    state.editingType = type;
    applyEditorMode(type);

    $("#meta-title").value = "";
    $("#meta-slug").value = "";
    $("#meta-slug").dataset.touched = "";
    $("#meta-status").value = "published";
    $("#meta-date").value = new Date().toISOString().slice(0, 10);
    $("#meta-author").value = (state.siteConfig && state.siteConfig.author) || "";
    $("#meta-tags").value = "";
    $("#meta-excerpt").value = "";
    $("#meta-image").value = "";
    populateCategorySelect("");
    updateFeaturedImagePreview();
    updateSlugPreview();
    Editor.setValue("");

    showPanel("editor");
  }

  function editItem(type, viewIndex) {
    const item = (state.view[type] || [])[viewIndex];
    if (!item) return;

    state.editing = item;
    state.editingType = type;
    const parsed = Editor.parse(item.content);
    const meta = parsed.meta;

    applyEditorMode(type);

    $("#meta-title").value = meta.title || "";
    $("#meta-slug").value = meta.slug || item.name.replace(/\.(md|markdown)$/i, "");
    $("#meta-slug").dataset.touched = "1";
    $("#meta-status").value = (meta.status || "published").toLowerCase();
    $("#meta-date").value = meta.date || "";
    $("#meta-author").value = meta.author || "";
    $("#meta-tags").value = Array.isArray(meta.tags) ? meta.tags.join(", ") : (meta.tags || "");
    $("#meta-excerpt").value = meta.excerpt || "";
    $("#meta-image").value = meta.featured_image || "";
    populateCategorySelect(meta.category || "");
    updateFeaturedImagePreview();
    updateSlugPreview();
    Editor.setValue(parsed.body);

    showPanel("editor");
  }

  async function saveItem() {
    const type = state.editingType;
    const title = $("#meta-title").value.trim();
    if (!title) {
      toast("Judul wajib diisi.", "error");
      return;
    }

    let slug = $("#meta-slug").value.trim() || Editor.slugify(title);
    slug = Editor.slugify(slug); // pastikan benar-benar bersih
    $("#meta-slug").value = slug;

    if (!slug) {
      toast("Slug tidak boleh kosong.", "error");
      return;
    }
    if (RESERVED_SLUGS.has(slug)) {
      toast(`Slug "${slug}" dipakai sistem. Gunakan slug lain.`, "error");
      return;
    }

    let meta;
    if (type === "posts") {
      const tags = $("#meta-tags").value.split(",").map((t) => t.trim()).filter(Boolean);
      meta = {
        title,
        slug,
        date: $("#meta-date").value || new Date().toISOString().slice(0, 10),
        status: $("#meta-status").value,
        category: $("#meta-category").value.trim(),
        author: $("#meta-author").value.trim(),
        tags,
        excerpt: $("#meta-excerpt").value.trim(),
        featured_image: $("#meta-image").value.trim(),
      };
    } else {
      meta = {
        title,
        slug,
        status: $("#meta-status").value,
        excerpt: $("#meta-excerpt").value.trim(),
      };
    }

    const body = Editor.getValue();
    const fileContent = Editor.serialize(meta, body);

    let path, sha, message;
    if (state.editing) {
      path = state.editing.path;
      sha = state.editing.sha;
      message = `Update ${type === "posts" ? "artikel" : "halaman"}: ${title}`;
    } else {
      const dir = type === "posts" ? Config.getAll().path : Config.getPagesPath();
      path = `${dir}/${slug}.md`;
      sha = null;
      message = `Tambah ${type === "posts" ? "artikel" : "halaman"}: ${title}`;
    }

    showLoader(state.editing ? "Menyimpan perubahan…" : "Membuat…");
    try {
      await API.saveFile(path, fileContent, message, sha);
      hideLoader();
      toast(state.editing ? "Tersimpan!" : "Dibuat!", "success");
      showPanel(type);
      loadCollection(type);
    } catch (err) {
      hideLoader();
      if (/sha/i.test(err.message) || /already exists/i.test(err.message)) {
        toast("File dengan slug ini sudah ada. Ganti slug atau muat ulang daftar.", "error");
      } else {
        toast(`Gagal menyimpan: ${err.message}`, "error");
      }
    }
  }

  function askDeleteItem(type, viewIndex) {
    const item = (state.view[type] || [])[viewIndex];
    if (!item) return;
    const title = item.meta.title || item.name;
    const noun = type === "posts" ? "artikel" : "halaman";
    confirmModal(
      `Hapus ${noun}?`,
      `"${title}" akan dihapus permanen dari repository. Tindakan ini tercatat sebagai commit.`,
      "Hapus",
      () => doDeleteItem(type, item)
    );
  }

  async function doDeleteItem(type, item) {
    showLoader("Menghapus…");
    try {
      await API.deleteFile(item.path, item.sha, `Hapus ${type === "posts" ? "artikel" : "halaman"}: ${item.meta.title || item.name}`);
      hideLoader();
      toast("Dihapus.", "success");
      loadCollection(type);
    } catch (err) {
      hideLoader();
      toast(`Gagal menghapus: ${err.message}`, "error");
    }
  }

  /* ============================================================
     MODUL KATEGORI (content/categories.json)
     ============================================================ */
  async function loadCategories(opts = {}) {
    const file = Config.getCategoriesFile();
    try {
      const data = await API.getFile(file);
      if (!data) {
        state.categories = [];
        state.categoriesSha = null;
      } else {
        state.categoriesSha = data.sha;
        try {
          const arr = JSON.parse(data.content);
          state.categories = Array.isArray(arr) ? arr.filter((c) => c && c.name) : [];
        } catch (_) {
          state.categories = [];
          if (!opts.silent) toast("categories.json tidak valid — dianggap kosong.", "error");
        }
      }
    } catch (err) {
      state.categories = [];
      state.categoriesSha = null;
      if (!opts.silent) toast(`Gagal memuat kategori: ${err.message}`, "error");
    }
    if (!opts.silent) renderCategories();
  }

  function renderCategories() {
    const hint = $("#cat-file-hint");
    if (hint) hint.textContent = Config.getCategoriesFile();
    const list = $("#category-list");
    $("#categories-count").textContent = state.categories.length
      ? `${state.categories.length} kategori`
      : "Belum ada kategori";

    if (!state.categories.length) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⊞</div>
          <h3>Belum ada kategori</h3>
          <p>Tambahkan kategori pertama lewat form di atas.</p>
        </div>`;
      return;
    }

    list.innerHTML = state.categories
      .map((c, i) => {
        const slug = c.slug || Editor.slugify(c.name);
        const desc = c.description
          ? `<span>${escapeHtml(c.description.slice(0, 80))}${c.description.length > 80 ? "…" : ""}</span>`
          : "";
        return `
        <article class="article-card">
          <div class="article-info" onclick="App.editCategory(${i})">
            <h3>${escapeHtml(c.name)}</h3>
            <div class="article-meta"><span class="mono">/category/${escapeHtml(slug)}/</span>${desc}</div>
          </div>
          <div class="article-card-actions">
            <button class="btn btn-ghost" onclick="App.editCategory(${i})">Edit</button>
            <button class="btn btn-ghost btn-icon" onclick="App.askDeleteCategory(${i})" title="Hapus">🗑</button>
          </div>
        </article>`;
      })
      .join("");
  }

  function resetCategoryForm() {
    state.catEditingIndex = -1;
    $("#cat-form-title").textContent = "Tambah Kategori";
    $("#cat-name").value = "";
    $("#cat-slug").value = "";
    $("#cat-slug").dataset.touched = "";
    $("#cat-desc").value = "";
    updateCatSlugPreview();
  }

  function editCategory(i) {
    const c = state.categories[i];
    if (!c) return;
    state.catEditingIndex = i;
    $("#cat-form-title").textContent = "Edit Kategori";
    $("#cat-name").value = c.name || "";
    $("#cat-slug").value = c.slug || Editor.slugify(c.name);
    $("#cat-slug").dataset.touched = "1";
    $("#cat-desc").value = c.description || "";
    updateCatSlugPreview();
    $("#panel-categories").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateCatSlugPreview() {
    const slug =
      ($("#cat-slug").value || "").trim() ||
      Editor.slugify($("#cat-name").value || "") ||
      "slug";
    const el = $("#cat-slug-preview");
    if (el) el.textContent = `/category/${slug}/`;
  }

  async function saveCategory() {
    const name = $("#cat-name").value.trim();
    if (!name) {
      toast("Nama kategori wajib diisi.", "error");
      return;
    }
    let slug = $("#cat-slug").value.trim() || Editor.slugify(name);
    slug = Editor.slugify(slug);
    const description = $("#cat-desc").value.trim();
    const idx = state.catEditingIndex;

    const dup = state.categories.findIndex(
      (c, i) => i !== idx && c.name.toLowerCase() === name.toLowerCase()
    );
    if (dup !== -1) {
      toast("Kategori dengan nama itu sudah ada.", "error");
      return;
    }

    const next = state.categories.slice();
    const entry = { name, slug, description };
    if (idx >= 0) next[idx] = entry;
    else next.push(entry);

    await saveCategoriesFile(next, idx >= 0 ? `Update kategori: ${name}` : `Tambah kategori: ${name}`);
  }

  function askDeleteCategory(i) {
    const c = state.categories[i];
    if (!c) return;
    confirmModal(
      "Hapus kategori?",
      `Kategori "${c.name}" akan dihapus dari daftar. Artikel yang memakainya tidak ikut terhapus, tetapi sebaiknya perbarui kategorinya.`,
      "Hapus",
      async () => {
        const next = state.categories.slice();
        next.splice(i, 1);
        await saveCategoriesFile(next, `Hapus kategori: ${c.name}`);
      }
    );
  }

  async function saveCategoriesFile(arr, message) {
    const file = Config.getCategoriesFile();
    const json = JSON.stringify(arr, null, 2) + "\n";
    showLoader("Menyimpan kategori…");
    try {
      const res = await API.saveFile(file, json, message, state.categoriesSha);
      state.categoriesSha = res && res.content ? res.content.sha : state.categoriesSha;
      state.categories = arr;
      hideLoader();
      toast("Kategori tersimpan! Situs akan dibangun ulang otomatis.", "success");
      resetCategoryForm();
      renderCategories();
    } catch (err) {
      hideLoader();
      if (/sha/i.test(err.message)) {
        toast("Daftar kategori berubah di repo. Muat ulang lalu coba lagi.", "error");
      } else {
        toast(`Gagal menyimpan: ${err.message}`, "error");
      }
    }
  }

  /** Isi dropdown kategori pada editor artikel */
  function populateCategorySelect(current) {
    const sel = $("#meta-category");
    if (!sel) return;
    const opts = [`<option value="">— Tanpa kategori —</option>`];
    let hasCurrent = false;
    state.categories.forEach((c) => {
      const isSel = c.name === current ? " selected" : "";
      if (c.name === current) hasCurrent = true;
      opts.push(`<option value="${escapeHtml(c.name)}"${isSel}>${escapeHtml(c.name)}</option>`);
    });
    if (current && !hasCurrent) {
      opts.push(`<option value="${escapeHtml(current)}" selected>${escapeHtml(current)} (belum terdaftar)</option>`);
    }
    sel.innerHTML = opts.join("");
    sel.value = current || "";
  }

  /* ============================================================
     MODUL MENU NAVIGASI (config.json → nav, mendukung submenu)
     ============================================================ */
  async function loadMenu() {
    await loadSiteConfig();
    await loadCategories({ silent: true });
    if (!state.loaded.pages) await loadCollection("pages");

    const raw = Array.isArray(state.siteConfig && state.siteConfig.nav) ? state.siteConfig.nav : [];
    state.navItems = raw.map((n) => ({
      label: n.label || "",
      url: n.url || "",
      children: Array.isArray(n.children)
        ? n.children.map((c) => ({ label: c.label || "", url: c.url || "" }))
        : [],
    }));
    renderNavGroups();
    populateQuickAdd();
  }

  // Rekonstruksi struktur nav (bertingkat) dari DOM
  function readNavFromDOM() {
    return Array.from(document.querySelectorAll("#nav-rows .nav-group")).map((group) => {
      const parent = group.querySelector(":scope > .nav-row");
      const children = Array.from(group.querySelectorAll(":scope > .nav-children > .nav-row")).map((row) => ({
        label: row.querySelector(".nav-label").value.trim(),
        url: row.querySelector(".nav-url").value.trim(),
      }));
      return {
        label: parent.querySelector(".nav-label").value.trim(),
        url: parent.querySelector(".nav-url").value.trim(),
        children,
      };
    });
  }

  function navRowHtml(item, kind, gi, ci) {
    // kind: 'parent' | 'child'. gi = index grup, ci = index child (utk child).
    const isParent = kind === "parent";
    const onUp = isParent ? `App.moveNavItem(${gi}, -1)` : `App.moveChildNav(${gi}, ${ci}, -1)`;
    const onDown = isParent ? `App.moveNavItem(${gi}, 1)` : `App.moveChildNav(${gi}, ${ci}, 1)`;
    const onDel = isParent ? `App.removeNavItem(${gi})` : `App.removeChildNav(${gi}, ${ci})`;
    const addChildBtn = isParent
      ? `<button class="btn btn-ghost btn-icon" title="Tambah submenu" onclick="App.addChildNav(${gi})">＋</button>`
      : "";
    return `
      <div class="nav-row">
        <div class="nav-row-fields">
          <input type="text" class="nav-label" value="${escapeHtml(item.label)}" placeholder="${isParent ? "Label menu" : "Label submenu"}" />
          <input type="text" class="nav-url" value="${escapeHtml(item.url)}" placeholder="${isParent ? "/about/ atau #" : "/category/seo/"}" />
        </div>
        <div class="nav-row-actions">
          ${addChildBtn}
          <button class="btn btn-ghost btn-icon" title="Naik" onclick="${onUp}">↑</button>
          <button class="btn btn-ghost btn-icon" title="Turun" onclick="${onDown}">↓</button>
          <button class="btn btn-ghost btn-icon" title="Hapus" onclick="${onDel}">🗑</button>
        </div>
      </div>`;
  }

  function renderNavGroups() {
    const wrap = $("#nav-rows");
    if (!state.navItems.length) {
      wrap.innerHTML = `<p class="field-hint">Belum ada item menu. Tambahkan lewat tombol di bawah atau "Tambah Cepat".</p>`;
      return;
    }
    wrap.innerHTML = state.navItems
      .map((item, gi) => {
        const children = (item.children || [])
          .map((c, ci) => navRowHtml(c, "child", gi, ci))
          .join("");
        return `
        <div class="nav-group" data-index="${gi}">
          ${navRowHtml(item, "parent", gi)}
          <div class="nav-children">
            ${children || '<p class="nav-children-empty field-hint">Belum ada submenu — klik ＋ untuk menambah.</p>'}
          </div>
        </div>`;
      })
      .join("");
  }

  function addNavItem() {
    state.navItems = readNavFromDOM();
    state.navItems.push({ label: "", url: "/", children: [] });
    renderNavGroups();
  }

  function removeNavItem(gi) {
    state.navItems = readNavFromDOM();
    state.navItems.splice(gi, 1);
    renderNavGroups();
  }

  function moveNavItem(gi, dir) {
    state.navItems = readNavFromDOM();
    const j = gi + dir;
    if (j < 0 || j >= state.navItems.length) return;
    const tmp = state.navItems[gi];
    state.navItems[gi] = state.navItems[j];
    state.navItems[j] = tmp;
    renderNavGroups();
  }

  function addChildNav(gi) {
    state.navItems = readNavFromDOM();
    if (!state.navItems[gi]) return;
    state.navItems[gi].children = state.navItems[gi].children || [];
    state.navItems[gi].children.push({ label: "", url: "/" });
    renderNavGroups();
  }

  function removeChildNav(gi, ci) {
    state.navItems = readNavFromDOM();
    if (!state.navItems[gi] || !state.navItems[gi].children) return;
    state.navItems[gi].children.splice(ci, 1);
    renderNavGroups();
  }

  function moveChildNav(gi, ci, dir) {
    state.navItems = readNavFromDOM();
    const arr = state.navItems[gi] && state.navItems[gi].children;
    if (!arr) return;
    const j = ci + dir;
    if (j < 0 || j >= arr.length) return;
    const tmp = arr[ci];
    arr[ci] = arr[j];
    arr[j] = tmp;
    renderNavGroups();
  }

  function populateQuickAdd() {
    const sel = $("#quick-add-select");
    if (!sel) return;
    const opts = [`<option value="home">Beranda (/)</option>`];

    (state.data.pages || []).forEach((p) => {
      const slug = p.meta.slug || p.name.replace(/\.(md|markdown)$/i, "");
      const title = p.meta.title || slug;
      opts.push(`<option value="page::${escapeHtml(title)}::/${escapeHtml(slug)}/">Halaman — ${escapeHtml(title)}</option>`);
    });

    state.categories.forEach((c) => {
      const slug = c.slug || Editor.slugify(c.name);
      opts.push(`<option value="cat::${escapeHtml(c.name)}::/category/${escapeHtml(slug)}/">Kategori — ${escapeHtml(c.name)}</option>`);
    });

    sel.innerHTML = opts.join("");
  }

  function quickAdd() {
    const sel = $("#quick-add-select");
    if (!sel) return;
    state.navItems = readNavFromDOM();
    const val = sel.value;
    if (val === "home") {
      state.navItems.push({ label: "Beranda", url: "/", children: [] });
    } else {
      const parts = val.split("::"); // type::label::url
      state.navItems.push({ label: parts[1] || "", url: parts[2] || "/", children: [] });
    }
    renderNavGroups();
    toast("Item ditambahkan ke menu. Jangan lupa Simpan Menu.", "info");
  }

  async function saveMenu() {
    const nav = readNavFromDOM()
      .filter((n) => n.label && n.url)
      .map((n) => {
        const children = (n.children || []).filter((c) => c.label && c.url);
        const out = { label: n.label, url: n.url };
        if (children.length) out.children = children;
        return out;
      });
    const saved = await saveSiteConfig({ nav }, "Perbarui menu navigasi via CMS");
    if (saved) {
      state.navItems = nav.map((n) => ({ label: n.label, url: n.url, children: n.children || [] }));
      renderNavGroups();
    }
  }

  /* ============================================================
     MODUL WIDGET (content/widgets.json) — blok footer
     ============================================================ */
  const WIDGET_LABELS = {
    "text": "Teks / HTML",
    "recent-posts": "Artikel Terbaru",
    "categories": "Daftar Kategori",
    "tags": "Tag Populer",
    "social": "Media Sosial",
  };

  async function loadWidgets(opts = {}) {
    const file = Config.getWidgetsFile();
    try {
      const data = await API.getFile(file);
      if (!data) {
        state.widgets = [];
        state.widgetsSha = null;
      } else {
        state.widgetsSha = data.sha;
        try {
          const arr = JSON.parse(data.content);
          state.widgets = Array.isArray(arr) ? arr : [];
        } catch (_) {
          state.widgets = [];
          if (!opts.silent) toast("widgets.json tidak valid — dianggap kosong.", "error");
        }
      }
    } catch (err) {
      state.widgets = [];
      state.widgetsSha = null;
      if (!opts.silent) toast(`Gagal memuat widget: ${err.message}`, "error");
    }
    if (!opts.silent) {
      renderWidgetList();
      resetWidgetForm();
    }
  }

  function widgetSummary(w) {
    const t = (w.type || "").toLowerCase();
    if (t === "text") return "Teks / HTML kustom";
    if (t === "recent-posts") return `${parseInt(w.count, 10) || 5} artikel terbaru`;
    if (t === "tags") return `${parseInt(w.count, 10) || 20} tag`;
    if (t === "categories") return "Daftar kategori";
    if (t === "social") return "Ikon media sosial";
    return t;
  }

  function renderWidgetList() {
    const hint = $("#widget-file-hint");
    if (hint) hint.textContent = Config.getWidgetsFile();
    const list = $("#widget-list");
    $("#widgets-count").textContent = state.widgets.length ? `${state.widgets.length} widget` : "Belum ada widget";
    if (!state.widgets.length) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">▥</div>
          <h3>Belum ada widget</h3>
          <p>Tambahkan widget pertama lewat form di atas.</p>
        </div>`;
      return;
    }
    list.innerHTML = state.widgets
      .map((w, i) => {
        const label = WIDGET_LABELS[(w.type || "").toLowerCase()] || w.type || "?";
        const title = w.title || "(tanpa judul)";
        return `
        <article class="article-card">
          <div class="article-info" onclick="App.editWidget(${i})">
            <h3>${escapeHtml(title)}</h3>
            <div class="article-meta">
              <span class="status-tag status-published">${escapeHtml(label)}</span>
              <span>${escapeHtml(widgetSummary(w))}</span>
            </div>
          </div>
          <div class="article-card-actions">
            <button class="btn btn-ghost btn-icon" title="Naik" onclick="App.moveWidget(${i}, -1)" ${i === 0 ? "disabled" : ""}>↑</button>
            <button class="btn btn-ghost btn-icon" title="Turun" onclick="App.moveWidget(${i}, 1)" ${i === state.widgets.length - 1 ? "disabled" : ""}>↓</button>
            <button class="btn btn-ghost" onclick="App.editWidget(${i})">Edit</button>
            <button class="btn btn-ghost btn-icon" title="Hapus" onclick="App.askDeleteWidget(${i})">🗑</button>
          </div>
        </article>`;
      })
      .join("");
  }

  function updateWidgetFields() {
    const type = $("#widget-type").value;
    const cf = document.querySelector(".widget-field-content");
    const nf = document.querySelector(".widget-field-count");
    if (cf) cf.classList.toggle("hidden", type !== "text");
    if (nf) nf.classList.toggle("hidden", !(type === "recent-posts" || type === "tags"));
  }

  function resetWidgetForm() {
    state.widgetEditingIndex = -1;
    $("#widget-form-title").textContent = "Tambah Widget";
    $("#widget-type").value = "text";
    $("#widget-title-input").value = "";
    $("#widget-content").value = "";
    $("#widget-count").value = 5;
    updateWidgetFields();
  }

  function editWidget(i) {
    const w = state.widgets[i];
    if (!w) return;
    state.widgetEditingIndex = i;
    $("#widget-form-title").textContent = "Edit Widget";
    $("#widget-type").value = (w.type || "text").toLowerCase();
    $("#widget-title-input").value = w.title || "";
    $("#widget-content").value = w.content || "";
    $("#widget-count").value = parseInt(w.count, 10) || 5;
    updateWidgetFields();
    $("#panel-widgets").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function saveWidget() {
    const type = $("#widget-type").value;
    const title = $("#widget-title-input").value.trim();
    const entry = { type, title };
    if (type === "text") entry.content = $("#widget-content").value;
    if (type === "recent-posts" || type === "tags") {
      entry.count = parseInt($("#widget-count").value, 10) || (type === "tags" ? 20 : 5);
    }
    const idx = state.widgetEditingIndex;
    const next = state.widgets.slice();
    if (idx >= 0) next[idx] = entry;
    else next.push(entry);
    await saveWidgetsFile(next, idx >= 0 ? `Update widget: ${title || type}` : `Tambah widget: ${title || type}`);
  }

  function askDeleteWidget(i) {
    const w = state.widgets[i];
    if (!w) return;
    const label = WIDGET_LABELS[(w.type || "").toLowerCase()] || w.type;
    confirmModal(
      "Hapus widget?",
      `Widget "${w.title || label}" akan dihapus dari footer. Tindakan ini tercatat sebagai commit.`,
      "Hapus",
      async () => {
        const next = state.widgets.slice();
        next.splice(i, 1);
        await saveWidgetsFile(next, `Hapus widget: ${w.title || label}`);
      }
    );
  }

  function moveWidget(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= state.widgets.length) return;
    const next = state.widgets.slice();
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
    saveWidgetsFile(next, "Ubah urutan widget");
  }

  async function saveWidgetsFile(arr, message) {
    const file = Config.getWidgetsFile();
    const json = JSON.stringify(arr, null, 2) + "\n";
    showLoader("Menyimpan widget…");
    try {
      const res = await API.saveFile(file, json, message, state.widgetsSha);
      state.widgetsSha = res && res.content ? res.content.sha : state.widgetsSha;
      state.widgets = arr;
      hideLoader();
      toast("Widget tersimpan! Situs akan dibangun ulang otomatis.", "success");
      resetWidgetForm();
      renderWidgetList();
    } catch (err) {
      hideLoader();
      if (/sha/i.test(err.message)) {
        toast("Daftar widget berubah di repo. Muat ulang lalu coba lagi.", "error");
      } else {
        toast(`Gagal menyimpan: ${err.message}`, "error");
      }
    }
  }

  /* ============================================================
     KONFIGURASI SITUS bersama (config.json)
     ============================================================ */
  async function loadSiteConfig() {
    const file = await API.getFile(CONFIG_PATH);
    if (!file) {
      state.siteConfig = {};
      state.siteConfigSha = null;
      return null;
    }
    state.siteConfigSha = file.sha;
    try {
      state.siteConfig = JSON.parse(file.content);
    } catch (_) {
      state.siteConfig = {};
    }
    return state.siteConfig;
  }

  // Menyimpan perubahan parsial ke config.json. Selalu mengambil versi terbaru
  // dulu agar SHA valid (Pengaturan & Menu sama-sama menulis ke file ini).
  async function saveSiteConfig(patch, message) {
    showLoader("Menyimpan…");
    try {
      const file = await API.getFile(CONFIG_PATH);
      let cfg = {};
      if (file) {
        try { cfg = JSON.parse(file.content); } catch (_) {}
      }
      const merged = Object.assign({}, cfg, patch);
      const json = JSON.stringify(merged, null, 2) + "\n";
      const res = await API.saveFile(CONFIG_PATH, json, message || "Update config via CMS", file ? file.sha : null);
      state.siteConfig = merged;
      state.siteConfigSha = res && res.content ? res.content.sha : (file ? file.sha : null);
      hideLoader();
      toast("Tersimpan! Situs akan dibangun ulang otomatis.", "success");
      return merged;
    } catch (err) {
      hideLoader();
      if (/sha/i.test(err.message)) {
        toast("config.json berubah di repo. Muat ulang lalu coba lagi.", "error");
      } else {
        toast(`Gagal menyimpan: ${err.message}`, "error");
      }
      return null;
    }
  }

  /* ============================================================
     TEMA — pilih tema aktif & atur opsinya (theme.json → config.json)
     Panel ini hanya MEMBACA struktur themes/ dan MENULIS dua field
     ke config.json: { theme, themeOptions }. Ia tidak menyentuh file
     tema apa pun — sesuai kontrak "core menyediakan data".
     ============================================================ */

  // Ambil & parse manifest theme.json sebuah tema. Mengembalikan {} bila
  // tidak ada / tidak valid (tema tetap boleh dipakai tanpa opsi).
  async function fetchThemeManifest(themeName) {
    try {
      const f = await API.getFile(`themes/${themeName}/theme.json`);
      if (!f) return {};
      return JSON.parse(f.content);
    } catch (_) {
      return {};
    }
  }

  async function loadThemePanel() {
    showLoader("Memuat tema…");
    try {
      const cfg = (await loadSiteConfig()) || {};
      const activeTheme = (cfg.theme || "default").trim();
      const savedOptions = cfg.themeOptions && typeof cfg.themeOptions === "object" ? cfg.themeOptions : {};

      // Temukan tema dari folder themes/ (type === "dir").
      let themes = [];
      try {
        const entries = await API.listFiles("themes");
        themes = entries.filter((e) => e.type === "dir").map((e) => e.name);
      } catch (_) {
        /* listing gagal — fallback di bawah */
      }
      // Fallback: minimal tampilkan tema aktif agar panel tetap berguna
      // walau API listing gagal atau folder themes/ belum ke-push.
      if (!themes.length) themes = [activeTheme];
      if (!themes.includes(activeTheme)) themes.unshift(activeTheme);

      const manifest = await fetchThemeManifest(activeTheme);

      state.themePanel = { themes, activeTheme, manifest, savedOptions };
      hideLoader();
      renderThemePanel();
    } catch (err) {
      hideLoader();
      toast(`Gagal memuat tema: ${err.message}`, "error");
    }
  }

  // Render dropdown tema + meta + form opsi dari state.themePanel.
  function renderThemePanel() {
    const tp = state.themePanel;
    if (!tp) return;

    // Dropdown tema
    const sel = $("#theme-select");
    sel.innerHTML = tp.themes
      .map((name) => `<option value="${esc(name)}"${name === tp.activeTheme ? " selected" : ""}>${esc(name)}</option>`)
      .join("");

    // Meta tema (nama, versi, author) dari manifest
    const m = tp.manifest || {};
    const metaBits = [];
    if (m.name) metaBits.push(`<strong>${esc(m.name)}</strong>`);
    if (m.version) metaBits.push(`v${esc(m.version)}`);
    if (m.author) metaBits.push(`oleh ${esc(m.author)}`);
    $("#theme-meta").innerHTML = metaBits.length
      ? `<p class="field-hint">${metaBits.join(" · ")}</p>`
      : "";

    renderThemeOptions();
  }

  // Bangun field input untuk tiap opsi di manifest.options.
  function renderThemeOptions() {
    const tp = state.themePanel;
    const wrap = $("#theme-options");
    const intro = $("#theme-options-intro");
    const options = (tp.manifest && tp.manifest.options) || {};
    const keys = Object.keys(options);

    if (!keys.length) {
      if (intro) intro.classList.add("hidden");
      wrap.innerHTML = `<p class="field-hint">Tema ini tidak menyediakan opsi yang dapat dikonfigurasi.</p>`;
      return;
    }
    if (intro) intro.classList.remove("hidden");

    wrap.innerHTML = keys
      .map((key) => {
        const opt = options[key] || {};
        const label = esc(opt.label || key);
        const def = opt.default != null ? String(opt.default) : "";
        const saved = Object.prototype.hasOwnProperty.call(tp.savedOptions, key)
          ? String(tp.savedOptions[key])
          : def;
        const id = `themeopt-${esc(key)}`;
        let control = "";

        if (opt.type === "color") {
          const val = saved || "#000000";
          control =
            `<div class="theme-color-row">` +
            `<input type="color" id="${id}" data-key="${esc(key)}" data-default="${esc(def)}" value="${esc(val)}" />` +
            `<input type="text" class="theme-color-hex" data-for="${id}" value="${esc(val)}" spellcheck="false" />` +
            `</div>`;
        } else if (opt.type === "select" && Array.isArray(opt.choices)) {
          const opts = opt.choices
            .map((c) => `<option value="${esc(String(c))}"${String(c) === saved ? " selected" : ""}>${esc(String(c))}</option>`)
            .join("");
          control = `<select id="${id}" data-key="${esc(key)}" data-default="${esc(def)}">${opts}</select>`;
        } else {
          control = `<input type="text" id="${id}" data-key="${esc(key)}" data-default="${esc(def)}" value="${esc(saved)}" />`;
        }

        const hint = def ? `<small class="field-hint">Bawaan: <code>${esc(def)}</code></small>` : "";
        return `<div class="field"><label for="${id}">${label}</label>${control}${hint}</div>`;
      })
      .join("");

    // Sinkronkan color picker ↔ input hex teks.
    $$("#theme-options input[type=color]").forEach((picker) => {
      const hex = wrap.querySelector(`.theme-color-hex[data-for="${picker.id}"]`);
      if (!hex) return;
      picker.addEventListener("input", () => { hex.value = picker.value; });
      hex.addEventListener("input", () => {
        const v = hex.value.trim();
        if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) picker.value = v;
      });
    });
  }

  // Ganti tema di dropdown → muat manifest baru (belum disimpan).
  async function onThemeSelectChange(e) {
    const tp = state.themePanel;
    if (!tp) return;
    const chosen = e.target.value;
    showLoader("Memuat opsi tema…");
    const manifest = await fetchThemeManifest(chosen);
    hideLoader();
    tp.activeTheme = chosen;
    tp.manifest = manifest;
    // Opsi tersimpan hanya relevan untuk tema yang sedang aktif di config.
    // Saat pindah ke tema lain, mulai dari nilai bawaan tema tersebut.
    if (chosen !== ((state.siteConfig && state.siteConfig.theme) || "default")) {
      tp.savedOptions = {};
    } else {
      tp.savedOptions = (state.siteConfig && state.siteConfig.themeOptions) || {};
    }
    renderThemePanel();
  }

  // Kumpulkan nilai opsi & simpan { theme, themeOptions } ke config.json.
  // Opsi yang sama dengan nilai bawaan TIDAK ditulis, agar config tetap
  // ringkas dan output build identik saat semua opsi default.
  async function saveTheme() {
    const tp = state.themePanel;
    if (!tp) return;
    const theme = $("#theme-select").value;

    const themeOptions = {};
    $$("#theme-options [data-key]").forEach((el) => {
      const key = el.dataset.key;
      const def = el.dataset.default != null ? el.dataset.default : "";
      const val = String(el.value).trim();
      if (val !== "" && val !== def) themeOptions[key] = val;
    });

    await saveSiteConfig({ theme, themeOptions }, `Ganti tema → "${theme}" via CMS`);
    // Selaraskan state lokal agar render berikutnya konsisten.
    tp.activeTheme = theme;
    tp.savedOptions = themeOptions;
  }

  /* ============================================================
     PENGATURAN SITUS (form)
     ============================================================ */
  async function loadSettings() {
    showLoader("Memuat pengaturan…");
    try {
      const cfg = await loadSiteConfig();
      hideLoader();
      if (cfg === null) {
        toast("File config.json tidak ditemukan di repo.", "error");
        return;
      }
      const s = cfg.social || {};
      $("#set-title").value = cfg.title || "";
      $("#set-tagline").value = cfg.tagline || "";
      $("#set-description").value = cfg.description || "";
      $("#set-author").value = cfg.author || "";
      $("#set-baseurl").value = cfg.baseUrl || "";
      $("#set-basepath").value = cfg.basePath || "";
      $("#set-perpage").value = cfg.postsPerPage || 6;
      $("#set-logo").value = cfg.logo || "";
      $("#set-favicon").value = cfg.favicon || "";
      $("#set-footer-copyright").value = cfg.footerCopyright || "";
      $("#set-github").value = s.github || "";
      $("#set-twitter").value = s.twitter || "";
      $("#set-instagram").value = s.instagram || "";
      $("#set-linkedin").value = s.linkedin || "";
      $("#set-email").value = s.email || "";
      updateImagePreview("set-logo", "logo-preview", "logo-empty");
      updateImagePreview("set-favicon", "favicon-preview", "favicon-empty");
    } catch (err) {
      hideLoader();
      toast(`Gagal memuat pengaturan: ${err.message}`, "error");
    }
  }

  async function saveSettings() {
    const patch = {
      title: $("#set-title").value.trim(),
      tagline: $("#set-tagline").value.trim(),
      description: $("#set-description").value.trim(),
      author: $("#set-author").value.trim(),
      baseUrl: $("#set-baseurl").value.trim().replace(/\/+$/, ""),
      basePath: $("#set-basepath").value.trim().replace(/\/+$/, ""),
      postsPerPage: parseInt($("#set-perpage").value, 10) || 6,
      logo: $("#set-logo").value.trim(),
      favicon: $("#set-favicon").value.trim(),
      footerCopyright: $("#set-footer-copyright").value.trim(),
      social: {
        github: $("#set-github").value.trim(),
        twitter: $("#set-twitter").value.trim(),
        instagram: $("#set-instagram").value.trim(),
        linkedin: $("#set-linkedin").value.trim(),
        email: $("#set-email").value.trim(),
      },
    };
    await saveSiteConfig(patch, "Update pengaturan situs via CMS");
  }

  /** Render preview gambar (logo/favicon) di pengaturan situs */
  function updateImagePreview(fieldId, imgId, emptyId) {
    const field = $("#" + fieldId);
    const img = $("#" + imgId);
    const empty = $("#" + emptyId);
    if (!field || !img || !empty) return;
    const value = field.value.trim();
    if (!value) {
      img.classList.add("hidden");
      img.removeAttribute("src");
      empty.classList.remove("hidden");
      return;
    }
    img.src = imagePreviewUrl(value);
    img.classList.remove("hidden");
    empty.classList.add("hidden");
  }

  /* ============================================================
     MEDIA
     ============================================================ */
  async function loadMedia() {
    const grid = $("#media-grid");
    grid.innerHTML = '<div class="skeleton-card"></div>'.repeat(4);

    try {
      const files = await API.listFiles(MEDIA_PATH);
      const images = files.filter(
        (f) => f.type === "file" && /\.(png|jpe?g|gif|webp|svg)$/i.test(f.name)
      );
      state.media = images;
      renderMedia(images);
    } catch (err) {
      grid.innerHTML = "";
      toast(`Gagal memuat media: ${err.message}`, "error");
    }
  }

  function renderMedia(images) {
    const grid = $("#media-grid");
    if (images.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-icon">▣</div>
          <h3>Belum ada gambar</h3>
          <p>Upload gambar untuk dipakai di artikel. Tersimpan di folder <code>${MEDIA_PATH}/</code>.</p>
        </div>`;
      return;
    }

    grid.innerHTML = images
      .map((img, i) => {
        const url = img.download_url || "";
        return `
        <div class="media-item">
          <img class="media-thumb" src="${escapeHtml(url)}" alt="${escapeHtml(img.name)}" loading="lazy" />
          <div class="media-body">
            <div class="media-name" title="${escapeHtml(img.name)}">${escapeHtml(img.name)}</div>
            <div class="media-actions">
              <button onclick="App.mediaInsert(${i})">Sisipkan</button>
              <button onclick="App.mediaFeatured(${i})">Jadikan Featured</button>
              <button onclick="App.mediaCopy(${i})">Salin path</button>
              <button class="media-delete" onclick="App.mediaDelete(${i})">Hapus</button>
            </div>
          </div>
        </div>`;
      })
      .join("");
  }

  /* ---- Aksi media berbasis indeks (hindari masalah escaping path/nama) ---- */
  function mediaInsert(i) {
    const m = state.media[i];
    if (m) insertImage(m.path, m.name);
  }
  function mediaFeatured(i) {
    const m = state.media[i];
    if (m) setFeaturedImage(m.path);
  }
  function mediaCopy(i) {
    const m = state.media[i];
    if (m) copyText(m.path);
  }
  function mediaDelete(i) {
    const m = state.media[i];
    if (!m) return;
    confirmModal(
      "Hapus media?",
      `Gambar "${m.name}" akan dihapus permanen dari repository. Artikel atau halaman yang memakainya bisa kehilangan gambar tersebut.`,
      "Hapus",
      () => doDeleteMedia(m)
    );
  }
  async function doDeleteMedia(m) {
    showLoader("Menghapus gambar…");
    try {
      await API.deleteFile(m.path, m.sha, `Hapus gambar: ${m.name}`);
      hideLoader();
      toast("Gambar dihapus.", "success");
      loadMedia();
    } catch (err) {
      hideLoader();
      toast(`Gagal menghapus: ${err.message}`, "error");
    }
  }

  async function handleUpload(file, options = {}) {
    if (!file) return null;

    const uploadTarget = options.target || "media";
    const shouldSetFeatured = uploadTarget === "featured" || options.setFeatured === true;

    const allowedByMime = /^image\/(png|jpe?g|gif|webp|svg\+xml)$/i.test(file.type || "");
    const allowedByExt = /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name || "");
    if (!allowedByMime && !allowedByExt) {
      toast("File harus berupa gambar PNG, JPG, GIF, WebP, atau SVG.", "error");
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("Ukuran gambar maksimal 5 MB.", "error");
      return null;
    }

    showLoader(shouldSetFeatured ? "Mengunggah featured image…" : "Mengunggah gambar…");
    try {
      const base64 = await fileToBase64(file);
      const safeName = sanitizeFileName(file.name);
      const path = `${MEDIA_PATH}/${Date.now()}-${safeName}`;
      const res = await API.uploadBinary(path, base64, `Upload gambar: ${safeName}`);

      if (!res || res.notFound) {
        throw new Error("Upload tidak berhasil. Periksa owner, repository, branch, dan permission token GitHub.");
      }

      const publicPath = normalizeImagePath(path);
      hideLoader();

      if (options.targetField) {
        const f = $("#" + options.targetField);
        if (f) f.value = publicPath;
        if (options.targetField === "set-logo") updateImagePreview("set-logo", "logo-preview", "logo-empty");
        if (options.targetField === "set-favicon") updateImagePreview("set-favicon", "favicon-preview", "favicon-empty");
        toast("Gambar diunggah & dipasang. Jangan lupa Simpan Pengaturan.", "success");
      } else if (shouldSetFeatured) {
        setFeaturedImage(publicPath);
        toast("Featured image berhasil diunggah dan dipasang.", "success");
      } else {
        toast("Gambar berhasil diunggah ke repository.", "success");

        const imageField = $("#meta-image");
        const editorOpen = $("#panel-editor") && !$("#panel-editor").classList.contains("hidden");
        if (editorOpen && imageField && !imageField.value.trim()) setFeaturedImage(publicPath, { silent: true, noSwitch: true });
      }

      loadMedia();
      return publicPath;
    } catch (err) {
      hideLoader();
      toast(`Gagal mengunggah: ${humanizeUploadError(err.message)}`, "error");
      return null;
    }
  }

  function sanitizeFileName(name) {
    const original = String(name || "gambar");
    const extMatch = original.match(/\.([a-z0-9]+)$/i);
    const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : "";
    const base = original
      .replace(/\.[a-z0-9]+$/i, "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "gambar";
    return `${base}${ext}`;
  }

  function humanizeUploadError(message) {
    const msg = String(message || "");
    if (/bad credentials|401/i.test(msg)) {
      return "token GitHub tidak valid atau sudah kedaluwarsa.";
    }
    if (/resource not accessible|403/i.test(msg)) {
      return "token belum punya akses Contents: Read and write ke repository ini.";
    }
    if (/not found|404/i.test(msg)) {
      return "repository atau branch tidak ditemukan. Periksa konfigurasi owner, repo, dan branch.";
    }
    if (/sha|already exists/i.test(msg)) {
      return "file dengan nama yang sama sudah ada. Coba upload ulang.";
    }
    return msg || "terjadi kesalahan tidak diketahui.";
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const bytes = new Uint8Array(reader.result);
          let binary = "";
          const chunk = 0x8000;
          for (let i = 0; i < bytes.length; i += chunk) {
            binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
          }
          resolve(btoa(binary));
        } catch (_) {
          reject(new Error("Gagal mengubah file menjadi Base64."));
        }
      };
      reader.onerror = () => reject(new Error("Gagal membaca file."));
      reader.readAsArrayBuffer(file);
    });
  }

  function normalizeImagePath(path) {
    const clean = String(path || "").trim();
    if (!clean) return "";
    if (/^(https?:)?\/\//i.test(clean) || clean.startsWith("data:")) return clean;
    return `/${clean.replace(/^\/+/, "")}`;
  }

  function imagePreviewUrl(path) {
    const value = String(path || "").trim();
    if (!value) return "";
    if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) return value;

    const cfg = Config.getAll();
    const relPath = value.replace(/^\/+/, "");
    if (cfg.owner && cfg.repo && cfg.branch && relPath) {
      return `https://raw.githubusercontent.com/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/${encodeURIComponent(cfg.branch)}/${relPath}`;
    }
    return normalizeImagePath(value);
  }

  function updateFeaturedImagePreview() {
    const field = $("#meta-image");
    const img = $("#featured-image-preview");
    const empty = $("#featured-image-empty");
    if (!field || !img || !empty) return;

    const value = field.value.trim();
    if (!value) {
      img.classList.add("hidden");
      img.removeAttribute("src");
      empty.classList.remove("hidden");
      return;
    }

    img.src = imagePreviewUrl(value);
    img.classList.remove("hidden");
    empty.classList.add("hidden");
  }

  function setFeaturedImage(path, options = {}) {
    const field = $("#meta-image");
    if (!field) return;
    field.value = normalizeImagePath(path);
    updateFeaturedImagePreview();
    if (!options.noSwitch) showPanel("editor");
    if (!options.silent) toast("Featured image dipasang ke artikel.", "success");
  }

  function clearFeaturedImage() {
    const field = $("#meta-image");
    if (!field) return;
    field.value = "";
    updateFeaturedImagePreview();
    toast("Featured image dikosongkan.", "info");
  }

  function insertImage(path, name) {
    Editor.insert(`![${name}](${normalizeImagePath(path)})`);
    showPanel("editor");
    toast("Gambar disisipkan ke editor.", "success");
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(
      () => toast("Path disalin ke clipboard.", "success"),
      () => toast("Gagal menyalin.", "error")
    );
  }

  /* ============================================================
     LOGOUT
     ============================================================ */
  function logout() {
    confirmModal(
      "Keluar dari GitCMS?",
      "Token akan dihapus dari browser ini. Konfigurasi repository tetap tersimpan.",
      "Keluar",
      () => {
        Config.clearToken();
        showView("login");
        $("#input-token").value = "";
        toast("Anda telah keluar.", "info");
      }
    );
  }

  /* ============================================================
     EVENT BINDING
     ============================================================ */
  function bindGlobalEvents() {
    // Login
    $("#btn-login").addEventListener("click", handleLogin);
    $("#input-token").addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleLogin();
    });

    // Setup
    $("#btn-save-config").addEventListener("click", handleSaveConfig);
    $("#btn-logout-setup").addEventListener("click", () => {
      Config.clearToken();
      showView("login");
    });

    // Navigasi sidebar
    $$(".nav-item[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nav = btn.dataset.nav;
        showPanel(nav);
        if (nav === "posts" && !state.loaded.posts) loadCollection("posts");
        if (nav === "pages" && !state.loaded.pages) loadCollection("pages");
        if (nav === "categories") loadCategories();
        if (nav === "menu") loadMenu();
        if (nav === "widgets") loadWidgets();
        if (nav === "media") loadMedia();
        if (nav === "theme") loadThemePanel();
        if (nav === "settings") loadSettings();
      });
    });

    // Tombol panel — Artikel
    $("#btn-new-article").addEventListener("click", () => newItem("posts"));
    $("#btn-refresh").addEventListener("click", () => loadCollection("posts"));
    $("#search-input").addEventListener("input", (e) => filterCollection("posts", e.target.value));

    // Tombol panel — Halaman
    $("#btn-new-page").addEventListener("click", () => newItem("pages"));
    $("#btn-refresh-pages").addEventListener("click", () => loadCollection("pages"));
    $("#search-pages").addEventListener("input", (e) => filterCollection("pages", e.target.value));

    // Editor
    $("#btn-cancel-edit").addEventListener("click", () => showPanel(state.editingType || "posts"));
    $("#btn-save-article").addEventListener("click", saveItem);

    // Auto-slug saat mengetik judul (hanya untuk item baru)
    $("#meta-title").addEventListener("input", (e) => {
      if (!state.editing && !$("#meta-slug").dataset.touched) {
        $("#meta-slug").value = Editor.slugify(e.target.value);
        updateSlugPreview();
      }
    });
    $("#meta-slug").addEventListener("input", () => {
      $("#meta-slug").dataset.touched = "1";
      updateSlugPreview();
    });

    // Kategori
    $("#btn-refresh-categories").addEventListener("click", () => loadCategories());
    $("#btn-save-category").addEventListener("click", saveCategory);
    $("#btn-cancel-category").addEventListener("click", resetCategoryForm);
    $("#cat-name").addEventListener("input", () => {
      if (!$("#cat-slug").dataset.touched) {
        $("#cat-slug").value = Editor.slugify($("#cat-name").value);
      }
      updateCatSlugPreview();
    });
    $("#cat-slug").addEventListener("input", () => {
      $("#cat-slug").dataset.touched = "1";
      updateCatSlugPreview();
    });

    // Menu navigasi
    $("#btn-refresh-menu").addEventListener("click", loadMenu);
    $("#btn-save-menu").addEventListener("click", saveMenu);
    $("#btn-add-nav").addEventListener("click", addNavItem);
    $("#btn-quick-add").addEventListener("click", quickAdd);

    // Widget
    $("#btn-refresh-widgets").addEventListener("click", () => loadWidgets());
    $("#btn-save-widget").addEventListener("click", saveWidget);
    $("#btn-cancel-widget").addEventListener("click", resetWidgetForm);
    $("#widget-type").addEventListener("change", updateWidgetFields);

    // Media
    $("#btn-refresh-media").addEventListener("click", loadMedia);
    $("#btn-upload-media").addEventListener("click", () => {
      $("#media-upload").click();
    });
    $("#media-upload").addEventListener("change", (e) => {
      handleUpload(e.target.files[0]);
      e.target.value = "";
    });

    // Upload khusus featured image di sidebar editor
    $("#btn-upload-featured-image").addEventListener("click", () => {
      $("#featured-image-upload").click();
    });
    $("#featured-image-upload").addEventListener("change", (e) => {
      handleUpload(e.target.files[0], { target: "featured" });
      e.target.value = "";
    });
    $("#btn-open-media-for-featured").addEventListener("click", () => {
      showPanel("media");
      loadMedia();
      toast("Pilih tombol ‘Jadikan Featured’ pada gambar yang ingin dipakai.", "info");
    });
    $("#btn-clear-featured-image").addEventListener("click", clearFeaturedImage);
    $("#meta-image").addEventListener("input", updateFeaturedImagePreview);

    // Pengaturan situs
    $("#btn-save-settings").addEventListener("click", saveSettings);

    // Tema — simpan & ganti pilihan tema
    $("#btn-save-theme").addEventListener("click", saveTheme);
    $("#theme-select").addEventListener("change", onThemeSelectChange);

    // Logo & Favicon (upload / hapus / preview)
    $("#btn-upload-logo").addEventListener("click", () => $("#logo-upload").click());
    $("#logo-upload").addEventListener("change", (e) => {
      handleUpload(e.target.files[0], { targetField: "set-logo" });
      e.target.value = "";
    });
    $("#btn-clear-logo").addEventListener("click", () => {
      $("#set-logo").value = "";
      updateImagePreview("set-logo", "logo-preview", "logo-empty");
    });
    $("#set-logo").addEventListener("input", () => updateImagePreview("set-logo", "logo-preview", "logo-empty"));

    $("#btn-upload-favicon").addEventListener("click", () => $("#favicon-upload").click());
    $("#favicon-upload").addEventListener("change", (e) => {
      handleUpload(e.target.files[0], { targetField: "set-favicon" });
      e.target.value = "";
    });
    $("#btn-clear-favicon").addEventListener("click", () => {
      $("#set-favicon").value = "";
      updateImagePreview("set-favicon", "favicon-preview", "favicon-empty");
    });
    $("#set-favicon").addEventListener("input", () => updateImagePreview("set-favicon", "favicon-preview", "favicon-empty"));

    // Pengaturan repo (footer sidebar)
    $("#btn-settings").addEventListener("click", () => {
      prefillSetup(null);
      const cfg = Config.getAll();
      $("#input-owner").value = cfg.owner;
      showView("setup");
    });
    $("#btn-logout").addEventListener("click", logout);

    // Modal konfirmasi
    $("#modal-cancel").addEventListener("click", closeModal);
    $("#modal-confirm-btn").addEventListener("click", () => {
      if (state.confirmCallback) state.confirmCallback();
      closeModal();
    });
    $("#modal-confirm").addEventListener("click", (e) => {
      if (e.target.id === "modal-confirm") closeModal();
    });
  }

  /* ---------- API publik (dipanggil dari atribut onclick) ---------- */
  return {
    init,
    newItem,
    editItem,
    askDeleteItem,
    gotoPage,
    editCategory,
    askDeleteCategory,
    // Menu (mendukung submenu)
    addChildNav,
    removeNavItem,
    removeChildNav,
    moveNavItem,
    moveChildNav,
    // Widget
    editWidget,
    askDeleteWidget,
    moveWidget,
    // Media
    mediaInsert,
    mediaFeatured,
    mediaCopy,
    mediaDelete,
    // Featured image (dipakai internal upload editor)
    setFeaturedImage,
  };
})();

/* Jalankan saat DOM siap */
document.addEventListener("DOMContentLoaded", App.init);
