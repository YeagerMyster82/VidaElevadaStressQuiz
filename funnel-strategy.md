# Vida Elevada opt-in funnel

## Funnel actual

1. La persona llega a la landing de opt-in.
2. Deja nombre y email para reclamar el freemium.
3. Se dispara un evento de lead y se redirige a `/thank-you/`.
4. En la página de entrega accede a la rutina según `?tipo=simpatica`, `?tipo=freeze` o `?tipo=mixta`.
5. Desde ahí se introduce suavemente el enfoque de quiropráctica neurológica.

## Archivos clave

- `index.html`: landing de opt-in en español
- `script.js`: validación, loading, placeholders de tracking y redirección a `/thank-you/`
- `thank-you/index.html`: página de entrega
- `thank-you/script.js`: lógica del querystring `tipo`
- `styles.css`: sistema visual compartido

## Integración pendiente

- Reemplazar el placeholder de `POST /api/lead` por tu endpoint real
- Vercel Web Analytics ya quedó preparado con el script `/_vercel/insights/script.js`
- Eventos actuales listos para el dashboard de Vercel:
  - `Optin Page Viewed`
  - `CTA Clicked`
  - `Optin Submitted`
  - `Thank You Viewed`
  - `Routine Type Viewed`
  - `Routine Type Switched`
- Si luego agregas el quiz real antes de la entrega, pasar el resultado al redirect como `?tipo=simpatica`, `?tipo=freeze` o `?tipo=mixta`
