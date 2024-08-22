import { useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { SettingDiv, SettingTitle } from "./components";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfileStore } from "@/store/profile";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [image, setImage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { emails: userEmails } = useProfileStore();

  const [Email] = useState(userEmails[0]);
  const [defaultEmail,] = useState("");

  console.log(Email);

  console.log(defaultEmail);

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
                      className="block text-sm px-4 py-2 hover:bg-secondary v w-full text-left"
                      onClick={() =>
                        document.getElementById("fileInput")?.click()
                      }
                    >
                      From Device
                    </button>
                  </li>
                  <li>
                    <button
                      className="block text-sm px-4 py-2 hover:bg-secondary rounded-md w-full text-left"
                      onClick={handleGravatar}
                    >
                      From Gravatar
                    </button>
                  </li>
                  {image && (
                    <li>
                      <button
                        className="block text-sm px-4 py-2 hover:bg-secondary w-full text-left"
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

        <SettingTitle>Name and Email</SettingTitle>
        <SettingDiv>
          <Input type="text" label="Full name" className="w-72" />

          <SettingDiv>
            <Select label="Defaul Email">
              <SelectTrigger className="w-72">
                <SelectValue placeholder="Select a email" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {userEmails.map((e, i) => {
                    return (
                      <SelectItem key={i} value={e} dontShowCheck>
                        {e}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </SettingDiv>

          <SettingDiv>
            <p className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white">
              Name in mail
            </p>
            <div className="mt-5 flex gap-3">
              <Switch id="nikname" />
              <Label htmlFor="nikname" className="font-normal">
                Show Nickname in email
              </Label>
            </div>
          </SettingDiv>
        </SettingDiv>

        <SettingTitle>Password and Security</SettingTitle>
        <SettingDiv>
          <Input type="password" className="w-72" label="Change Password" />
          <SettingDiv>
            <h2 className="text-sm mt-5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
              2-Step Verification
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <Switch id="nikname" />
              <p className="text-xs  text-slate-400">
                Add an additional layer of security to your account during login
              </p>
            </div>

            <h2 className="text-sm mt-5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
              Login Session
            </h2>

            <div className=" flex items-center justify-between">
              <p className="text-xs  text-slate-400">
                Log out of all other active sessions on other devices besides
                this one.
              </p>
              <Button variant={"destructive"}>Log Out</Button>
            </div>
          </SettingDiv>
        </SettingDiv>
      </SettingDiv>
    </div>
  );
};

export default Profile;
