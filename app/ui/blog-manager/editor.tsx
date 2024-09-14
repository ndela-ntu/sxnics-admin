import React, { useEffect, useRef, useState } from "react";

interface EditorProps {
  initialValue: string;
  onChange: (value: string, deletedImages: string[]) => void;
}

const Editor: React.FC<EditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<any>(null);
  const isInitialized = useRef(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const getCloudinaryPublicId = (url: string): string | null => {
    const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
    return match ? match[1] : null;
  };

  const isBase64Image = (str: string): boolean => {
    return str.startsWith("data:image");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized.current) {
      isInitialized.current = true;

      Promise.all([import("quill"), import("quill-blot-formatter")]).then(
        ([Quill, BlotFormatter]) => {
          Quill.default.register(
            "modules/blotFormatter",
            BlotFormatter.default
          );

          const quillInstance = new Quill.default(editorRef.current!, {
            modules: {
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
              blotFormatter: {},
            },
            theme: "snow",
          });

          quillInstance.on("text-change", () => {
            const content = quillInstance.root.innerHTML;
            onChange(content, deletedImages);
            setDeletedImages([]); // Reset deletedImages after reporting
          });

          quillInstance.on(
            "editor-change",
            (eventName: string, ...args: any[]) => {
              if (eventName === "text-change") {
                const [delta, oldDelta, source] = args;
                const oldImages = oldDelta.ops
                  .filter((op: any) => op.insert && op.insert.image)
                  .map((op: any) => op.insert.image);
                const newImages = quillInstance.root.querySelectorAll("img");
                const newImageSrcs = Array.from(newImages).map(
                  (img: HTMLImageElement) => img.src
                );

                const newlyDeletedImages = oldImages.filter((oldImg: any) => {
                  if (isBase64Image(oldImg)) {
                    // For base64 images, compare the full string
                    return !newImageSrcs.includes(oldImg);
                  } else {
                    // For Cloudinary URLs, compare public IDs
                    const oldPublicId = getCloudinaryPublicId(oldImg);
                    return !newImageSrcs.some((newImg) => {
                      if (isBase64Image(newImg)) return false; // New base64 image can't match old Cloudinary URL
                      const newPublicId = getCloudinaryPublicId(newImg);
                      return oldPublicId === newPublicId;
                    });
                  }
                });

                if (newlyDeletedImages.length > 0) {
                  setDeletedImages((prev) => [...prev, ...newlyDeletedImages]);
                }
              }
            }
          );

          quillInstance.root.innerHTML = initialValue;

          setQuill(quillInstance);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (quill && quill.root.innerHTML !== initialValue) {
      quill.root.innerHTML = initialValue;
    }
  }, [initialValue, quill]);

  return (
    <div className="quill-editor-container bg-black p-4">
      <div
        ref={editorRef}
        className="bg-black text-white" // Quill editor content background and text color
        style={{ minHeight: "300px" }} // Ensures the editor has some initial height
      ></div>
    </div>
  );
};

export default Editor;
