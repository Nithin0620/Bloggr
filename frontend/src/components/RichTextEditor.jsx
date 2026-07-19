import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import {
   FaBold,
   FaItalic,
   FaUnderline,
   FaStrikethrough,
   FaCode,
   FaQuoteLeft,
   FaListOl,
   FaListUl,
   FaAlignLeft,
   FaAlignCenter,
   FaAlignRight,
   FaImage,
   FaLink,
   FaUndo,
   FaRedo,
} from "react-icons/fa";
import { BsTypeH1, BsTypeH2, BsTypeH3, BsCodeSquare } from "react-icons/bs";

const ToolBtn = ({ onClick, isActive, children, title }) => (
   <button
      type="button"
      onMouseDown={(e) => {
         e.preventDefault();
         onClick();
      }}
      title={title}
      className={`p-1.5 rounded transition-colors duration-200 ${
         isActive
            ? "accent-bg text-white"
            : "accent-text-mode hover:accent-bg-light"
      }`}
   >
      {children}
   </button>
);

const Separator = () => (
   <div className="w-px h-6 bg-gray-300 mx-1" />
);

const MenuBar = ({ editor }) => {
   const fileInputRef = useRef(null);

   if (!editor) return null;

   const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = () => {
         editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
      e.target.value = "";
   };

   const setLink = () => {
      const previousUrl = editor.getAttributes("link").href;
      const url = window.prompt("Enter URL:", previousUrl);
      if (url === null) return;
      if (url === "") {
         editor.chain().focus().extendMarkRange("link").unsetLink().run();
         return;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
   };

   return (
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b accent-border bg-gray-50 rounded-t-lg">
         <ToolBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
         >
            <BsTypeH1 />
         </ToolBtn>
         <ToolBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
         >
            <BsTypeH2 />
         </ToolBtn>
         <ToolBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
         >
            <BsTypeH3 />
         </ToolBtn>

         <Separator />

         <ToolBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold"
         >
            <FaBold />
         </ToolBtn>
         <ToolBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic"
         >
            <FaItalic />
         </ToolBtn>
         <ToolBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline"
         >
            <FaUnderline />
         </ToolBtn>
         <ToolBtn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Strikethrough"
         >
            <FaStrikethrough />
         </ToolBtn>

         <Separator />

         <ToolBtn
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            title="Inline Code"
         >
            <FaCode />
         </ToolBtn>
         <ToolBtn
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            title="Code Block"
         >
            <BsCodeSquare />
         </ToolBtn>
         <ToolBtn
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Blockquote"
         >
            <FaQuoteLeft />
         </ToolBtn>

         <Separator />

         <ToolBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Ordered List"
         >
            <FaListOl />
         </ToolBtn>
         <ToolBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
         >
            <FaListUl />
         </ToolBtn>

         <Separator />

         <ToolBtn
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Align Left"
         >
            <FaAlignLeft />
         </ToolBtn>
         <ToolBtn
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Align Center"
         >
            <FaAlignCenter />
         </ToolBtn>
         <ToolBtn
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Align Right"
         >
            <FaAlignRight />
         </ToolBtn>

         <Separator />

         <ToolBtn onClick={setLink} isActive={editor.isActive("link")} title="Add Link">
            <FaLink />
         </ToolBtn>
         <ToolBtn onClick={() => fileInputRef.current?.click()} title="Add Image">
            <FaImage />
         </ToolBtn>
         <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
         />

         <Separator />

         <ToolBtn
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
         >
            <FaUndo />
         </ToolBtn>
         <ToolBtn
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
         >
            <FaRedo />
         </ToolBtn>
      </div>
   );
};

const RichTextEditor = ({ content, onChange, placeholder }) => {
   const editor = useEditor({
      immediatelyRender: false,
      extensions: [
         StarterKit.configure({
            heading: { levels: [1, 2, 3] },
            link: {
               openOnClick: false,
               HTMLAttributes: { class: "editor-link" },
            },
         }),
         Placeholder.configure({
            placeholder: placeholder || "Write your content here...",
         }),
         Image.configure({
            inline: false,
            allowBase64: true,
         }),
         TextAlign.configure({
            types: ["heading", "paragraph"],
         }),
      ],
      content: content || "",
      editorProps: {
         attributes: {
            class: "tiptap-editor-content",
         },
      },
      onUpdate: ({ editor }) => {
         onChange?.(editor.getHTML());
      },
   });

   return (
      <div className="border accent-border rounded-lg overflow-hidden tiptap-editor">
         <MenuBar editor={editor} />
         <EditorContent editor={editor} />
      </div>
   );
};

export default RichTextEditor;
