import React, { useState, useEffect, useCallback } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { SettingDiv, SettingHr, SettingTitle } from "./components";
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
import getCroppedImg from "@/lib/cropImage";
import ResizeableModel from "@/components/ui/ResizeableModel";
import api from "@/lib/api";
import { Spinner } from "@/components/Spinner";

const Profile = () => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [_, setShowNicknameInEmail] =
    useState<boolean>(false);
  const [nameInEmail, setnameInEmail] = useState<boolean | null>(false);
  const {
    emails: userEmails,
    profile,
    updateSettings,
    allSetting,
  } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
   const [finalImg, setFinalImg] = useState("");
  const [fileType, setFileType] = useState<string | null>("");
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsImageLoading(true);
      setNickname(profile.nickname || "");
      setFullName(profile.full_name || "");
      setSelectedEmail(profile.default_email || "");
      setShowNicknameInEmail(profile.showNicknameInEmail || false);
      setCroppedImage(profile.croppedImage || null);
      console.log(allSetting.profile?.image);
      
      setFinalImg(allSetting.profile?.image || "");
      setIsImageLoading(false);
    }
  }, [profile]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedAreaPixels);
      console.log(croppedArea);

    },
    []
  );

  interface ProfileSettings extends Record<string, unknown> {
    nickname?: string;
    full_name?: string;
    default_email?: string;
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
    setFileType(file?.type as string);
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
      try {
        setIsImageLoading(true);
        const rowImg = await getCroppedImg(image, croppedArea);
        const blob = await fetch(rowImg as string).then((r) => r.blob());
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onloadend = async function () {
          const response = await api.post("/fo", reader.result, {
            headers: {
              "X-File-Name": fileType,
            },
          });
          const image = response.data.url;
          setFinalImg(image);
          await updateProfile({ image });
        };
        setImage("");
      } catch (error) {
        console.error("Error cropping image:", error);
      } finally {
        setIsImageLoading(false);
      }
    }
  };

  const handleDiscard = () => {
    setImage("");
  };

  const handleGravatar = async () => {
    try {
      setIsImageLoading(true);
      const gravatarUrl = `https://www.gravatar.com/avatar/${selectedEmail}`;
      setCroppedImage(gravatarUrl);
      setShowMenu(false);
      await updateProfile({ image: gravatarUrl });
    } catch (error) {
      console.error("Error updating profile with Gravatar image:", error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setIsImageLoading(true);
      setCroppedImage("");
      setShowMenu(false);
      await updateProfile({ image: "" });
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleSubmit = () => {
    const newemail = selectedEmail;
    updateProfile({
      nickname,
      full_name: fullName,
      default_email: newemail,
    });
  };

  // @ts-ignore
  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const passwordData = {
    currentPassword,
    confirmPassword,
  };

  const handleChengePassword = async () => {
    setIsDisabled(true);
    setIsLoading(true);

    try {
      const response = await api.post("/profile/reset-password", passwordData);
      console.log(response.data.error);
    } catch (error: unknown) {
      // setError(error.response.data.error);

      // setError("An error occurred while changing the password.");
    } finally {
      setIsDisabled(false);
      setIsLoading(false);
    }
  };

  const handleNameSwitch = () => {
    setnameInEmail(!nameInEmail);
    const value = nameInEmail;
    updateProfile({ nameInMail: value });
  };

  console.log(selectedEmail);

  return (
    <div>
      <SettingTitle>My Profile</SettingTitle>
      <SettingHr />

      <SettingDiv>
        <div className="flex items-center gap-6">
          <div className="flex w-14 justify-center">
            <Tooltip tip="Your Profile">
              {isImageLoading ? (
                <Spinner size={30} />
              ) : (
                <img
                  src={finalImg || ""}
                  alt="Profile"
                  className="w-14 h-14 rounded-full"
                />
              )}
            </Tooltip>
          </div>
          <div>
            <Input
              id="nickname"
              label="Nickname"
              type="text"
              onBlur={() => {
                updateProfile({
                  nickname,
                });
              }}
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
        <ResizeableModel
          modalKey="image-crop"
          key="image-crop"
          onClose={handleDiscard}
        >
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

      <SettingHr />

      <SettingDiv>
        <div className="flex justify-between items-center">
        <h2 className="text-sm mt-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
              Full name
            </h2>
          <Input
            id="fullname"
            type="text"
            className="w-72"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={() => {
              updateProfile({
                full_name: fullName,
              });
            }}
          />
        </div>

        <div className="flex items-center justify-between my-5">
        <h2 className="text-sm mt-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
              Default email
            </h2>
          <Select
            onValueChange={(value) => setSelectedEmail(value)}
            value={selectedEmail}
          >
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Select an email" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectGroup>
                {userEmails.map((e, i) => (
                  <SelectItem key={i} value={e} dontShowCheck>
                    {e}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <h2 className="text-sm mt-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
            Name in mail
          </h2>
          <div className="flex mt-1 items-center justify-between">
            <Label
              htmlFor="nikname-switch"
              className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] mt-1"
            >
              Show full name in email
            </Label>
            <Switch
              id="nikname-switch"
              checked={nameInEmail as boolean}
              onCheckedChange={handleNameSwitch}
            />
          </div>
      </SettingDiv>

      <SettingTitle>Password and Security</SettingTitle>

      <SettingHr />

      <SettingDiv>

        <div>
          <h2 className="text-sm mt-5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
            Change password
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] mt-1">
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
            modalKey="password"
          >
            <div className=" py-6 px-6">
              <div className=" ">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Change password</h3>
                </div>
                <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] mt-1">
                  Password must contain at least one uppercase letter, one
                  special character, one number, and be at least 6 characters
                  long
                </p>
              </div>
              <div className="mt-4">
                <Input
                  type="password"
                  error={error}
                  label="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isDisabled}
                />

                <div className="mt-1">
                  <Input
                    type="password"
                    label="Enter a new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
                <div className="mt-1">
                  <Input
                    type="password"
                    label="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
                <div className="mt-4 w-full flex justify-end">
                  <Button
                    className="w-40"
                    onClick={() => {
                      handleChengePassword();
                    }}
                    variant="primary"
                  >
                    {!isLoading ? `chenge password` : <Spinner />}
                  </Button>
                </div>
              </div>
            </div>
          </ResizeableModel>
        )}

        <h2 className="text-sm mt-5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
          2-Step Verification
        </h2>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
            Add an additional layer of security to your account during login
          </p>
          <Switch id="2fa-switch" />
        </div>

        <h2 className="text-sm mt-5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
          Login Session
        </h2>

        <div className="flex items-center justify-between">
          <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
            Log out of all other active sessions on other devices besides
            this one.
          </p>
          <Button variant={"destructive"}>Log Out</Button>
        </div>
      </SettingDiv>

      <div className="pb-4 sticky bottom-0 bg-background-secondary">
        <SettingHr className="!m-0" />

        <SettingDiv className="relative w-full !mb-0 pt-1">
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

      </div>

    </div>
  );
};

export default Profile;