/**
 * Script para gerar PDFs de preview dos 3 templates
 */

import { renderStructuredEbook } from "./server/_core/ebookRenderer";
import { convertHtmlToPdfWithTimeout } from "./server/_core/htmlToPdf";
import type { StructuredEbook } from "./shared/ebookSchema";
import { writeFile } from "fs/promises";

const sampleEbook: StructuredEbook = {
  meta: {
    title: "Guia Completo de Neurovendas",
    subtitle: "Técnicas Comprovadas para Aumentar Suas Vendas",
    author: "Plataforma Elevare",
    tone: "educational",
    audience: "Empreendedores e Vendedores",
    goal: "Ensinar técnicas de neurovendas aplicáveis"
  },
  sections: [
    {
      type: "hero",
      title: "Bem-vindo ao Guia de Neurovendas",
      subtitle: "Aprenda a vender para o cérebro do seu cliente"
    },
    {
      type: "section",
      title: "O Que São Neurovendas?",
      blocks: [
        {
          type: "paragraph",
          content: "Neurovendas é a aplicação de conhecimentos da neurociência ao processo de vendas. Entendendo como o cérebro humano toma decisões, podemos criar estratégias mais eficazes."
        },
        {
          type: "bullet_list",
          items: [
            "Compreensão dos gatilhos mentais",
            "Técnicas de persuasão baseadas em ciência",
            "Aumento de conversões de forma ética"
          ]
        }
      ]
    },
    {
      type: "section",
      title: "Principais Gatilhos Mentais",
      blocks: [
        {
          type: "paragraph",
          content: "Existem diversos gatilhos mentais que influenciam as decisões de compra. Vamos explorar os mais importantes:"
        },
        {
          type: "callout",
          type_callout: "info",
          content: "Escassez: Produtos limitados criam senso de urgência e aumentam o desejo de compra."
        }
      ]
    }
  ]
};

async function generateTemplatePreviews() {
  const templates: Array<{ type: "educational" | "marketing" | "storytelling"; name: string }> = [
    { type: "educational", name: "Educacional" },
    { type: "marketing", name: "Marketing" },
    { type: "storytelling", name: "Storytelling" }
  ];

  for (const template of templates) {
    try {
      console.log(`\nGerando preview do template ${template.name}...`);
      
      // Renderizar HTML
      const html = renderStructuredEbook(sampleEbook, template.type);
      console.log(`  HTML gerado: ${html.length} caracteres`);
      
      // Converter para PDF
      const pdfBuffer = await convertHtmlToPdfWithTimeout({ html }, 60000);
      console.log(`  PDF gerado: ${pdfBuffer.length} bytes`);
      
      // Salvar
      const filename = `/home/ubuntu/neurovendas_ebooks/client/public/template-preview-${template.type}.pdf`;
      await writeFile(filename, pdfBuffer);
      console.log(`  ✅ Salvo em: ${filename}`);
      
    } catch (error) {
      console.error(`  ❌ Erro ao gerar ${template.name}:`, error);
    }
  }
  
  console.log("\n✅ Todos os previews foram gerados!");
}

generateTemplatePreviews().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error("Erro fatal:", error);
  process.exit(1);
});
