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

interface ImageUploaderContextValue {
  onClick: () => void;
  preview?: string | null;
  clear?: () => void;
}

const ImageUploaderContext = createContext<
  ImageUploaderContextValue | undefined
>(undefined);

const useImageUploader = () => {
  const context = useContext(ImageUploaderContext);
  if (!context) {
    throw new Error(
      "useImageUploader must be used within an ImageUploaderProvider"
    );
  }
  return context;
};

interface ImageUploaderProps {
  children?:
    | React.ReactNode
    | ((props: ImageUploaderContextValue) => React.ReactNode);
  onFileChange?: (file: File | null) => void;
}

const ImageUploader = ({ children, onFileChange }: ImageUploaderProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
        onFileChange?.(file);
      }
    },
    [onFileChange]
  );

  const clear = useCallback(() => {
    if (ref.current) {
      ref.current.value = "";
    }
    setPreview((prev) => {
      URL.revokeObjectURL(prev ?? "");
      return null;
    });
    onFileChange?.(null);
  }, [onFileChange]);

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
};

const ImageUploaderTrigger = (props: Omit<SlotProps, "onClick">) => {
  const { onClick } = useImageUploader();

  return <Slot onClick={onClick} {...props} />;
};

interface ImageUploaderPreviewProps extends Omit<ImageProps, "alt" | "src"> {
  alt?: ImageProps["alt"];
  src?: ImageProps["src"];
}

const ImageUploaderPreview = (props: ImageUploaderPreviewProps) => {
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
};

const ImageUploaderClear = (props: Omit<SlotProps, "onClick">) => {
  const { clear } = useImageUploader();

  return <Slot onClick={clear} {...props} />;
};

export {
  ImageUploader,
  ImageUploaderClear,
  ImageUploaderPreview,
  ImageUploaderTrigger,
};
