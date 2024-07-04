import { clearElement, css, h, mount, store } from "./helper.js";

/**
 * @param {Book} book
 */
function BookCard(book) {
  const style = css({
    display: "flex",
    flexDirection: "column",
    borderRadius: "0.5rem",
    borderWidth: "1px",
    padding: "0.75rem",
  });
  const title = css({
    fontSize: "1.2rem",
    fontWeight: 700,
    textTransform: "capitalize",
  });
  const author = css({
    fontSize: "0.9rem",
  });
  return h("section", { class: style }, [
    h("h3", { class: title }, book.title),
    h("span", { class: author }, `Pengarang: ${book.author}`),
    h(
      "span",
      { class: author },
      `Status: ${book.isComplete ? "tamat" : "belum tamat"}`,
    ),
    h(
      "span",
      { class: author },
      `Tahun Terbit: ${book.year}`,
    ),
    BookCardAction(book),
  ]);
}

const blur = css({
  backgroundColor: "#64748b25",
  "-webkit-backdrop-filter": "blur(12px)",
  "backdrop-filter": "blur(12px)",
});
const portal = document.getElementById("confirmation-portal");

function Confirmation(action, message, cb) {
  const button = h("button", { class: "btn" }, action);
  button.addEventListener("click", () => {
    portal.classList.toggle(blur, true);
    const yes = h("button", { class: "btn" }, "iya");
    yes.addEventListener("click", () => {
      portal.classList.toggle(blur, false);
      clearElement(confirmation.parentElement);
      cb(true);
    });
    const no = h("button", { class: "btn" }, "tidak");
    no.addEventListener("click", () => {
      portal.classList.toggle(blur, false);
      clearElement(confirmation.parentElement);
      cb(false);
    });
    const confirmation = h("div", {
      class: css({
        display: "flex",
        flexDirection: "column",
        padding: "2rem",
        backgroundColor: "var(--background-color)",
        borderWidth: "1px",
        borderRadius: "8px",
        pointerEvents: "auto",
      }),
    }, [
      h(
        "span",
        {
          class: css({
            fontSize: "1.5rem",
          }),
        },
        message,
      ),
      h(
        "div",
        {
          class: css({
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "0.25rem",
          }),
        },
        [
          yes,
          no,
        ],
      ),
    ]);
    mount(portal, [confirmation], true);
  });
  return button;
}

/**
 * @param {Book} book
 */
function BookCardAction(book) {
  return h("div", {
    class: css({
      display: "flex",
      flexDirection: "row",
      paddingTop: "0.5rem",
      gap: "0.25rem",
    }),
  }, [
    Confirmation(
      "Hapus",
      "apakah anda yakin ingin menghapus buku " + book.title + "?",
      (yes) =>
        yes && state.update(($state) => {
          $state.books = $state.books.filter((b) => b.id !== book.id);
          return $state;
        }),
    ),
    Confirmation(
      "Pindah",
      "apakah anda yakin ingin memindahkan buku ke rak yang lain?",
      (yes) => {
        yes && state.update(($state) => {
          book.isComplete = !book.isComplete;
          return $state;
        });
      },
    ),
  ]);
}

function Input(text, type, cb) {
  const input = h("input", { type });
  input.addEventListener("keyup", cb);
  return h("div", {
    class: css({
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    }),
  }, [
    h(
      "span",
      {
        class: css({
          textTransform: "capitalize",
        }),
      },
      text,
    ),
    input,
  ]);
}

function AddForm(type, cb) {
  const book = { id: generateId(), isComplete: type === "read" };
  const el = h("form", {
    class: css({
      display: "flex",
      flexDirection: "column",
      padding: "2rem",
      backgroundColor: "var(--background-color)",
      borderWidth: "1px",
      borderRadius: "8px",
      pointerEvents: "auto",
      gap: "0.5rem",
    }),
  }, [
    h("h3", {
      class: css({
        fontSize: "1.25rem",
        fontWeight: "700",
      }),
    }, "Masukan data buku"),
    Input("Judul Buku", "text", (e) => book.title = e.currentTarget.value),
    Input("Pengarang", "text", (e) => book.author = e.currentTarget.value),
    Input(
      "Tahun Terbit",
      "number",
      (e) => book.year = e.currentTarget.valueAsNumber,
    ),
    h("button", { class: "btn" }, "Buat"),
  ]);
  el.addEventListener("submit", (e) => {
    e.preventDefault();
    state.update(($state) => {
      $state.books.push(book);
    });
    clearElement(el.parentElement);
    cb(book);
  });
  return el;
}

/**
 * @param {string} title
 * @param {string} type
 * @returns
 */
function BookshelfContainer(title, type) {
  const style = css({
    display: "flex",
    flexDirection: "column",
  });
  const addBtn = h("button", {
    html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m1 5h-2v4H7v2h4v4h2v-4h4v-2h-4V7Z"/></svg>`,
  });
  addBtn.addEventListener("click", () => {
    portal.classList.toggle(blur, true);
    mount(portal, [AddForm(type, () => {
      portal.classList.toggle(blur, false);
    })]);
  });
  return h("section", { class: style }, [
    h(
      "div",
      {
        class: css({
          padding: "0.75rem 0",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }),
      },
      [
        h("h2", null, title),
        addBtn,
      ],
    ),
    h("div", null, []),
    BookList(type),
  ]);
}
/**
 * @param {string} type
 * @returns
 */
function BookList(type) {
  const parent = h("div", {
    class: css({
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    }),
  });
  state.subscribe(($state) => {
    const books = $state.books.filter((b) =>
      b.isComplete === (type === "read")
    );

    mount(
      parent,
      books
        .filter((b) =>
          !$state.bookFilter.author ||
          b.author.includes($state.bookFilter.author)
        )
        .filter((b) =>
          !$state.bookFilter.title || b.title.includes($state.bookFilter.title)
        )
        .filter((b) =>
          !$state.bookFilter.year || b.year === $state.bookFilter.year
        )
        .sort((a, b) => a.id.localeCompare(b.id))
        .map(BookCard),
      true,
    );
  });
  return parent;
}

function SearchPanel() {
  return h("div", {
    class: css({
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      maxWidth: "30rem",
      width: "100%",
      margin: "0 auto",
      padding: "1rem",
    }),
  }, [
    h("h3", {
      class: css({
        fontWeight: 600,
        fontSize: "1.5rem",
      }),
    }, "Cari Buku"),
    SearchFilterInput("judul", "title"),
    SearchFilterInput("Pengarang", "author"),
    SearchFilterInput("Tahun Terbit", "year", "number"),
  ]);
}

function SearchFilterInput(text, field, type = "text") {
  /** @type {HTMLInputElement} */
  const input = h("input", { type });
  input.onkeyup = () =>
    state.update(($state) => {
      if (type === "number") {
        $state.bookFilter[field] = input.valueAsNumber;
      }
      if (type === "text") {
        $state.bookFilter[field] = input.value;
      }
      return $state;
    });
  return h("div", {
    class: css({
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    }),
  }, [
    h(
      "span",
      {
        class: css({
          textTransform: "capitalize",
        }),
      },
      text,
    ),
    input,
  ]);
}

let incr = 0;
function generateId() {
  return Date.now().toString(16) + incr++;
}

/**
 * @param {string} id
 * @param {string} title
 */
const id = "bookshelf";
const parent = document.getElementById(id);
const initialState = {
  /** @type {Book} */
  bookFilter: {
    author: "",
    isComplete: false,
    title: "",
    year: 0,
  },
  /** @type {Array<Book>} */
  books: [{
    id: generateId(),
    author: "falentio",
    isComplete: true,
    title: "kucing lucuh",
    year: 2020,
  }, {
    id: generateId(),
    author: "falentio",
    isComplete: true,
    title: "kucing lucuh",
    year: 2020,
  }],
};
const str = localStorage.getItem(id);
if (str) {
  try {
    const storedState = JSON.parse(str);
    if (typeof storedState !== "object") {
      throw new Error("invalid state");
    }
    Object.assign(initialState, storedState, {
      bookFilter: {
        author: "",
        isComplete: false,
        title: "",
        year: 0,
      },
    });
  } catch {
    localStorage.removeItem(id);
  }
}
const state = store(initialState);
state.subscribe(($state) => {
  // remove duplicates
  $state.books = $state.books.filter((b, i, a) =>
    a.findIndex((bb) => b.id === bb.id) === i
  );
  localStorage.setItem(id, JSON.stringify($state));
});

mount(parent, [
  SearchPanel(),
  h("div", { class: "bookshelf" }, [
    BookshelfContainer("Sudah Dibaca", "read"),
    BookshelfContainer("Belum Dibaca", "unread"),
  ]),
], true);
/**
 * @typedef {object} Book
 * @property {string|number} id
 * @property {string} title
 * @property {string} author
 * @property {number} year
 * @property {boolean} isComplete
 */
