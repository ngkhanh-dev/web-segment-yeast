import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { DataContext } from "../DataProvider";
import "./reset.css";
import "./style.css";

function downloadJSON(data, filename = "data.json") {
    const jsonString = JSON.stringify(data, null, 4);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
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
    console.log("123");

    const { image, setImage } = useContext(DataContext);
    const [imageResult, setImageResult] = useState({});
    const [name, setName] = useState("");
    const [selectedOption, setSelectedOption] = useState(
        "/upload_image/normal_image/"
    );

    const fetchApi = async (file, id, type) => {
        const requestBody = {
            base64_image: file?.split(",")[1],
            image_id: id,
        };
        const response = await fetch(`${process.env.LINK}${type}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })
            .then((res) => res.json())
            .catch((error) => {
                console.error("Error:", error);
            });
        console.log(response);
        setImageResult(response);
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
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className="container">
                <div className="upload-box">
                    <select
                        className="option-select"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
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
                                />{" "}
                            </div>
                        )}

                        {imageResult?.json && (
                            <div className="image-box">
                                <span className="image-label">Ảnh kết quả</span>
                                <img
                                    src={`data:image/jpeg;base64,${imageResult["mask_img"]}`}
                                    alt="Processed"
                                    className="image-preview"
                                />
                            </div>
                        )}
                    </div>

                    <Button
                        variant="primary"
                        className="mt-4 submit-button"
                        onClick={() => {
                            if (!image) {
                                alert("Vui lòng chọn ảnh trước khi gửi!");
                                return;
                            }
                            console.log("Đang gửi ảnh:", image);
                            fetchApi(image, "20", selectedOption);
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
                </div>
            </div>
        </>
    );
}

export default ImageUploader;
