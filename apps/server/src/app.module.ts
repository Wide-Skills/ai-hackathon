import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ApplicantsController } from "./applicants.controller";

@Module({
  controllers: [AppController, ApplicantsController],
  providers: [AppService],
})
export class AppModule {}
