// Recolecta candidatos: busquedas de frases de pedido en LinkedIn -> posts nuevos -> descarte automatico.
// No califica ni escribe comentarios: eso lo hace Claude con /prospectar, siguiendo docs/criterios.md.
// Uso: npm run recolectar [-- --seco] [-- --busquedas '"alguien conoce","busco socio"']
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA = path.join(ROOT, "data");
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "config.json"), "utf8"));
const TOKEN = process.env.APIFY_TOKEN;
const ACTOR = "harvestapi~linkedin-post-search"; // sin cookie: no toca tu cuenta de LinkedIn
const PRECIO = 0.002; // USD por post en el plan free (verificado 26/11/2026)

const args = process.argv.slice(2);
const seco = args.includes("--seco");
const bIdx = args.indexOf("--busquedas");

const leer = (f, def) => (fs.existsSync(path.join(DATA, f)) ? JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8")) : def);
const guardar = (f, v) => fs.writeFileSync(path.join(DATA, f), JSON.stringify(v, null, 2));
const norm = (t) => (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

if (!TOKEN) {
  console.error("Falta APIFY_TOKEN. Copiá .env.example a .env y poné tu token de Apify");
  process.exit(1);
}

const busquedas = bIdx >= 0 ? args[bIdx + 1].split(",") : cfg.busquedas;
const estimado = busquedas.length * cfg.postsPorBusqueda * PRECIO;
console.log(`Búsquedas: ${busquedas.length}, hasta ${cfg.postsPorBusqueda} posts cada una (${cfg.antiguedad}).`);
console.log(`Costo máximo estimado: ~$${estimado.toFixed(2)}`);
if (seco) { console.log("Modo --seco: no se busca nada."); process.exit(0); }

// 1. Corrida asincrona: con muchas busquedas el modo sync corta a los 5 minutos
const api = (p, opt) => fetch(`https://api.apify.com/v2/${p}${p.includes("?") ? "&" : "?"}token=${TOKEN}`, opt).then(async (r) => {
  if (!r.ok) throw new Error(`${p}: HTTP ${r.status} ${await r.text()}`);
  return r.json();
});
let run = (await api(`acts/${ACTOR}/runs`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ searchQueries: busquedas, maxPosts: cfg.postsPorBusqueda, postedLimit: cfg.antiguedad, sortBy: "date" }),
})).data;
process.stdout.write("Buscando");
while (["READY", "RUNNING"].includes(run.status)) {
  await new Promise((r) => setTimeout(r, 10000));
  run = (await api(`actor-runs/${run.id}`)).data;
  process.stdout.write(".");
}
console.log(` ${run.status}`);
if (run.status !== "SUCCEEDED") { console.error(`La corrida terminó en ${run.status}: https://console.apify.com/view/runs/${run.id}`); process.exit(1); }
const posts = await api(`datasets/${run.defaultDatasetId}/items?clean=true`);
const gasto = run.usageTotalUsd ?? posts.length * PRECIO;

// 2. Descarte automatico: repetidos, vistos en corridas anteriores, sin texto y sin frase de pedido
const vistos = new Set(leer("posts-vistos.json", []));
const patrones = cfg.patronesPedido.map(norm);
const descartes = { repetido: 0, visto: 0, vacio: 0, sinPedido: 0 };
const ids = new Set();
const candidatos = [];
for (const p of posts) {
  if (ids.has(p.id)) { descartes.repetido++; continue; }
  ids.add(p.id);
  if (vistos.has(p.id)) { descartes.visto++; continue; }
  const texto = (p.content || "").trim();
  if (!texto) { descartes.vacio++; continue; }
  if (!patrones.some((x) => norm(texto).includes(x))) { descartes.sinPedido++; continue; }
  const a = p.author || {};
  candidatos.push({
    id: p.id, url: p.linkedinUrl, fecha: p.postedAt?.date?.slice(0, 10) || "", hace: p.postedAt?.postedAgoShort || "",
    autor: a.name || "", tipo: a.type || "", cargo: a.info || a.position || "", perfil: (a.linkedinUrl || "").split("?")[0],
    comentarios: p.engagement?.comments ?? 0, reacciones: p.engagement?.likes ?? 0,
    busqueda: p.query?.search || "", texto: texto.replace(/\s+/g, " ").slice(0, cfg.maxCaracteres),
  });
}

// 3. Guardar la corrida y actualizar los posts vistos
const fecha = new Date().toISOString().slice(0, 10);
const dir = path.join(DATA, "corridas", fecha);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "candidatos.json"), JSON.stringify(candidatos, null, 2));
fs.writeFileSync(path.join(dir, "candidatos.txt"), candidatos.map((k) =>
  `${k.id}|${k.autor}|${k.tipo}|${k.cargo}|${k.hace}|com ${k.comentarios}|${k.texto}`
).join("\n"));
fs.writeFileSync(path.join(dir, "resumen.json"), JSON.stringify({
  fecha, busquedas, posts: posts.length, descartes, candidatos: candidatos.length, gastoUSD: +gasto.toFixed(2), run: run.id,
}, null, 2));
ids.forEach((id) => vistos.add(id));
guardar("posts-vistos.json", [...vistos]);

console.log(`Posts: ${posts.length}. Candidatos para calificar: ${candidatos.length} en data/corridas/${fecha}/candidatos.txt`);
console.log(`Descartes automáticos: ${JSON.stringify(descartes)}. Gasto real: $${gasto.toFixed(2)}`);
