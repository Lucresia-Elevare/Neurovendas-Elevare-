/**
 * E-book Renderer - Generates HTML for different ebook templates
 */

export interface EbookData {
  title: string;
  content: string;
  template: "educational" | "marketing" | "storytelling";
  author?: string;
  coverImage?: string;
}

export function renderEbookHTML(data: EbookData): string {
  const { title, content, template, author = "Neurovendas Elevare", coverImage } = data;

  const templateStyles = getTemplateStyles(template);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${baseStyles}
    ${templateStyles}
  </style>
</head>
<body class="${template}">
  <div class="ebook-container">
    <div class="cover-page">
      ${coverImage ? `<img src="${coverImage}" alt="Cover" class="cover-image" />` : ""}
      <h1 class="ebook-title">${title}</h1>
      <p class="ebook-author">Por ${author}</p>
    </div>
    
    <div class="content-page">
      <div class="content">
        ${content}
      </div>
    </div>
    
    <div class="footer-page">
      <p>Gerado por Neurovendas Elevare</p>
      <p>© ${new Date().getFullYear()} - Todos os direitos reservados</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

const baseStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #1e293b;
  }

  .ebook-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
  }

  .cover-page {
    text-align: center;
    padding: 100px 40px;
    margin-bottom: 60px;
    page-break-after: always;
  }

  .cover-image {
    max-width: 400px;
    margin-bottom: 40px;
    border-radius: 8px;
  }

  .ebook-title {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #4f46e5;
  }

  .ebook-author {
    font-size: 24px;
    color: #64748b;
    font-weight: 500;
  }

  .content-page {
    padding: 40px 0;
  }

  .content h1 {
    font-size: 36px;
    margin: 40px 0 20px;
    color: #1e293b;
    font-weight: 700;
  }

  .content h2 {
    font-size: 28px;
    margin: 32px 0 16px;
    color: #334155;
    font-weight: 600;
  }

  .content h3 {
    font-size: 22px;
    margin: 24px 0 12px;
    color: #475569;
    font-weight: 600;
  }

  .content p {
    margin: 16px 0;
    font-size: 16px;
    line-height: 1.8;
  }

  .content ul, .content ol {
    margin: 16px 0;
    padding-left: 32px;
  }

  .content li {
    margin: 8px 0;
  }

  .content blockquote {
    border-left: 4px solid #4f46e5;
    padding-left: 20px;
    margin: 24px 0;
    font-style: italic;
    color: #64748b;
  }

  .content code {
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 14px;
  }

  .content pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 20px 0;
  }

  .content pre code {
    background: none;
    padding: 0;
    color: inherit;
  }

  .footer-page {
    text-align: center;
    padding: 40px;
    margin-top: 60px;
    border-top: 2px solid #e2e8f0;
    color: #94a3b8;
    font-size: 14px;
  }

  .footer-page p {
    margin: 8px 0;
  }
`;

function getTemplateStyles(template: string): string {
  const styles: Record<string, string> = {
    educational: `
      .educational .ebook-title {
        color: #2563eb;
      }
      .educational .content h1,
      .educational .content h2 {
        color: #1e40af;
      }
      .educational .content blockquote {
        border-left-color: #2563eb;
      }
    `,
    marketing: `
      .marketing .ebook-title {
        color: #dc2626;
      }
      .marketing .content h1,
      .marketing .content h2 {
        color: #b91c1c;
      }
      .marketing .content blockquote {
        border-left-color: #dc2626;
      }
    `,
    storytelling: `
      .storytelling .ebook-title {
        color: #7c3aed;
      }
      .storytelling .content h1,
      .storytelling .content h2 {
        color: #6d28d9;
      }
      .storytelling .content blockquote {
        border-left-color: #7c3aed;
      }
    `,
  };

  return styles[template] || styles.educational;
}
