const refreshBtn = document.querySelector(".catsum-container button");
const img = document.querySelector(".catsum-container img");
refreshBtn.addEventListener("click", () => {
  img.src = "";
  img.src = `https://catsum.deno.dev/seed/${Math.random()}/400`;
});
