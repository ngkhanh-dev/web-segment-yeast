import ImageUploader from "./components/ImageUpload";
import { DataProvider } from "./components/DataProvider";
import "./App.css";

function App() {
    return (
        <DataProvider>
            {/* <div className="app"> */}
            <ImageUploader />
            {/* </div> */}
        </DataProvider>
    );
}

export default App;
