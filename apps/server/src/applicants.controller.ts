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
      // Create a new parser instance with the file buffer
      // Following pdf-parse v2 documentation
      parser = new PDFParse({ data: file.buffer });
      
      const textResult = await parser.getText();
      
      return {
        text: textResult.text,
        numpages: textResult.total,
      };
    } catch (error: any) {
      console.error("PDF Parsing Error:", error);
      return { 
        error: "Failed to parse PDF", 
        message: error.message,
        details: typeof error === 'string' ? error : JSON.stringify(error)
      };
    } finally {
      // Free memory as recommended in documentation
      if (parser) {
        await parser.destroy();
      }
    }
  }
}
