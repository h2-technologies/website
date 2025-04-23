import { createUploadthing } from "uploadthing/server";
import type { FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({
    
  })
  .middleware(async ({ req }) => {
    
  })
}