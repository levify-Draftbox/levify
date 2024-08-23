import React, { useState, useCallback } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { SettingDiv, SettingTitle } from "./components";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Cropper, { Area } from "react-easy-crop";
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
import getCroppedImg from "@/lib/cropImage"; // You'll need to implement this utility
import ResizeableModel from "@/components/ui/ResizeableModel";

const Profile = () => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { emails: userEmails } = useProfileStore();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedAreaPixels);
      console.log(croppedArea);
    },
    []
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setShowMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropImage = async () => {
    if (image && croppedArea) {
      const croppedImage = await getCroppedImg(image, croppedArea);
      setCroppedImage(croppedImage);
      setImage("");
    }
  };

  const handleDiscard = () => {
    setImage("");
  };

  const handleGravatar = () => {
    const gravatarUrl = "https://www.gravatar.com/avatar/YOUR_HASH";
    setCroppedImage(gravatarUrl);
    setShowMenu(false);
  };

  const handleRemovePhoto = () => {
    setCroppedImage("");
    setShowMenu(false);
  };

  return (
    <div>
      <SettingDiv>
        <SettingTitle>My Profile</SettingTitle>
        <div className="border"></div>

        <SettingDiv>
          <div className="flex items-center gap-6">
            <div className="flex w-fit">
              <Tooltip tip="Your Profile">
                <img
                  src={croppedImage || ""}
                  alt="Profile"
                  className="w-14 h-14  rounded-full"
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
                      className="block text-sm px-4 py-2 hover:bg-secondary w-full text-left"
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
                  {croppedImage && (
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

        {image && (
          <ResizeableModel key="qwdiuq" onClose={handleDiscard}>
            <div className="relative h-[600px] w-[900px]">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end gap-4 px-3">
              <Button
                className="w-fit"
                variant={"primary"}
                onClick={handleCropImage}
              >
                Save
              </Button>
              <Button
                className="w-fit"
                variant="secondary"
                onClick={handleDiscard}
              >
                Discard
              </Button>
            </div>
          </ResizeableModel>
        )}

        <SettingTitle>Name and Email</SettingTitle>
        <div className="border"></div>
        <SettingDiv>
          <div className="flex justify-between items-center">
            <label htmlFor="ravi">Full name</label>
            <Input id="ravi" type="text" className="w-72" />
          </div>

          <SettingDiv className="flex items-center justify-between mt-5">
            <label htmlFor="">Default email</label>
            <Select>
              <SelectTrigger className="w-72">
                <SelectValue placeholder="Select an email" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {userEmails.map((e, i) => (
                    <SelectItem key={i} value={e} dontShowCheck>
                      {e}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </SettingDiv>

          <label htmlFor="nikname">Name in mail</label>
          <div className=" flex items-center justify-between">
            <Label htmlFor="nikname" className="font-normal text-slate-400">
              Show Nickname in email
            </Label>
            <Switch id="nikname" />
          </div>
        </SettingDiv>

        <SettingTitle>Password and Security</SettingTitle>
        <div className="border"></div>

        <SettingDiv>
          <div>
            <h2 className="text-sm mt-5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
              Change password
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-xs  text-slate-400">
                Add an additional layer of security to your account during login
              </p>
              <Button variant={"secondary"} className="w-fit">
                Change password
              </Button>
            </div>
          </div>
          <SettingDiv>
            <h2 className="text-sm mt-5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
              2-Step Verification
            </h2>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs  text-slate-400">
                Add an additional layer of security to your account during login
              </p>
              <Switch id="nikname" />
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
