import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Define a route for product images
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      // This runs before the upload. You can check if user is logged in here later.
      return { userId: "seller" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;