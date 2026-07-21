import React, { useRef, useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
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
   FaMagic,
   FaSpinner,
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
   <div className="w-px h-6 accent-bg-dark mx-1" />
);

const AI_BASE_URL =
   process.env.REACT_APP_MODE === "development"
      ? "http://localhost:4000/api/v1"
      : "/api/v1";

const AI_ACTIONS = [
   { label: "Help me write", prompt: "Continue writing from where the text left off. Match the tone and style." },
   { label: "Improve writing", prompt: "Improve the writing quality of this text. Fix awkward phrasing, improve flow, and make it more engaging. Keep the original meaning." },
   { label: "Fix grammar", prompt: "Fix all grammar, spelling, and punctuation errors in this text. Only fix errors, don't change the content or style." },
   { label: "Make shorter", prompt: "Make this text more concise. Cut unnecessary words while keeping the key points and meaning." },
   { label: "Make longer", prompt: "Expand this text with more detail, examples, or explanation. Keep the same tone and topic." },
   { label: "Simplify", prompt: "Rewrite this in simpler language that anyone can understand. Avoid jargon and complex sentences." },
];

const AIAssistant = ({ editor, onLoadingChange }) => {
   const [showMenu, setShowMenu] = useState(false);
   const [customPrompt, setCustomPrompt] = useState("");
   const [isGenerating, setIsGenerating] = useState(false);
   const [selectedText, setSelectedText] = useState("");
   const menuRef = useRef(null);
   const [dropdownStyle, setDropdownStyle] = useState({});

   useEffect(() => {
      if (!showMenu || !menuRef.current) return;
      const rect = menuRef.current.getBoundingClientRect();
      const style = { position: "fixed" };
      if (rect.right + 288 > window.innerWidth) {
         style.right = window.innerWidth - rect.left + 4;
         style.left = "auto";
      } else {
         style.left = rect.left;
         style.right = "auto";
      }
      if (rect.bottom + 400 > window.innerHeight) {
         style.bottom = window.innerHeight - rect.top + 4;
         style.top = "auto";
      } else {
         style.top = rect.bottom + 4;
         style.bottom = "auto";
      }
      setDropdownStyle(style);
   }, [showMenu]);

   const getSelectedText = useCallback(() => {
      if (!editor) return "";
      const { from, to } = editor.state.selection;
      if (from === to) return editor.getText();
      return editor.state.doc.textBetween(from, to);
   }, [editor]);

   const handleAction = async (prompt) => {
      if (!editor || isGenerating) return;

      const text = getSelectedText();
      if (!text.trim()) return;

      setSelectedText(text);
      setIsGenerating(true);
      onLoadingChange?.(true);
      setShowMenu(false);

      try {
         const isReplacement = editor.state.selection.from !== editor.state.selection.to;

         const response = await fetch(`${AI_BASE_URL}/ai/write`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ text, prompt, mode: isReplacement ? "replace" : "continue" }),
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.message || "AI request failed");
         }

         const result = data.data.result;

         if (isReplacement) {
            const { from, to } = editor.state.selection;
            editor.chain().focus().deleteRange({ from, to }).insertContent(result).run();
         } else {
            editor.chain().focus().insertContent("<br>" + result).run();
         }
      } catch (err) {
         console.error("AI assistant error:", err);
         alert(err.message || "AI assistant failed. Check your Groq API key in .env");
      } finally {
         setIsGenerating(false);
         onLoadingChange?.(false);
      }
   };

   const handleCustomSubmit = (e) => {
      e.preventDefault();
      if (customPrompt.trim()) {
         handleAction(customPrompt);
         setCustomPrompt("");
      }
   };

   return (
      <div className="relative" ref={menuRef}>
         <ToolBtn
            onClick={() => setShowMenu(!showMenu)}
            isActive={showMenu}
            title="AI Writing Assistant"
         >
            {isGenerating ? <FaSpinner className="animate-spin" /> : <FaMagic />}
         </ToolBtn>

         {showMenu && (
            <>
               <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
               <div className="absolute z-50 w-72 accent-bg-mode accent-border border rounded-lg shadow-lg overflow-hidden" style={dropdownStyle}>
                  <div className="p-2 border-b accent-border">
                     <p className="text-xs font-semibold accent-text mb-1">AI Writing Assistant</p>
                     <p className="text-xs text-gray-400">Select text first, or leave empty to continue writing</p>
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                     {AI_ACTIONS.map((action) => (
                        <button
                           key={action.label}
                           type="button"
                           onClick={() => handleAction(action.prompt)}
                           className="w-full text-left px-3 py-2 text-sm hover:accent-bg-light transition-colors flex items-center gap-2"
                        >
                           <FaMagic className="text-xs accent-text" />
                           {action.label}
                        </button>
                     ))}
                  </div>

                  <form onSubmit={handleCustomSubmit} className="border-t accent-border p-2">
                     <div className="flex gap-1">
                        <input
                           type="text"
                           value={customPrompt}
                           onChange={(e) => setCustomPrompt(e.target.value)}
                           placeholder="Custom instruction..."
                           className="flex-1 text-sm px-2 py-1.5 rounded border accent-border bg-transparent accent-text-mode focus:outline-none focus:ring-1 accent-ring"
                           disabled={isGenerating}
                        />
                        <button
                           type="submit"
                           disabled={!customPrompt.trim() || isGenerating}
                           className="px-2 py-1.5 rounded accent-bg text-white text-sm disabled:opacity-50"
                        >
                           Go
                        </button>
                     </div>
                  </form>
               </div>
            </>
         )}
      </div>
   );
};

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
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b accent-border accent-bg-light rounded-t-lg">
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

         <Separator />

         <AIAssistant editor={editor} />
      </div>
   );
};

const RichTextEditor = ({ content, onChange, placeholder }) => {
   const editor = useEditor({
      immediatelyRender: false,
      extensions: [
         StarterKit.configure({
            heading: { levels: [1, 2, 3] },
         }),
         Underline,
         Link.configure({
            openOnClick: false,
            HTMLAttributes: { class: "editor-link" },
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
