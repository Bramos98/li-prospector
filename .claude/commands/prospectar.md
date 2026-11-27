---
description: Corre una tanda de prospeccion en LinkedIn - busca posts donde alguien pide ayuda, califica, escribe los comentarios y arma la cola del dia
argument-hint: "[busquedas separadas por coma, opcional]"
---

Corré una tanda de prospección de li-prospector. Seguí estos pasos en orden y no te saltes ninguno.

1. Si no existe `docs/mis-criterios.md`, copiá `docs/criterios-plantilla.md` a `docs/mis-criterios.md`, ayudá al usuario a llenarlo con preguntas cortas (qué vende, a quién, qué pedidos le sirven, cómo escribe) usando `docs/ejemplo-benramosai.md` de guía, y pará cuando esté lleno. Si existe, leelo completo.
2. Si no existe `.env` con `APIFY_TOKEN`, decile al usuario que copie `.env.example` a `.env` y pegue su token de Apify (https://console.apify.com/settings/integrations), y pará.
3. Mostrá el costo estimado antes de gastar: `npm run recolectar -- --seco` (si $ARGUMENTS no está vacío, agregá `--busquedas '$ARGUMENTS'`). Si el estimado pasa de $2, preguntale al usuario antes de seguir.
4. Corré la recolección: `npm run recolectar` (con `-- --busquedas '$ARGUMENTS'` si vino). Si no quedan candidatos, decíselo al usuario y pará.
5. Leé `data/corridas/<fecha de la corrida>/candidatos.txt` completo. Calificá cada post con `docs/mis-criterios.md` y escribí `data/corridas/<fecha>/calificados.json` (solo puntaje 5 o más, con el comentario escrito para los de 7 o más).
6. Corré `npm run cola -- <fecha>` y abrí el HTML que genera (`open` en Mac, `xdg-open` en Linux, `start` en Windows).
7. Reportá en pocas líneas: posts bajados, candidatos, cuántos pasaron, gasto real, qué búsquedas rindieron y cuáles no trajeron nada útil (para sacarlas de `config.json`).
