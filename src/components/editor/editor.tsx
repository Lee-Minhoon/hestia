"use client";

import { useCallback } from "react";

import { Color } from "@tiptap/extension-color";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { EditorEvents, EditorProvider } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

import { MenuBar } from "./menu-bar";

const extensions = [
  StarterKit,
  Underline,
  TextStyle,
  Color,
  TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
  Image,
];

const editorContainerProps = {
  className:
    "p-4 h-[400px] overflow-y-auto [&_div]:outline-none [&_div]:h-full",
};

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {
  const handleUpdate = useCallback<(props: EditorEvents["update"]) => void>(
    ({ editor }) => {
      onChange(editor.getHTML());
    },
    [onChange]
  );

  return (
    <div className="flex flex-col max-w-full rounded-md border prose prose-p:m-0 prose-headings:m-0 prose-ul:m-0 prose-ol:m-0 prose-li:m-0 prose-pre:m-0 prose-blockquote:m-0 prose-hr:m-0 prose-strong:text-inherit">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        immediatelyRender={false}
        content={value}
        onUpdate={handleUpdate}
        editorContainerProps={editorContainerProps}
      />
    </div>
  );
};

export { Editor };
