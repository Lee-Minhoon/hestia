"use client";

import { useMemo, useRef } from "react";

import { useCurrentEditor } from "@tiptap/react";
import { HexColorPicker } from "react-colorful";
import {
  MdCode,
  MdColorize,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatClear,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatStrikethrough,
  MdFormatUnderlined,
  MdHorizontalRule,
  MdOutlineImage,
  MdRedo,
  MdUndo,
} from "react-icons/md";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Toggle } from "../ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import { ImagesInput } from "./images-input";

function MenuBar() {
  const { editor } = useCurrentEditor();

  const menuBarItems = useMemo<MenuBarItemProps[][]>(() => {
    if (!editor) {
      return [];
    }
    return [
      [
        {
          label: "Bold",
          children: <MdFormatBold />,
          onClick: () => editor.chain().focus().toggleBold().run(),
          disabled: () => !editor.can().chain().focus().toggleBold().run(),
          isActive: () => editor.isActive("bold"),
        },
        {
          label: "Italic",
          children: <MdFormatItalic />,
          onClick: () => editor.chain().focus().toggleItalic().run(),
          disabled: () => !editor.can().chain().focus().toggleItalic().run(),
          isActive: () => editor.isActive("italic"),
        },
        {
          label: "Underline",
          children: <MdFormatUnderlined />,
          onClick: () => editor.chain().focus().toggleUnderline().run(),
          disabled: () => !editor.can().chain().focus().toggleUnderline().run(),
          isActive: () => editor.isActive("underline"),
        },
        {
          label: "Strike",
          children: <MdFormatStrikethrough />,
          onClick: () => editor.chain().focus().toggleStrike().run(),
          disabled: () => !editor.can().chain().focus().toggleStrike().run(),
          isActive: () => editor.isActive("strike"),
        },
        {
          label: "Color",
          children: <MdColorize />,
          popover: () => (
            <HexColorPicker
              color={editor.getAttributes("textStyle").color}
              onChange={(color) => editor.chain().focus().setColor(color).run()}
            />
          ),
        },
        {
          label: "Clear marks",
          children: <MdFormatClear />,
          onClick: () => editor.chain().focus().unsetAllMarks().run(),
          disabled: () => !editor.can().chain().focus().unsetAllMarks().run(),
        },
      ],
      [
        {
          label: "Paragraph",
          children: "P",
          onClick: () => editor.chain().focus().setParagraph().run(),
          disabled: () => !editor.can().chain().focus().setParagraph().run(),
          isActive: () => editor.isActive("paragraph"),
        },
        {
          label: "H1",
          children: "H1",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          disabled: () =>
            !editor.can().chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => editor.isActive("heading", { level: 1 }),
        },
        {
          label: "H2",
          children: "H2",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          disabled: () =>
            !editor.can().chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => editor.isActive("heading", { level: 2 }),
        },
        {
          label: "H3",
          children: "H3",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          disabled: () =>
            !editor.can().chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: () => editor.isActive("heading", { level: 3 }),
        },
        {
          label: "H4",
          children: "H4",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 4 }).run(),
          disabled: () =>
            !editor.can().chain().focus().toggleHeading({ level: 4 }).run(),
          isActive: () => editor.isActive("heading", { level: 4 }),
        },
        {
          label: "H5",
          children: "H5",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 5 }).run(),
          disabled: () =>
            !editor.can().chain().focus().toggleHeading({ level: 5 }).run(),
          isActive: () => editor.isActive("heading", { level: 5 }),
        },
        {
          label: "H6",
          children: "H6",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 6 }).run(),
          disabled: () =>
            !editor.can().chain().focus().toggleHeading({ level: 6 }).run(),
          isActive: () => editor.isActive("heading", { level: 6 }),
        },
      ],
      [
        {
          label: "Left",
          children: <MdFormatAlignLeft />,
          onClick: () => editor.chain().focus().setTextAlign("left").run(),
          disabled: () =>
            !editor.can().chain().focus().setTextAlign("left").run(),
          isActive: () => editor.isActive({ textAlign: "left" }),
        },
        {
          label: "Center",
          children: <MdFormatAlignCenter />,
          onClick: () => editor.chain().focus().setTextAlign("center").run(),
          disabled: () =>
            !editor.can().chain().focus().setTextAlign("center").run(),
          isActive: () => editor.isActive({ textAlign: "center" }),
        },
        {
          label: "Right",
          children: <MdFormatAlignRight />,
          onClick: () => editor.chain().focus().setTextAlign("right").run(),
          disabled: () =>
            !editor.can().chain().focus().setTextAlign("right").run(),
          isActive: () => editor.isActive({ textAlign: "right" }),
        },
        {
          label: "Justify",
          children: <MdFormatAlignJustify />,
          onClick: () => editor.chain().focus().setTextAlign("justify").run(),
          disabled: () =>
            !editor.can().chain().focus().setTextAlign("justify").run(),
          isActive: () => editor.isActive({ textAlign: "justify" }),
        },
      ],
      [
        {
          label: "Bullet list",
          children: <MdFormatListBulleted />,
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          disabled: () =>
            !editor.can().chain().focus().toggleBulletList().run(),
          isActive: () => editor.isActive("bulletList"),
        },
        {
          label: "Ordered list",
          children: <MdFormatListNumbered />,
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          disabled: () =>
            !editor.can().chain().focus().toggleOrderedList().run(),
          isActive: () => editor.isActive("orderedList"),
        },
        {
          label: "Code block",
          children: <MdCode />,
          onClick: () => editor.chain().focus().toggleCodeBlock().run(),
          disabled: () => !editor.can().chain().focus().toggleCodeBlock().run(),
          isActive: () => editor.isActive("codeBlock"),
        },
        {
          label: "Blockquote",
          children: <MdFormatQuote />,
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          disabled: () =>
            !editor.can().chain().focus().toggleBlockquote().run(),
          isActive: () => editor.isActive("blockquote"),
        },
        {
          label: "Horizontal rule",
          children: <MdHorizontalRule />,
          onClick: () => editor.chain().focus().setHorizontalRule().run(),
          disabled: () =>
            !editor.can().chain().focus().setHorizontalRule().run(),
        },
        {
          label: "Image",
          children: <MdOutlineImage />,
          onClick: () => imagesInputRef.current?.click(),
        },
      ],
      [
        {
          label: "Undo",
          children: <MdUndo />,
          onClick: () => editor.chain().focus().undo().run(),
          disabled: () => !editor.can().chain().focus().undo().run(),
        },
        {
          label: "Redo",
          children: <MdRedo />,
          onClick: () => editor.chain().focus().redo().run(),
          disabled: () => !editor.can().chain().focus().redo().run(),
        },
      ],
    ];
  }, [editor]);

  const imagesInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex border-b p-1">
      <ImagesInput ref={imagesInputRef} editor={editor} />
      {menuBarItems.map((block, blockIndex) => {
        return (
          <div key={blockIndex} className="flex">
            {block.map(({ label, ...props }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <span>
                    <MenuBarItem label={label} {...props} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
            {blockIndex < menuBarItems.length - 1 && (
              <div className="border-r border-border m-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface MenuBarItemProps {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: () => boolean;
  isActive?: () => boolean;
  popover?: () => React.ReactNode;
}

function MenuBarItem({
  label,
  disabled,
  isActive,
  popover,
  ...props
}: MenuBarItemProps) {
  if (popover) {
    return (
      <Popover key={label}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={disabled?.()}
            {...props}
          />
        </PopoverTrigger>
        <PopoverContent
          className="w-fit p-0"
          onInteractOutside={(e) => {
            if (e.detail.originalEvent instanceof FocusEvent) {
              e.preventDefault();
            }
          }}
        >
          {popover()}
        </PopoverContent>
      </Popover>
    );
  }

  if (isActive) {
    return (
      <Toggle
        key={label}
        pressed={isActive()}
        disabled={disabled?.()}
        {...props}
      />
    );
  }

  return (
    <Button
      key={label}
      type="button"
      size="icon"
      variant="ghost"
      disabled={disabled?.()}
      {...props}
    />
  );
}

export { MenuBar };
