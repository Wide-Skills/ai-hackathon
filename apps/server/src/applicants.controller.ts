import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as pdf from "pdf-parse";

@Controller("applicants")
export class ApplicantsController {
  @Post("upload-resume")
  @UseInterceptors(FileInterceptor("file"))
  async uploadResume(@UploadedFile() file: any) {
    if (!file) {
      return { error: "No file uploaded" };
    }

    try {
      // @ts-ignore - pdf-parse types are sometimes tricky with esm
      const data = await pdf.default(file.buffer);
      return {
        text: data.text,
        info: data.info,
        metadata: data.metadata,
        numpages: data.numpages,
      };
    } catch (error) {
      console.error("PDF Parsing Error:", error);
      return { error: "Failed to parse PDF" };
    }
  }
}
