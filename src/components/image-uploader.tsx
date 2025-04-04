import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import { Slot, SlotProps } from "@radix-ui/react-slot";
import Image, { ImageProps } from "next/image";

import { cn } from "@/lib/utils";
import { Nullable } from "@/types/common";

interface ImageUploaderContextValue {
  onClick: () => void;
  preview: Nullable<string>;
  clear: () => void;
}

const ImageUploaderContext = createContext<
  ImageUploaderContextValue | undefined
>(undefined);

function useImageUploader() {
  const context = useContext(ImageUploaderContext);
  if (!context) {
    throw new Error(
      "useImageUploader must be used within an ImageUploaderProvider"
    );
  }
  return context;
}

interface ImageUploaderProps {
  children?:
    | React.ReactNode
    | ((props: ImageUploaderContextValue) => React.ReactNode);
  onChange?: (file: Nullable<File>) => void;
}

function ImageUploader({ children, onChange }: ImageUploaderProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Nullable<string>>(null);

  const handleClick = useCallback(() => {
    ref.current?.click();
  }, []);

  const handleFileChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        onChange?.(file);
      }
    },
    [onChange]
  );

  const clear = useCallback(() => {
    if (ref.current) {
      ref.current.value = "";
    }
    setPreview((prev) => {
      URL.revokeObjectURL(prev ?? "");
      return null;
    });
    onChange?.(null);
  }, [onChange]);

  return (
    <ImageUploaderContext.Provider
      value={{ onClick: handleClick, preview, clear }}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
      {typeof children === "function"
        ? children({ onClick: handleClick, preview, clear })
        : children}
    </ImageUploaderContext.Provider>
  );
}

function ImageUploaderTrigger(props: Omit<SlotProps, "onClick">) {
  const { onClick } = useImageUploader();

  return <Slot onClick={onClick} {...props} />;
}

interface ImageUploaderPreviewProps extends Omit<ImageProps, "alt" | "src"> {
  alt?: ImageProps["alt"];
  src?: ImageProps["src"];
}

function ImageUploaderPreview(props: ImageUploaderPreviewProps) {
  const { onClick, preview } = useImageUploader();

  return preview ? (
    <Image
      className={cn("cursor-pointer", "object-cover", props.className)}
      onClick={onClick}
      src={preview}
      alt={"preview"}
      {...props}
    />
  ) : null;
}

function ImageUploaderClear(props: Omit<SlotProps, "onClick">) {
  const { clear } = useImageUploader();

  return <Slot onClick={clear} {...props} />;
}

export {
  ImageUploader,
  ImageUploaderClear,
  ImageUploaderPreview,
  ImageUploaderTrigger,
};
