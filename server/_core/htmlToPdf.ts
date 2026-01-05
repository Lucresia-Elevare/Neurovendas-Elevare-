import puppeteer from "puppeteer";

/**
 * HTML to PDF Converter using Puppeteer
 */

export interface PDFOptions {
  format?: "A4" | "Letter";
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
  displayHeaderFooter?: boolean;
}

export async function generatePDFFromHTML(
  html: string,
  options: PDFOptions = {}
): Promise<Buffer> {
  const {
    format = "A4",
    margin = { top: "40px", right: "40px", bottom: "40px", left: "40px" },
    printBackground = true,
    displayHeaderFooter = false,
  } = options;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format,
      margin,
      printBackground,
      displayHeaderFooter,
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
