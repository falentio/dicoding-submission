import { h, clearElement, mount } from "./helper.js";

async function getMovies(title) {
  const url = new URL("https://meowvie.fly.dev/movie/search");
  url.searchParams.set("q", `+provider:"kusonime" ${title}`);
  const res = await fetch(url.href);
  if (!res.ok) {
    return null;
  }
  return res.json().catch((e) => {
    console.error(e);
    return null;
  });
}

function meowvieCard(movie) {
  return h("section", null, [
    h("h4", null, movie.title),
    h("p", null, `Provider: ${movie.provider}`),
    h(
      "div",
      { class: "download-urls" },
      movie.downloadUrl
        .slice(0, 8)
        .sort((a, b) => (`${b.server} ${b.resolution}` > `${a.server} ${a.resolution}` ? 1 : 0))
        .map((u) => h("a", { href: u.url }, `${u.server} ${u.resolution}`))
    ),
  ]);
}

/** @type {HTMLInputElement} */
const input = document.getElementById("movie-search");
const movieContainer = document.querySelector(".movie-container");
if (input) {
  input.addEventListener("keyup", async (e) => {
    const title = e.currentTarget.value;
    if (!title) {
      clearElement(movieContainer);
      return;
    }
    /** @type {[]any} */
    const movies = await getMovies(title);
    const el = movies.map(meowvieCard);
    clearElement(movieContainer);
    mount(movieContainer, el);
  });
}
