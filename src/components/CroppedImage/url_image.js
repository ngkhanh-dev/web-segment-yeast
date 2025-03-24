import React from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import { DataContext } from "../DataProvider";

const URLImage = ({ src, cropX, cropY, cropWidth, cropHeight, ...rest }) => {
    const [image] = useImage(src, "anonymous");
    return (
        <Image
            image={image}
            crop={{
                x: cropX,
                y: cropY,
                width: cropWidth,
                height: cropHeight,
            }}
            width={cropWidth}
            height={cropHeight}
            {...rest}
        />
    );
};

export default URLImage;
