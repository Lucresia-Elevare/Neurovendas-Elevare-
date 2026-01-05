import { renderStructuredEbook } from "./server/_core/ebookRenderer";
import { convertHtmlToPdfWithTimeout } from "./server/_core/htmlToPdf";
import type { EbookDocument } from "./shared/ebookSchema";
import { writeFile } from "fs/promises";

const testDoc: EbookDocument = {
  meta: {
    title: "Teste de PDF",
    subtitle: "Validando Pipeline WeasyPrint",
    author: "Sistema",
    tone: "educational",
    audience: "Desenvolvedores",
    goal: "Testar geração de PDF"
  },
  sections: [
    {
      type: "hero",
      title: "Bem-vindo ao Teste",
      subtitle: "Este é um teste do pipeline de geração de PDF"
    },
    {
      type: "section",
      title: "Seção de Teste",
      blocks: [
        {
          type: "paragraph",
          content: "Este é um parágrafo de teste para validar a geração de PDF com WeasyPrint."
        }
      ]
    }
  ]
};

async function testPdfGeneration() {
  try {
    console.log("1. Renderizando JSON → HTML...");
    const html = renderStructuredEbook(testDoc, "educational");
    console.log(`   HTML gerado: ${html.length} caracteres`);
    
    console.log("2. Convertendo HTML → PDF...");
    const pdfBuffer = await convertHtmlToPdfWithTimeout({ html }, 30000);
    console.log(`   PDF gerado: ${pdfBuffer.length} bytes`);
    
    console.log("3. Salvando PDF...");
    await writeFile("/tmp/test_ebook.pdf", pdfBuffer);
    
    console.log("✅ PDF gerado com sucesso em /tmp/test_ebook.pdf");
    return true;
  } catch (error) {
    console.error("❌ Erro:", error);
    return false;
  }
}

testPdfGeneration().then(success => {
  process.exit(success ? 0 : 1);
});
