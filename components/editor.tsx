"use client";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
import React from 'react';
import {
  BlockNoteEditor,
  PartialBlock,
  BlockIdentifier,
  defaultBlockSpecs,
  defaultBlockSchema,
  defaultProps
} from "@blocknote/core";
import {
  BlockNoteView,
  DragHandle,
  FormattingToolbarPositioner,
  HyperlinkToolbarPositioner,
  SideMenu,
  SideMenuButton,
  SideMenuPositioner,
  SideMenuProps,
  SlashMenuPositioner,
  useBlockNote,
  createReactBlockSpec,
  getDefaultReactSlashMenuItems,
  ReactSlashMenuItem,
} from "@blocknote/react";
import { BrainCircuit } from "lucide-react";
import "@blocknote/core/style.css";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};



const Editor = ({
  onChange,
  initialContent,
  editable
}: EditorProps) => {

const something = 'something...'
  
  const handleBlockInsertion = (editor: BlockNoteEditor, blockId: string) => {
    const blockToInsert: PartialBlock = {
      type: "fontParagraph",
      // content: 'inline',
      children: []
    };
    editor.insertBlocks([blockToInsert], blockId, "after");
  };
  
  // Call handleBlockInsertion from an event handler
  const handleClick = (props:any) => {
    const response = 'some data from the backend'
    handleBlockInsertion(editor, props.block.id);
  };
  

  const CustomSideMenu = (props: SideMenuProps) => (
    <SideMenu>
      <SideMenuButton>
        <BrainCircuit
          size={24}
          onClick={() => {
            handleClick(props)
          }}
        />
      </SideMenuButton>
      <DragHandle {...props} />
    </SideMenu>
  );

  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ 
      file
    });

    return response.url;
  }


  const FontParagraphBlock = createReactBlockSpec(
    {
      type: "fontParagraph",
      propSchema: {
        ...defaultProps,
        font: {
          default: "Comic Sans MS",
        },
      },
      content: "inline",
    },
    {
      render: ({ block, contentRef }) => {
        const style = {
          fontFamily: block.props.font,
          backgroundColor:'red',
          innerWidth:'100px',
          innerHeight:'100px'
        };
      
        return (
          <div  ref={contentRef} style={style} >
             {something}
          </div>
        );
      },
      toExternalHTML: ({ contentRef }) => <p ref={contentRef} />,
      parse: (element) => {
        const font = element.style.fontFamily;
        
        if (font === "") {
          return;
        }
        
        return {
          font: font || undefined,
        };
      },
    }
  );

  const blockSchema = {
    // Adds all default blocks.
    ...defaultBlockSchema,
    // Adds the font paragraph.
    fontParagraph: FontParagraphBlock.config,
  };

  const blockSpecs = {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the font paragraph.
    fontParagraph: FontParagraphBlock,
  };

    // Creates a slash menu item for inserting a font paragraph block.
    // const insertFontParagraph: ReactSlashMenuItem<typeof blockSchema> = {
    //   name: "Insert Font Paragraph",
    //   execute: (editor) => {
    //     const font = prompt("Enter font name");
  
    //     editor.insertBlocks(
    //       [
    //         {
    //           type: "fontParagraph",
    //           props: {
    //             font: font || undefined,
    //           },
    //         },
    //       ],
    //       editor.getTextCursorPosition().block,
    //       "after"
    //     );
    //   },
    //   aliases: ["p", "paragraph", "font"],
    //   group: "Other",
    //   icon: <BrainCircuit />,
    // };
  
  const editor: BlockNoteEditor = useBlockNote({

    
    editable,
    blockSpecs: blockSpecs,
    // slashMenuItems: [
    //   ...getDefaultReactSlashMenuItems(blockSchema),
    //   insertFontParagraph,
    // ],
    initialContent: 
      initialContent 
      ? JSON.parse(initialContent)
      : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload
  })

  
  return (
    <div>
     <BlockNoteView editor={editor} theme={resolvedTheme === "dark" ? "dark" : "light"}>
      <FormattingToolbarPositioner editor={editor} />
      <HyperlinkToolbarPositioner editor={editor} />
      <SlashMenuPositioner editor={editor} />
      <SideMenuPositioner editor={editor} sideMenu={CustomSideMenu} />
    </BlockNoteView>
    </div>
  )
}

export default Editor;
