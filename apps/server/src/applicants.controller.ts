import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PDFParse } from "pdf-parse";

@Controller("applicants")
export class ApplicantsController {
  @Post("upload-resume")
  @UseInterceptors(FileInterceptor("file"))
  async uploadResume(@UploadedFile() file: any) {
    if (!file) {
      return { error: "No file uploaded" };
    }

    let parser: PDFParse | null = null;
    try {
      console.log("Starting PDF extraction for file:", {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        bufferExists: !!file.buffer,
        bufferLength: file.buffer?.length,
      });

      // Create a new parser instance with the file buffer
      parser = new PDFParse({ data: file.buffer });

      console.log("PDFParse instance created, extracting text...");
      const textResult = await parser.getText();

      console.log(
        "Extraction complete. Pages:",
        textResult.pages?.length,
        "Text length:",
        textResult.text?.length,
      );

      if (!textResult.text || textResult.text.trim().length === 0) {
        console.warn("Extracted text is empty!");
      }

      return {
        text: textResult.text,
        numpages: textResult.pages?.length || 0,
      };
    } catch (error: any) {
      console.error("PDF Parsing Error:", error);
      return {
        error: "Failed to parse PDF",
        message: error.message,
        stack: error.stack,
        details: typeof error === "string" ? error : JSON.stringify(error),
      };
    } finally {
      if (parser) {
        console.log("Destroying parser...");
        await parser.destroy();
      }
    }
  }
}
