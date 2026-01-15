// DOM Elements and state
let library = [];
const showcase = document.querySelector(".showcase");
const addBookBtn = document.querySelector(".add-book");
const dialog = document.querySelector("dialog");
const dialogClose = document.querySelector("dialog .btn-close");
const form = document.querySelector("dialog form");
const submitBtn = form.querySelector("button[type=submit]");
const searchInput = document.querySelector("#search");
const filterBtns = document.querySelectorAll(".filter-btn");
const statsEl = document.querySelector(".stats");

let editingId = null;
let currentFilter = "all";
let searchQuery = "";

// LocalStorage helpers
const STORAGE_KEY = "personal_library_books_v1";

function saveLibrary() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
  updateStats();
}

function loadLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Re-link prototype methods if needed, or handle as plain objects
      library = parsed;
    }
  } catch (e) {
    library = [];
  }
}

// Event Listeners
addBookBtn.addEventListener("click", () => dialog.showModal());
dialogClose.addEventListener("click", () => dialog.close());

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#title");
  const author = document.querySelector("#author");
  const pages = document.querySelector("#pages");
  const read = document.querySelector("#read");

  if (!title.value || !author.value || !pages.value) return;

  if (editingId) {
    // update existing book
    const book = library.find((b) => b.id === editingId);
    if (book) {
      book.title = title.value.trim();
      book.author = author.value.trim();
      book.pages = pages.value;
      book.read = read.checked;
    }
    editingId = null;
    submitBtn.textContent = "Add Book";
  } else {
    addToLibrary(
      title.value.trim(),
      author.value.trim(),
      pages.value,
      read.checked
    );
  }

  form.reset();
  recreateBooks();
  saveLibrary();
  dialog.close();
});

// Constructor
function Book(title, author, pages) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.id = crypto.randomUUID();
  this.read = false;
}

// Utility functions:
function addToLibrary(title, author, pages, read = false) {
  if (title && author && pages) {
    const book = new Book(title, author, pages);
    book.read = read;
    library.push(book);
  }
}

function displayBook(book) {
  const bookElement = document.createElement("div");
  bookElement.setAttribute("data-id", book.id);
  bookElement.classList.add("book");

  const title = document.createElement("div");
  title.textContent = book.title;
  title.classList.add("title");

  const author = document.createElement("div");
  author.textContent = book.author;
  author.classList.add("author");

  const pages = document.createElement("div");
  pages.textContent = `${book.pages} pages`;
  pages.classList.add("pages");

  const actions = document.createElement("div");
  actions.classList.add("book-actions");

  const btnStatus = document.createElement("button");
  btnStatus.textContent = book.read ? "Read" : "Unread";
  btnStatus.classList.add("btn-read-status");
  btnStatus.addEventListener("click", toggleStatus);

  const btnEdit = document.createElement("button");
  btnEdit.textContent = "Edit";
  btnEdit.classList.add("btn-edit");
  btnEdit.addEventListener("click", openEdit);

  const btnDelete = document.createElement("button");
  btnDelete.textContent = "Delete";
  btnDelete.classList.add("btn-delete");
  btnDelete.addEventListener("click", deleteBook);

  actions.append(btnStatus, btnEdit, btnDelete);
  bookElement.append(title, author, pages, actions);
  showcase.appendChild(bookElement);
}

function getVisibleBooks() {
  const q = searchQuery.trim().toLowerCase();
  return library.filter((book) => {
    if (currentFilter === "read" && !book.read) return false;
    if (currentFilter === "unread" && book.read) return false;
    if (!q) return true;
    return (
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q)
    );
  });
}

function displayBooks() {
  const visible = getVisibleBooks();
  visible.forEach((book) => displayBook(book));
}

function recreateBooks() {
  showcase.innerHTML = "";
  displayBooks();

  const visible = getVisibleBooks();
  if (visible.length === 0) {
    const empty = document.createElement("div");
    empty.classList.add("empty-state");
    empty.innerHTML = `<p>No books found. Click + to add your first book.</p>`;
    showcase.appendChild(empty);
  }
  showcase.appendChild(addBookBtn);
  updateStats();
}

/**
 * UPDATED: Instant Delete
 */
function deleteBook(e) {
  const bookEl = e.target.closest(".book");
  const bookID = bookEl.getAttribute("data-id");

  // Confirmation alert removed as requested
  library = library.filter((book) => book.id !== bookID);

  recreateBooks();
  saveLibrary();
}

/**
 * UPDATED: Toggle Status with safety check
 */
function toggleStatus(e) {
  const bookEl = e.target.closest(".book");
  const bookID = bookEl.getAttribute("data-id");

  const book = library.find((b) => b.id === bookID);
  if (book) {
    // Toggle directly to avoid prototype issues after LocalStorage retrieval
    book.read = !book.read;
    saveLibrary();
    recreateBooks();
  }
}

function openEdit(e) {
  const bookEl = e.target.closest(".book");
  const bookID = bookEl.getAttribute("data-id");
  const book = library.find((b) => b.id === bookID);
  if (!book) return;

  document.querySelector("#title").value = book.title;
  document.querySelector("#author").value = book.author;
  document.querySelector("#pages").value = book.pages;
  document.querySelector("#read").checked = !!book.read;

  editingId = bookID;
  submitBtn.textContent = "Save Changes";
  dialog.showModal();
}

function updateStats() {
  const total = library.length;
  const read = library.filter((b) => b.read).length;
  const unread = total - read;
  if (statsEl)
    statsEl.textContent = `${total} total • ${read} read • ${unread} unread`;
}

// Search and filters
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    recreateBooks();
  });
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    filterBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
    e.currentTarget.setAttribute("aria-pressed", "true");
    currentFilter = e.currentTarget.getAttribute("data-filter") || "all";
    recreateBooks();
  });
});

dialog.addEventListener("close", () => {
  editingId = null;
  submitBtn.textContent = "Add Book";
});

// Initialize
loadLibrary();
const isFirstRun = localStorage.getItem(STORAGE_KEY) === null;
if (isFirstRun && library.length === 0) {
  addToLibrary("Atomic Habits", "James Clear", 320, true);
  addToLibrary("Eloquent JavaScript", "Marijn Haverbeke", 472, false);
  saveLibrary();
}
recreateBooks();
