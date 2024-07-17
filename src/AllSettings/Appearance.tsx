import { useState } from "react";

const Appearance = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [Themeselected, setThemeSelected] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleDivClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClick = (index: number) => {
    setThemeSelected(index);
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  return (
    <div className="w-full h-full mt-6">
      <div>
        <h2 className="text-lg">Thame</h2>
        <p className="text-sm mt-1">
          Customize the look and feel of Rellite applications.
        </p>
        <div className="mt-3 flex gap-2">
          <div
            className={`w-10 h-10 rounded-full bg-black ${
              Themeselected === 0 && "ring-2 ring-offset-1 ring-core"
            }`}
            onClick={() => handleClick(0)}
          ></div>
          <div
            className={`w-10 h-10 rounded-full border-[1px] border-gray-400 bg-white ${
              Themeselected === 1 && "ring-2 ring-offset-1 ring-core"
            }`}
            onClick={() => handleClick(1)}
          ></div>
          <div
            className={`w-10 h-10 rounded-full border-[1px] border-gray-400 ${
              Themeselected === 2 && "ring-2 ring-offset-1 ring-core"
            }`}
            style={{
              background: "linear-gradient(to left, black 50%, white 50%)",
            }}
            onClick={() => handleClick(2)}
          ></div>
        </div>

        <div className="cursor-pointer mt-10 ">
          <p className="text-lg">Colors</p>
          <div className="flex gap-3 mt-2">
            <div className="flex space-x-2">
              {[
                "bg-red-600",
                "bg-green-600",
                "bg-blue-600",
                "bg-black",
                "bg-yellow-600",
              ].map((color, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full ${color} ${
                    selectedIndex === index
                      ? "ring-2 ring-offset-1 ring-core"
                      : ""
                  }`}
                  onClick={() => handleDivClick(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg">Layout</h2>
          <div className="flex mt-2 gap-4">
            <div>
              <img
                src="./download (1).jpg"
                className={`h-24 w-36 object-cover rounded-md ${
                  selectedImage === 1 ? "ring-2 ring-core" : ""
                }`}
                onClick={() => handleImageClick(1)}
                alt="Image 1"
              />
              <p className="text-center mt-2">Row</p>
            </div>
            <div>
              <img
                src="./download.jpg"
                className={`h-24 w-36 object-cover rounded-md ${
                  selectedImage === 2 ? "ring-2 ring-core" : ""
                }`}
                onClick={() => handleImageClick(2)}
                alt="Image 2"
              />
              <p className="text-center mt-2">column</p>
            </div>

            <div>
              <img
                src="./download.jpg"
                className={`h-24 w-36 object-cover rounded-md ${
                  selectedImage === 3 ? "ring-2 ring-core" : ""
                }`}
                onClick={() => handleImageClick(3)}
                alt="Image 2"
              />
              <p className="text-center mt-2">Open in new tab</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appearance;
