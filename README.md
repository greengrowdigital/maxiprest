# MaxiPrest — Sitio web (demo)

Sitio web profesional multi-página para **MaxiPrest** (Panamá), empresa de préstamos personales hasta B/. 100,000.

## Stack
- HTML estático puro · Tailwind CDN · Vanilla JS
- Google Fonts (Fraunces · Inter · JetBrains Mono)
- Deploy: Vercel
- Backend del formulario: n8n webhook + envío de email

## Estructura
```
.
├── index.html        # Landing
├── prestamos.html    # Detalle de producto
├── requisitos.html   # 5 requisitos interactivos
├── aplica.html       # Formulario + upload documentos
├── contacto.html     # Contacto + FAQ
├── shared/           # CSS y JS compartidos entre páginas
├── public/           # Logos, íconos, imágenes
└── vercel.json
```

## Desarrollo local
```bash
npx serve . -p 3000
# o
python -m http.server 3000
```

## Deploy
```bash
vercel --prod
```
Auto-deploy en cada push a `main`.

## Formulario → n8n
El formulario en `aplica.html` envía multipart/form-data al webhook:
`https://gaelale.app.n8n.cloud/webhook/maxiprest-application`

El workflow n8n:
1. Recibe los datos del formulario + 3 archivos (cédula, carta trabajo, ficha talonaria)
2. Envía email con todos los datos a `moralesalexisrr@gmail.com` con los archivos adjuntos
3. Devuelve 200 OK al sitio

Tras éxito, el sitio abre WhatsApp (+507 6518-0901) con un resumen del solicitante.

## Identidad visual
- Paleta: Blanco · Dorado champagne (`#C9A961`) · Negro premium (`#0A0A0A`)
- Estilo: editorial premium tipo banca privada (lejos del fintech genérico)
- Tipografía: Fraunces (display) + Inter (body) + JetBrains Mono (cifras)
