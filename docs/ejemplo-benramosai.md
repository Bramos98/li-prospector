# Ejemplo: criterios de BenRamos.ai

Así quedó la plantilla llenada para un negocio real (consultoría y capacitación en IA para empresas). Usala de guía para escribir los tuyos en `docs/mis-criterios.md`.


Los usa Claude en `/prospectar` para calificar `candidatos.txt` y escribir `calificados.json`.

## Qué buscamos

Posts donde alguien **pide** algo que Ben puede resolver de verdad. Nos interesa más quien escribe que el tema: si el que pregunta es dueño, gerente, director o encargado de un área, el post vale. Lo que pide puede ser:

- Quién le ayuda a usar IA en su empresa o en su equipo (capacitación, consultoría, "por dónde empiezo").
- Microsoft 365, Copilot, Teams o SharePoint para su empresa.
- Automatizar un proceso que hoy hacen a mano o en Excel (cotizaciones, inscripciones, seguimiento, reportes).
- Un CRM, un ERP o un sistema interno, o quién se lo implementa.
- Un socio técnico o un desarrollador para un sistema o una app.
- Qué herramienta usar para algo que se puede resolver con IA o con software propio.
- Una empresa que contrata a alguien que lidere la IA: esa empresa es posible cliente.

El comentario de Ben tiene que aportar valor aunque nadie lo contrate. Lo leen el que pregunta y todos los que tienen la misma duda.

## Descartar (no entra a calificados.json)

- Busca empleo, publica una vacante normal o recluta perfiles (salvo un rol de IA, ver arriba).
- Vende algo: el post es publicidad de una agencia, un consultor o una herramienta, aunque use la frase de pedido.
- Pide algo donde Ben no aporta nada (abogado, catering, transporte, libros, diseño gráfico, enfermería).
- Es un creador de contenido de IA o vende IA o automatización: es competencia.
- No está en español.
- Tiene más de 7 días o el hilo ya está resuelto ("ya encontré", "gracias a todos").

## Puntaje

- **9-10**: pide justo lo que hace Ben (IA en la empresa, M365/Copilot, automatizar, sistema propio), quien escribe tiene poder de decisión y el post es de esta semana.
- **7-8**: el pedido está cerca (CRM, herramienta, capacitación en general) o no se sabe bien quién decide.
- **5-6**: Ben podría aportar algo, pero es un pedido flojo. No entra a la cola.
- La cola solo toma puntaje 7 o más. Si dos posts empatan, va primero el que tiene más comentarios: más gente lee el hilo.

## Formato de calificados.json

Un arreglo con solo los de puntaje 5 o más:

```json
{"id":"7531...","s":9,"pide":"Asesoría en M365 para pymes","why":"VP de procesos, pregunta abierta a su red, 0 comentarios todavía.","com":"El comentario"}
```

`id` es el mismo de `candidatos.txt`. El resto de los datos (autor, link, fecha) los pone `npm run cola`.

## El comentario

- Responde lo que pidió, con algo concreto que pueda usar hoy: 2 o 3 pasos, una pregunta que tiene que hacerle al proveedor, qué revisar antes de contratar, un error común.
- De 3 a 5 frases. Voseo.
- Sin link, sin precio, sin "te escribo por DM", sin "en BenRamos.ai hacemos...". Si el post pide recomendaciones, puede cerrar con algo como "si te sirve, lo vemos" o "esto lo he armado varias veces", sin ofrecer nada.
- Nunca recomendar a la competencia por nombre.
- Que no salgan 12 comentarios con la misma estructura.
- Nada de emojis ni rayas largas. Sin "gurú", "experto", "criterio", "en simple", jerga técnica, ni "fundadores" como traducción de founders.
- Si el post es de España, decirlo en `why` para que Ben decida si pasa el comentario a tú.
