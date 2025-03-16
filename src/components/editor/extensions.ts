import Image, { ImageOptions } from "@tiptap/extension-image";
import { Plugin, Transaction } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { uniqueId } from "lodash-es";

interface Options extends ImageOptions {
  upload: (file: File) => Promise<string>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageWithUploadHook: {
      addImages: () => ReturnType;
    };
  }
}

function createFileInput(onChange: (files: FileList) => void) {
  const el = document.createElement("input");
  el.setAttribute("type", "file");
  el.setAttribute("accept", "image/*");
  el.setAttribute("multiple", "true");
  el.setAttribute("style", "visibility:hidden");

  el.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;

    const files = input.files;
    if (!files) return;

    onChange(files);
  });

  return el;
}

function createPlaceholder(src: string) {
  const div = document.createElement("div");
  const img = document.createElement("img");
  img.style.opacity = "0.5";
  img.src = src;
  div.appendChild(img);
  return div;
}

interface PlacholderMeta {
  id: string;
  src: string;
  pos: number;
}

class PlaceholderPlugin extends Plugin<DecorationSet> {
  public add(tr: Transaction, meta: PlacholderMeta) {
    tr.setMeta(this, { add: [...this.getAddRequests(tr), meta] });
    return tr;
  }

  public remove(tr: Transaction, id: string) {
    tr.setMeta(this, { remove: [...this.getRemoveRequests(tr), id] });
    return tr;
  }

  public getAddRequests(tr: Transaction): PlacholderMeta[] {
    return tr.getMeta(this)?.add ?? [];
  }

  public getRemoveRequests(tr: Transaction): string[] {
    return tr.getMeta(this)?.remove ?? [];
  }
}

const placeholder = new PlaceholderPlugin({
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(tr, value) {
      value = value.map(tr.mapping, tr.doc);

      const addRequests = placeholder.getAddRequests(tr);
      if (addRequests) {
        addRequests.forEach((meta) => {
          const { id, src, pos } = meta;
          const decoration = Decoration.widget(pos, createPlaceholder(src), {
            id,
          });
          value = value.add(tr.doc, [decoration]);
        });
      }

      const removeRequests = placeholder.getRemoveRequests(tr);
      if (removeRequests) {
        removeRequests.forEach((id) => {
          value = value.remove(
            value.find(undefined, undefined, (spec) => spec.id === id)
          );
        });
      }

      return value;
    },
  },
  props: {
    decorations(state) {
      return this.getState(state);
    },
  },
});

// reference: [https://github.com/carlosvaldesweb/tiptap-extension-upload-image]
// reference: [https://github.com/coolswitch/tiptap-extension-image-upload]
export const ImageWithUpload = Image.extend<Options>({
  name: "imageWithUpload",

  addProseMirrorPlugins() {
    return [placeholder];
  },

  addCommands() {
    return {
      addImages: () => () => {
        const input = createFileInput((fileList) => {
          const files = Array.from(fileList).map((file) => ({
            id: uniqueId(),
            file,
          }));

          const view = this.editor.view;

          // add a placeholder for each file
          view.dispatch(
            files.reduce((tr, { id, file }) => {
              return placeholder.add(tr, {
                id,
                src: URL.createObjectURL(file),
                pos: tr.selection.to,
              });
            }, view.state.tr)
          );

          // upload each file and replace the placeholder with the image
          files.forEach(({ id, file }) => {
            this.options
              .upload(file)
              .then((src) => {
                view.dispatch(
                  placeholder.remove(view.state.tr, id).insert(
                    view.state.selection.to,
                    this.editor.schema.nodes[this.name].create({
                      src,
                      id,
                    })
                  )
                );
              })
              .catch(() => {
                view.dispatch(placeholder.remove(view.state.tr, id));
              });
          });
        });

        document.body.appendChild(input).click();

        return true;
      },
    };
  },
});
