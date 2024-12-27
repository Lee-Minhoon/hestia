const global = globalThis as unknown as {
  fileStorage: Map<string, ArrayBuffer>;
};

if (!global.fileStorage) {
  global.fileStorage = new Map<string, ArrayBuffer>();
}

// This is a simple in-memory file storage solution.
// In a production application, you should use a cloud storage service like AWS S3.
export const fileStorage = global.fileStorage;
