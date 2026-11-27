// Arma la cola del dia: los calificados de la corrida, ordenados por puntaje y por comentarios del hilo.
// Lee data/corridas/<fecha>/calificados.json (lo escribe Claude con /prospectar) y candidatos.json.
// Uso: npm run cola [-- 2026-11-26]
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA = path.join(ROOT, "data");
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "config.json"), "utf8"));
const fecha = process.argv[2] || new Date().toISOString().slice(0, 10);
const dir = path.join(DATA, "corridas", fecha);

const leer = (f, def) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : def);
const calificados = leer(path.join(dir, "calificados.json"), null);
if (!calificados) { console.error(`No existe ${dir}/calificados.json. Primero corré /prospectar.`); process.exit(1); }
const candidatos = Object.fromEntries(leer(path.join(dir, "candidatos.json"), []).map((c) => [c.id, c]));
const resumen = leer(path.join(dir, "resumen.json"), {});

const minimo = 7;
const faltan = calificados.filter((p) => !candidatos[p.id]).map((p) => p.id);
if (faltan.length) console.warn(`Ojo: ${faltan.length} ids de calificados.json no están en candidatos.json: ${faltan.join(", ")}`);
const pasan = calificados
  .filter((p) => p.s >= minimo && candidatos[p.id])
  .map((p) => ({ ...candidatos[p.id], ...p }))
  .sort((a, b) => b.s - a.s || b.comentarios - a.comentarios);
const hoy = pasan.slice(0, cfg.colaDiaria);
const fuera = pasan.slice(cfg.colaDiaria);

const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const pct = resumen.posts ? ((pasan.length / resumen.posts) * 100).toFixed(1).replace(".", ",") : "-";
const porPost = pasan.length && resumen.gastoUSD ? `$${(resumen.gastoUSD / pasan.length).toFixed(2).replace(".", ",")}` : "-";
const funnel = [
  [resumen.posts ?? "-", "posts bajados"],
  [resumen.candidatos ?? "-", "con frase de pedido"],
  [calificados.length, "puntaje 5 o más"],
  [pasan.length, `pasan (${pct}%)`],
  [porPost, "costo por post útil"],
].map(([b, s]) => `<div class="f"><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join("");
const nota = `Búsquedas: ${(resumen.busquedas || []).length}. Gasto de la corrida: $${resumen.gastoUSD ?? "-"}. ${fuera.length ? `${fuera.length} pasaron pero no entran hoy (cola de ${cfg.colaDiaria}).` : ""}`;
const lista = fuera.map((p) => `<li><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.autor)}</a> · ${esc(p.pide)} · ${p.s}</li>`).join("") || "<li>Nada afuera.</li>";

const html = fs.readFileSync(path.join(ROOT, "src", "plantilla.html"), "utf8")
  .replaceAll("__FECHA__", fecha)
  .replaceAll("__N__", String(hoy.length))
  .replace("__FUNNEL__", funnel)
  .replace("__NOTA__", esc(nota))
  .replace("__NFUERA__", String(fuera.length))
  .replace("__FUERA__", lista)
  .replace("__P__", JSON.stringify(hoy).replace(/</g, "\\u003c"));

fs.mkdirSync(path.join(ROOT, "colas"), { recursive: true });
const out = path.join(ROOT, "colas", `cola-${fecha}.html`);
fs.writeFileSync(out, html);
console.log(`Cola: ${hoy.length} para hoy, ${fuera.length} afuera -> ${out}`);
