"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Youtube from "@tiptap/extension-youtube";
import { useState, useActionState, startTransition } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaSuperscript,
  FaSubscript,
  FaLink,
  FaImage,
  FaVideo,
  FaTable,
  FaUndo,
  FaRedo,
  FaListUl,
  FaListOl,
  FaCode,
  FaQuoteLeft,
} from "react-icons/fa";
import { Button } from "@/components/button";
import { createBlog } from "@/actions/handleBlog";
import type { Blog } from "@prisma/client";

export type BlogWithAuthor = Blog & {
  author: {
    slug: string;
    name: string;
  };
};

export default function CreateBlog({ content = "", onChange }) {
  // const [linkUrl, setLinkUrl] = useState("");
  // const [showLinkInput, setShowLinkInput] = useState(false);
  // const [imageUrl, setImageUrl] = useState("");
  // const [showImageInput, setShowImageInput] = useState(false);
  // const [youtubeUrl, setYoutubeUrl] = useState("");
  // const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [title, setTitle] = useState("");
  const [state, formAction, isPending] = useActionState(createBlog, null);
  const [category, setCategory] = useState("");
  const [blogCover, setBlogCover] = useState<File | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto",
        },
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Superscript,
      Subscript,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      CharacterCount,
      Placeholder.configure({
        placeholder: "Write something...",
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Youtube.configure({
        controls: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    immediatelyRender: false,
  });

  // const addLink = () => {
  //   if (linkUrl) {
  //     editor?.chain().focus().setLink({ href: linkUrl }).run();
  //     setLinkUrl("");
  //     setShowLinkInput(false);
  //   }
  // };

  // const addImage = () => {
  //   if (imageUrl) {
  //     editor?.chain().focus().setImage({ src: imageUrl }).run();
  //     setImageUrl("");
  //     setShowImageInput(false);
  //   }
  // };

  // const addYoutubeVideo = () => {
  //   if (youtubeUrl) {
  //     editor?.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
  //     setYoutubeUrl("");
  //     setShowYoutubeInput(false);
  //   }
  // };

  // const handleImageUpload = useCallback(
  //   (event) => {
  //     if (event.target.files?.length) {
  //       const file = event.target.files[0];
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         if (typeof reader.result === "string") {
  //           editor?.chain().focus().setImage({ src: reader.result }).run();
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   },
  //   [editor]
  // );

  // const insertTable = () => {
  //   editor
  //     ?.chain()
  //     .focus()
  //     .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
  //     .run();
  // };

  const MenuButton = ({ onClick, isActive = null, children }) => (
    <button
      onClick={onClick}
      className={`px-2 py-1 mr-2 mb-2 rounded hover:bg-gray-100 ${
        isActive ? "bg-gray-200" : ""
      }`}
    >
      {children}
    </button>
  );

  return (
    <form action={formAction}>
      <h1 className="text-lg">Title</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        placeholder="Blog Title"
        className="py-1.5 px-3 rounded-lg mb-4 bg-transparent border w-full"
        required
      />
      <h1 className="text-lg">Blog Cover</h1>
      <input
        type="file"
        accept="image/*"
        name="blogcover"
        className="mb-4"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setBlogCover(file);
          }
        }}
      />
      <div className="w-full border rounded-lg">
        <div className="p-2 border-b flex flex-wrap">
          <div className="w-full flex flex-wrap mb-2 pb-2 border-b">
            <MenuButton
              onClick={() => editor?.chain().focus().toggleBold().run()}
              isActive={editor?.isActive("bold")}
            >
              <FaBold />
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              isActive={editor?.isActive("italic")}
            >
              <FaItalic />
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              isActive={editor?.isActive("underline")}
            >
              <FaUnderline />
            </MenuButton>
            {/* <MenuButton
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              isActive={editor?.isActive("strike")}
            >
              <FaStrikethrough />
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().toggleSuperscript().run()}
              isActive={editor?.isActive("superscript")}
            >
              <FaSuperscript />
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().toggleSubscript().run()}
              isActive={editor?.isActive("subscript")}
            >
              <FaSubscript />
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().toggleHighlight().run()}
              isActive={editor?.isActive("highlight")}
            >
              <span className="text-yellow-400">H</span>
            </MenuButton>

            <select
              onChange={(e) =>
                editor?.chain().focus().setColor(e.target.value).run()
              }
              className="px-2 py-1 mr-2 mb-2 rounded border"
            >
              <option value="">Text Color</option>
              <option value="#FF0000">Red</option>
              <option value="#00FF00">Green</option>
              <option value="#0000FF">Blue</option>
            </select> */}
          </div>

          {/* <div className="w-full flex flex-wrap mb-2 pb-2 border-b">
            <MenuButton
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              isActive={editor?.isActive("heading", { level: 1 })}
            >
              H1
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor?.isActive("heading", { level: 2 })}
            >
              H2
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isActive={editor?.isActive("heading", { level: 3 })}
            >
              H3
            </MenuButton>

            <MenuButton
              onClick={() => editor?.chain().focus().setTextAlign("left").run()}
              isActive={editor?.isActive({ textAlign: "left" })}
            >
              Left
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor?.chain().focus().setTextAlign("center").run()
              }
              isActive={editor?.isActive({ textAlign: "center" })}
            >
              Center
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor?.chain().focus().setTextAlign("right").run()
              }
              isActive={editor?.isActive({ textAlign: "right" })}
            >
              Right
            </MenuButton>
          </div> */}

          {/* <div className="w-full flex flex-wrap mb-2 pb-2 border-b">
            <MenuButton
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              isActive={editor?.isActive("bulletList")}
            >
              <FaListUl />
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              isActive={editor?.isActive("orderedList")}
            >
              <FaListOl />
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              isActive={editor?.isActive("blockquote")}
            >
              <FaQuoteLeft />
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              isActive={editor?.isActive("codeBlock")}
            >
              <FaCode />
            </MenuButton>
          </div> */}

          {/* <div className="w-full flex flex-wrap mb-2 pb-2 border-b">
            <MenuButton onClick={insertTable}>
              <FaTable />
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().addColumnBefore().run()}
            >
              Add Column
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().addRowBefore().run()}
            >
              Add Row
            </MenuButton>
          </div> */}

          {/* <div className="w-full flex flex-wrap mb-2 pb-2 border-b">
            <MenuButton onClick={() => setShowImageInput(!showImageInput)}>
              <FaImage />
            </MenuButton>
          </div> */}

          <div className="w-full flex flex-wrap">
            <MenuButton onClick={() => editor?.chain().focus().undo().run()}>
              <FaUndo />
            </MenuButton>
            <MenuButton onClick={() => editor?.chain().focus().redo().run()}>
              <FaRedo />
            </MenuButton>
          </div>
        </div>

        {/* {showImageInput && (
          <div className="p-2 border-b flex">
            <input
              type="url"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-2 py-1 border rounded mr-2"
            />
            <button
              onClick={addImage}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Image
            </button>
          </div>
        )} */}

        <EditorContent editor={editor} className="p-4 min-h-[200px]" />
      </div>
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
        className="py-1.5 px-3 rounded-lg border bg-transparent mt-4"
        required
      >
        <option value="" disabled>
          Select a category
        </option>
        <option value="Agriculture">Agriculture</option>
        <option value="Collectibles">Collectibles</option>
        <option value="Education">Education</option>
        <option value="Food">Food</option>
        <option value="Technology">Technology</option>
      </select>
      <div className="flex justify-center mt-4 text-xl">
        <Button
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              formAction({
                title,
                blogCover,
                content: editor.getHTML(),
                category,
              });
            });
          }}
        >
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}
