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
      });

      parser = new PDFParse({ data: file.buffer });
      const result = await parser.getText();

      console.log(
        "Extraction complete. Pages:",
        result.pages.length,
        "Text length:",
        result.text?.length,
      );

      return {
        text: result.text,
        numpages: result.pages.length,
      };
    } catch (error: any) {
      console.error("PDF Parsing Error:", error);
      return {
        error: "Failed to parse PDF",
        message: error.message,
      };
    } finally {
      if (parser) {
        await parser.destroy();
      }
    }
  }
}
