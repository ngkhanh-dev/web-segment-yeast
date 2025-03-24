import React from "react";
import { Stage, Layer, Image } from "react-konva";

import URLImage from "./url_image";

const CroppedData = ({ src, cropX, cropY, cropWidth, cropHeight, x, y }) => {
    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <URLImage
                    src={src}
                    cropX={cropX}
                    cropY={cropY}
                    cropWidth={cropWidth}
                    cropHeight={cropHeight}
                    x={x}
                    y={y}
                />
            </Layer>
        </Stage>
    );
};

export default CroppedData;
