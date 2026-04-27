async function loadData() {
  const res = await fetch("/api");
  const data = await res.json();

  document.getElementById("output").innerText =
    JSON.stringify(data, null, 2);
}