import React, { useState, useEffect, useCallback } from "react";
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
import { X } from "@phosphor-icons/react";

const Profile = () => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [showNicknameInEmail, setShowNicknameInEmail] =
    useState<boolean>(false);
  const { emails: userEmails, profile, updateSettings } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  console.log(profile);
  
  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || "");
      setFullName(profile.full_name || "");
      setSelectedEmail(profile.email || "");
      setShowNicknameInEmail(profile.showNicknameInEmail || false);
      setCroppedImage(profile.croppedImage || null);
    }
  }, [profile]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedAreaPixels);
    },
    []
  );

  interface ProfileSettings extends Record<string, unknown> {
    nickname?: string;
    full_name?: string;
    email?: string;
    croppedImage?: string;
    showNicknameInEmail?: boolean;
  }

  const updateProfile = async (obj: ProfileSettings) => {
    setIsLoading(true);

    try {
      await updateSettings("profile", obj);
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

      // Update profile with cropped image
      // await updateProfile({ croppedImage });
    }
  };

  const handleDiscard = () => {
    setImage("");
  };

  const handleGravatar = () => {
    const gravatarUrl = "https://www.gravatar.com/avatar/YOUR_HASH";
    setCroppedImage(gravatarUrl);
    setShowMenu(false);

    updateProfile({ croppedImage: gravatarUrl });
  };

  const handleRemovePhoto = () => {
    setCroppedImage("");
    setShowMenu(false);

    updateProfile({ croppedImage: "" });
  };

  const handleSubmit = () => {
    // Call updateProfile with all fields
    updateProfile({
      nickname,
      full_name: fullName,
      email: selectedEmail,
      showNicknameInEmail,
    });
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
                  className="w-14 h-14 rounded-full"
                />
              </Tooltip>
            </div>
            <div>
              <Input
                id="nickname"
                label="Nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
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
                className="absolute mt-2 border bg-white rounded-md border-gray-300 shadow-lg dark:bg-black"
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
            <label htmlFor="fullname">Full name</label>
            <Input
              id="fullname"
              type="text"
              className="w-72"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <SettingDiv className="flex items-center justify-between mt-5">
            <label htmlFor="email-select">Default email</label>
            <Select
              onValueChange={(value) => setSelectedEmail(value)}
              value={selectedEmail}
            >
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

          <label htmlFor="nikname-switch">Name in mail</label>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="nikname-switch"
              className="font-normal text-slate-400"
            >
              Show Nickname in email
            </Label>
            <Switch id="nikname-switch" />
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
              <p className="text-xs text-slate-400">
                Add an additional layer of security to your account during login
              </p>
              <Button
                variant={"secondary"}
                onClick={() => setChangePassword(!changePassword)}
                className="w-fit"
              >
                Change password
              </Button>
            </div>
          </div>

          {changePassword && (
            <ResizeableModel
              size={{ width: "500px" }}
              onClose={() => setChangePassword(false)}
              key="password"
            >
              <div className="py-6 px-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Change password</h3>
                  <Button
                    variant={"toolbutton"}
                    className="h-8"
                    onClick={() => setChangePassword(false)}
                  >
                    <X size={18} />
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Password must contain at least one uppercase letter, one
                  special character, one number, and be at least 6 characters
                  long
                </p>
                <div className="mt-4">
                  <Input type="password" label="Enter your current password" />
                  <Input type="password" label="Enter a new password" />
                  <Input type="password" label="Confirm your new password" />
                  <div className="mt-4 w-full flex justify-end">
                    <Button className="w-fit" variant={"primary"}>
                      Change password
                    </Button>
                  </div>
                </div>
              </div>
            </ResizeableModel>
          )}

          <SettingDiv>
            <h2 className="text-sm mt-5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
              2-Step Verification
            </h2>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                Add an additional layer of security to your account during login
              </p>
              <Switch id="2fa-switch" />
            </div>

            <h2 className="text-sm mt-5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
              Login Session
            </h2>

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Log out of all other active sessions on other devices besides
                this one.
              </p>
              <Button variant={"destructive"}>Log Out</Button>
            </div>
          </SettingDiv>

          <SettingDiv className="relative w-full">
            <div className="w-full">
              <div className="flex gap-3 justify-end">
                <Button
                  className="w-fit"
                  onClick={handleSubmit}
                  loading={isLoading}
                  variant={"primary"}
                >
                  Save
                </Button>
                <Button className="w-fit" variant={"secondary"}>
                  Discard
                </Button>
              </div>
            </div>
          </SettingDiv>
        </SettingDiv>
      </SettingDiv>
    </div>
  );
};

export default Profile;
