import { useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { SettingDiv, SettingTitle } from "./components";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Profile = () => {
  const [image, setImage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setShowMenu(false); 
  };

  const handleGravatar = () => {
    const gravatarUrl = "https://www.gravatar.com/avatar/YOUR_HASH"; 
    setImage(gravatarUrl);
    setShowMenu(false);
  };

  const handleRemovePhoto = () => {
    setImage(null);
    setShowMenu(false);
  };

  return (
    <div>
      <SettingDiv>
        <SettingTitle>My Profile</SettingTitle>
        <SettingDiv>
          <div className="flex items-center gap-6">
            <div className="flex w-fit">
              <Tooltip tip="Your Profile">
                <img
                  src={image || ""}
                  alt="Profile"
                  className="w-14 h-14 object-cover object-top  rounded-full"
                />
              </Tooltip>
            </div>
            <div>
              <Input label="Nickname" type="text" />
            </div>
          </div>
          <div className="relative">
            <button
              className="text-sm mt-2 text-gray-400"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              Add Photo
            </button>

            {showMenu && (
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute mt-2 bg-white border rounded-md border-gray-300 shadow-lg dark:bg-black"
              >
                <ul>
                  <li>
                    <button
                      className="block px-4 py-2 hover:bg-secondary v w-full text-left"
                      onClick={() =>
                        document.getElementById("fileInput")?.click()
                      }
                    >
                      From Device
                    </button>
                  </li>
                  <li>
                    <button
                      className="block px-4 py-2 hover:bg-secondary rounded-md w-full text-left"
                      onClick={handleGravatar}
                    >
                      From Gravatar
                    </button>
                  </li>
                  {image && (
                    <li>
                      <button
                        className="block px-4 py-2 hover:bg-secondary w-full text-left"
                        onClick={handleRemovePhoto}
                      >
                        Remove Photo
                      </button>
                    </li>
                  )}
                </ul>
              </motion.div>
            )}

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </SettingDiv>
      </SettingDiv>
    </div>
  );
};

export default Profile;
