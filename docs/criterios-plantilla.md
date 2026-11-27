# Mis criterios

Copiá este archivo a `docs/mis-criterios.md` y llenalo. Claude lo lee en cada `/prospectar` para decidir qué posts valen y cómo escribir el comentario. Hay un ejemplo lleno en `docs/ejemplo-benramosai.md`.

## Qué hago

<!-- Una o dos frases: qué vendés y a quién. Ej.: "Implemento CRMs para clínicas dentales en México." -->

## Qué buscamos

Posts donde alguien **pide** algo que yo puedo resolver de verdad. Importa más quién escribe que el tema: si quien pregunta decide la compra, el post vale. Lo que puede pedir:

<!-- Lista de 4 a 8 pedidos concretos. Ej.:
- Quién le implementa un CRM o le ordena el que tiene.
- Cómo dejar de llevar las citas en Excel o en WhatsApp.
- Recomendaciones de software para su clínica.
-->

El comentario tiene que aportar valor aunque nadie me contrate. Lo leen el que pregunta y todos los que tienen la misma duda.

## Descartar (no entra a calificados.json)

- Busca empleo, publica una vacante o recluta perfiles.
- Vende algo: el post es publicidad, aunque use la frase de pedido.
- Es competencia: hace o vende lo mismo que yo.
- No está en el idioma de mi mercado.
- Tiene más de 7 días o el hilo ya está resuelto ("ya encontré", "gracias a todos").
<!-- Agregá lo que en tu caso sea ruido. Ej.: "Pide algo donde no aporto nada (abogados, catering, transporte)." -->

## Puntaje

- **9-10**: pide justo lo que hago, quien escribe tiene poder de decisión y el post es de esta semana.
- **7-8**: el pedido está cerca de lo que hago, o no se sabe bien quién decide.
- **5-6**: podría aportar algo, pero es un pedido flojo. No entra a la cola.
- La cola solo toma puntaje 7 o más. Si dos posts empatan, va primero el que tiene más comentarios: más gente lee el hilo.

## Formato de calificados.json

Un arreglo con solo los de puntaje 5 o más:

```json
{"id":"7531...","s":9,"pide":"Qué pide, en una línea","why":"Por qué vale: quién es, qué señales hay, cuántos comentarios tiene.","com":"El comentario"}
```

`id` es el mismo de `candidatos.txt`. El resto de los datos (autor, link, fecha) los pone `npm run cola`.

## El comentario

- Responde lo que pidió, con algo concreto que pueda usar hoy: 2 o 3 pasos, una pregunta que tiene que hacerle al proveedor, qué revisar antes de contratar, un error común.
- De 3 a 5 frases.
- Sin link, sin precio, sin "te escribo por DM", sin presentar mi empresa.
- Nunca recomendar a la competencia por nombre.
- Que no salgan todos los comentarios con la misma estructura.
<!-- Tu voz: tú o vos, palabras que nunca usás, emojis sí o no. -->
