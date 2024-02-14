"use client"
import { useState, useEffect } from "react";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";


import dynamic from "next/dynamic";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  },
);

export default function App() {
    const elements = convertToExcalidrawElements([
      {
        "type": "rectangle",
        "x": 100,
        "y": 100,
        "width": 200,
        "height": 100,
        "strokeColor": "#000000",
        "strokeWidth": 2
      },
      {
        "type": "text",
        "x": 120,
        "y": 130,
        "text": "Hello, Excalidraw!",
        "fontSize": 16,
      },
      {
        "type": "ellipse",
        "x": 300,
        "y": 300,
        "width": 150,
        "height": 150,
        "strokeColor": "#000000",
        "strokeWidth": 2
      },
      {
        "type": "text",
        "x": 330,
        "y": 330,
        "text": "Text inside ellipse",
        "fontSize": 16,
      }
    ]);

  const onChange = (event:any, appState:any) => {
    // The ref will never get initialized with the API
    // console.log(excalRef.current, "HEY");
    console.log('appState',appState);
    
    console.log('event',event);
    
  };

  return (
    <>
      <h1> Excalidraw with Next </h1>
      <div style={{ height: "500px", margin: "40px" , backgroundColor:"red"}}>
        <Excalidraw         
        initialData={{
          elements,
          appState: { zenModeEnabled: true, viewBackgroundColor: "#a5d8ff" },
          scrollToContent: true,
        }} 
        onChange={(e, appState) => onChange(e,appState)} />
      </div>
    </>
  );
}
