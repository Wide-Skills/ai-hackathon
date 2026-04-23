interface AuthEmailTemplateOptions {
  preview: string;
  heading: string;
  intro: string;
  ctaLabel: string;
  ctaUrl: string;
  outro: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildAuthEmailTemplate(options: AuthEmailTemplateOptions) {
  const preview = escapeHtml(options.preview);
  const heading = escapeHtml(options.heading);
  const intro = escapeHtml(options.intro);
  const ctaLabel = escapeHtml(options.ctaLabel);
  const ctaUrl = escapeHtml(options.ctaUrl);
  const outro = escapeHtml(options.outro);

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${heading}</title>
  </head>
  <body style="margin:0;background-color:#f6f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preview}</div>
    <div style="margin:0 auto;max-width:600px;padding:32px 16px;">
      <div style="border-radius:14px;background:#ffffff;padding:32px 40px;">
        <h1 style="margin:0 0 20px;color:#111827;font-size:28px;font-weight:600;">${heading}</h1>
        <p style="margin:0 0 28px;color:#374151;font-size:15px;line-height:24px;">${intro}</p>
        <a href="${ctaUrl}" style="display:inline-block;border-radius:999px;background:#111827;padding:12px 24px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
          ${ctaLabel}
        </a>
        <p style="margin:28px 0 0;color:#6b7280;font-size:12px;line-height:20px;">${outro}</p>
      </div>
    </div>
  </body>
</html>`.trim();
}
