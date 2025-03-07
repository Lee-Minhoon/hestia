import { ChangeEventHandler, forwardRef, useCallback } from "react";

import { Editor } from "@tiptap/react";

import { Nullable } from "@/types/common";

interface ImagesInputProps {
  editor: Nullable<Editor>;
}

const ImagesInput = forwardRef<HTMLInputElement, ImagesInputProps>(
  ({ editor }, ref) => {
    const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
      (e) => {
        if (!editor) return;

        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result;
            if (typeof dataUrl === "string") {
              editor.chain().focus().setImage({ src: dataUrl }).run();
              editor
                .chain()
                .focus()
                .setTextSelection(editor.state.selection.to + 1)
                .run();
            }
          };
          reader.readAsDataURL(file);
        });
      },
      [editor]
    );

    return (
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    );
  }
);

ImagesInput.displayName = "ImagesInput";

export { ImagesInput };
