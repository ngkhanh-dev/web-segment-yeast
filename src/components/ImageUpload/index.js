import React, { useContext, useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { DataContext } from "../DataProvider";
import CroppedData from "../CroppedImage";
import "./reset.css";
import "./style.css";

// function downloadJSON(data, filename = "data.json") {
//     const jsonString = JSON.stringify(data, null, 4);
//     const blob = new Blob([jsonString], { type: "application/json" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();

//     URL.revokeObjectURL(url);
// }

function downloadImage(base64Data, filename) {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = filename;
    link.click();
}

function downloadCSV(data, filename = "data.csv") {
    const keys = Object.keys(data.json);
    const rows = [keys.join(",")];

    const values = keys.map((key) => JSON.stringify(data.json[key]));
    rows.push(values.join(","));

    const csvString = rows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

function ImageUploader() {
    // console.log("123");

    const inputRef = useRef(null);
    const { image, setImage } = useContext(DataContext);
    const [imageResult, setImageResult] = useState({});
    const [name, setName] = useState("");
    const [textInput, setTextInput] = useState("");
    const [selectedOption, setSelectedOption] = useState(
        "/upload_image/normal_image/"
    );

    const [coords, setCoords] = useState({});

    const handleTextInput = () => {
        const inputValue = inputRef.current.value;
        setTextInput(inputValue);
        // console.log(inputValue);
        // console.log("Dữ liệu đã gửi:", inputValue);
    };

    const fetchApi = async (file, id, type) => {
        const requestBody = {
            base64_image: file?.split(",")[1],
            image_id: id,
        };
        const response = await fetch(
            `https://nguyendangkhanh225343.id.vn${type}`,
            {
                method: "POST",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            }
        )
            .then((res) => res.json())
            .catch((error) => {
                console.error("Error:", error);
            });
        // console.log(response);
        setImageResult(response);
    };

    // const resetState = () => {
    //     setCroppedImage(null);
    //     // setCoords({ x: 0, y: 0, width: 100, height: 100 });
    //     if (canvasRef.current) {
    //         const ctx = canvasRef.current.getContext("2d");
    //         ctx.clearRect(
    //             0,
    //             0,
    //             canvasRef.current.width,
    //             canvasRef.current.height
    //         );
    //     }
    // };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        // resetState();
    };

    const handleCrop = () => {
        if (!imageResult) return alert("Vui lòng tải ảnh lên trước!");
        // console.log(imageResult);
        if (!imageResult["json"]) return alert("Không có dữ liệu để tìm kiếm.");
        if (!imageResult["json"]["bounding_boxes"])
            return alert("Không có bounding_boxes để tìm kiếm.");
        const foundItems = imageResult["json"]["bounding_boxes"].filter(
            (item) =>
                item["cell_id"] ==
                `${imageResult["json"]["image_id"]}_${textInput}`
        );
        console.log("Found Item", foundItems);

        if (foundItems.length === 0) {
            alert("Không tìm thấy ID trong bounding_boxes");
            return;
        } else {
            setCoords(foundItems);
        }
    };

    const handleImageChange = (event) => {
        if (!event || !event.target || !event.target.files) {
            console.error("Event không hợp lệ", event);
            return;
        }
        console.log("Hello");
        const file = event.target.files[0];
        console.log("File:", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setName(file.name.split(".")[0]);
                console.log("Ảnh đã đọc:", reader.result);
                // resetState();
            };

            reader.readAsDataURL(file);
        }
    };

    // const handleTextInput = (x) => {
    //     if (!image) return alert("Vui lòng tải ảnh lên trước!");
    //     if (!imageResult["json"]["bounding_boxes"]) {
    //         alert("Không có dữ liệu để tìm kiếm.");
    //         return;
    //     }
    //     const found = imageResult["json"]["bounding_boxes"].filter(
    //         (item) =>
    //             item["cell_id"] ==
    //             `${imageResult["json"]["image_id"]}_${textInput}`
    //     );
    //     if (found) {
    //         setTextInput(found);
    //     }
    //     alert(
    //         found
    //             ? "ID tồn tại trong contours_list"
    //             : "ID không tồn tại trong contours_list"
    //     );
    // };
    console.log("Coords", coords);

    return (
        <>
            <div className="container">
                <div className="upload-box">
                    <select
                        className="option-select"
                        value={selectedOption}
                        onChange={handleOptionChange}
                    >
                        <option value="/upload_image/normal_image/">
                            Buồng đếm
                        </option>
                        <option value="/upload_image/ethanol_image/">
                            Etilen sống chết
                        </option>
                        <option value="blur">Bất thường/ bình thường</option>
                        <option value="edge_detection">16 ô</option>
                    </select>
                    <h2 className="text-xl font-bold text-gray-700 mb-4">
                        Upload Ảnh
                    </h2>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="upload-input"
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" className="upload-label">
                        Chọn ảnh 📷
                    </label>

                    <div className="image-container">
                        {image && (
                            <div className="image-box">
                                <span className="image-label">Ảnh gốc</span>
                                <img
                                    src={image}
                                    alt="Uploaded"
                                    className="image-preview"
                                />
                            </div>
                        )}

                        {imageResult?.mask_img && (
                            <div className="image-box">
                                <span className="image-label">Ảnh Mask</span>
                                <img
                                    src={`data:image/jpeg;base64,${imageResult["mask_img"]}`}
                                    alt="Processed"
                                    className="image-preview"
                                />
                            </div>
                        )}

                        {imageResult?.bb_img && (
                            <div className="image-box">
                                <span className="image-label">
                                    Ảnh Bounding Box
                                </span>
                                <img
                                    src={`data:image/jpeg;base64,${imageResult["bb_img"]}`}
                                    alt="Bounding Box"
                                    className="image-preview"
                                />
                            </div>
                        )}
                    </div>

                    <Button
                        variant="primary"
                        style={{ zIndex: 999 }}
                        className="mt-4 submit-button"
                        onClick={async () => {
                            if (!image) {
                                alert("Vui lòng chọn ảnh trước khi gửi!");
                                return;
                            }
                            console.log("Đang gửi ảnh:", image);
                            alert("Đang gửi ảnh...");
                            await fetchApi(image, "20", selectedOption);
                            alert("Gửi ảnh thành công!");
                        }}
                        data={imageResult}
                    >
                        Nhấn vào đây 🚀
                    </Button>
                    <div
                        variant="primary"
                        className="mt-4 file-button"
                        onClick={(e) => {
                            if (
                                imageResult &&
                                imageResult.json &&
                                Object.keys(imageResult["json"]).length !== 0
                            ) {
                                downloadCSV(imageResult, `${name}.csv`);
                            } else {
                                alert("Dữ liệu chưa sẵn sàng hoặc bị lỗi!");
                            }
                        }}
                    >
                        Download Data
                    </div>
                    {imageResult?.mask_img && (
                        <Button
                            className="mt-4 file-button"
                            onClick={() =>
                                downloadImage(
                                    imageResult["mask_img"],
                                    `${imageResult["json"]["image_id"]}.png`
                                )
                            }
                        >
                            Download Mask Image
                        </Button>
                    )}

                    {imageResult?.bb_img && (
                        <Button
                            className="mt-4 file-button"
                            onClick={() =>
                                downloadImage(
                                    imageResult["bb_img"],
                                    `${imageResult["json"]["image_id"]}_bb.png`
                                )
                            }
                        >
                            Download Bounding Box Image
                        </Button>
                    )}
                </div>
                {/* Right side */}
                {selectedOption === "/upload_image/normal_image/" && (
                    <>
                        <div className="text-input-box">
                            <h2 className="text-xl font-bold text-gray-700 mb-4">
                                Nhập Dữ Liệu
                            </h2>
                            <input
                                type="text"
                                value={textInput}
                                ref={inputRef}
                                onChange={(e) =>
                                    handleTextInput(e.target.value)
                                }
                                className="text-input"
                            />
                            <Button
                                variant="success"
                                className="mt-4 submit-button"
                                onClick={handleCrop}
                            >
                                Gửi Dữ Liệu
                            </Button>
                        </div>
                        {textInput && (
                            <>
                                <CroppedData
                                    src={`data:image/jpeg;base64,${imageResult["bb_img"]}`}
                                    cropX={coords[0]["x"] + 5}
                                    cropY={coords[0]["y"] + 5}
                                    cropWidth={coords[0]["width"] + 35}
                                    cropHeight={coords[0]["height"] + 35}
                                    x={150}
                                    y={100}
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default ImageUploader;
