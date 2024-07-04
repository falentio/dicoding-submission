function defaultTheme() {
  const stored = localStorage.getItem("dark");
  if (stored) {
    return stored === "true";
  }
  return matchMedia("(prefer-color-scheme: dark)").matches;
}

function toggle() {
  dark = !dark;
  console.log(dark);
  document.body.classList.toggle("dark", dark);
  localStorage.setItem("dark", dark.toString());
}

let dark = defaultTheme();

document.body.classList.toggle("dark", dark);

const button = document.querySelector("button.theme-toggle");
if (button) {
  button.addEventListener("click", toggle, true);
}
