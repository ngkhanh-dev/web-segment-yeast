import ImageUploader from "./components/ImageUpload";
import { DataProvider } from "./components/DataProvider";
import "./App.css";
import { Stage, Layer, Image, Rect, Circle, Text } from "react-konva";
import { useImage } from "use-image";
import { useState, useRef, useEffect } from "react";
// import { useImage } from "react-konva-utils";

function App() {
    return (
        <DataProvider>
            <div className="app">
                <ImageUploader />
            </div>
        </DataProvider>
    );
    // const URLImage = (src) => {
    //     const image = useImage("https://konvajs.org/assets/yoda.jpg");
    //     return <Image image={image} />;
    // };

    // return (
    //     <>
    //         <Stage width={window.innerWidth} height={window.innerHeight}>
    //             <Text text="Try to drag shapes" fontSize={15} />
    //             <Layer>
    //                 <URLImage
    //                     src="https://konvajs.org/assets/yoda.jpg"
    //                     // x={150}
    //                 />
    //                 {/* Vẽ khung cắt để dễ hình dung */}
    //                 <Rect
    //                     x={150}
    //                     y={150}
    //                     width={150}
    //                     height={150}
    //                     stroke="red"
    //                     strokeWidth={2}
    //                 />
    //                 <Rect
    //                     x={20}
    //                     y={50}
    //                     width={100}
    //                     height={100}
    //                     fill="red"
    //                     shadowBlur={10}
    //                     draggable
    //                 />
    //                 <Circle
    //                     x={200}
    //                     y={100}
    //                     radius={50}
    //                     fill="green"
    //                     draggable
    //                 />
    //             </Layer>
    //         </Stage>
    // </>
    // );
}

export default App;
