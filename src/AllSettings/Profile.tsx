import React, { useState, useEffect, useCallback } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { SettingDiv, SettingHr, SettingTitle } from "./components";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";

const Profile = () => {
  const [image, setImage] = useState<string | null>(null);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [_, setShowNicknameInEmail] = useState<boolean>(false);
  const [nameInEmail, setnameInEmail] = useState<boolean | undefined>(false);
  const {
    emails: userEmails,
    profile,
    updateProfile: updateUserProfile,
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
  const [dummyImg, setdummyImg] = useState("");
  const [, setImageChanged] = useState(false);
  const [showSaveDiscard, setshowSaveDiscard] = useState(false);
  const [initialValues, setInitialValues] = useState<InitialValues>({
    nickname: "",
    fullName: "",
    selectedEmail: "",
    nameInEmail: false,
    image: "",
  });

console.log("initialwebihf",allSetting.profile?.image);


  useEffect(() => {
    if (profile) {
      setIsImageLoading(true);
      const newNickname = profile.nickname || "";
      const newFullName = profile.full_name || "";
      const newSelectedEmail = profile.default_email || "";
      const newNameInEmail = profile.showNicknameInEmail || false;
      const newImage = allSetting.profile?.image || "";

      setNickname(newNickname);
      setFullName(newFullName);
      setSelectedEmail(newSelectedEmail);
      setShowNicknameInEmail(newNameInEmail);
      setnameInEmail(newNameInEmail);
      setFinalImg(newImage);
      setIsImageLoading(false);

      setInitialValues({
        nickname: newNickname,
        fullName: newFullName,
        selectedEmail: newSelectedEmail,
        nameInEmail: newNameInEmail,
        image: newImage,
      });
    }
  }, [allSetting, profile]);

  useEffect(() => {
    const hasChanges =
      nickname !== initialValues.nickname ||
      fullName !== initialValues.fullName ||
      selectedEmail !== initialValues.selectedEmail ||
      nameInEmail !== initialValues.nameInEmail ||
      finalImg !== initialValues.image;

    setshowSaveDiscard(hasChanges);
  }, [nickname, fullName, selectedEmail, nameInEmail, finalImg, initialValues]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedAreaPixels);
      console.log(croppedArea);
    },
    []
  );

  interface InitialValues {
    nickname: string;
    fullName: string;
    selectedEmail: string;
    nameInEmail: boolean;
    image: string;
  }

  interface ProfileSettings {
    nickname: string;
    full_name: string;
    default_email: string;
    showNicknameInEmail: boolean;
    image: string;
    nameInMail: boolean | null;
  }

  const updateProfile = async (obj: Partial<ProfileSettings>) => {
    setIsLoading(true);
 
    try {
      await updateUserProfile("profile", obj);
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
        setImageChanged(true);
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
      setFinalImg(gravatarUrl);
      await updateProfile({ image: gravatarUrl });
      setImageChanged(true);
    } catch (error) {
      console.error("Error updating profile with Gravatar image:", error);
    } finally {
      setIsImageLoading(false);
    }
  };
  const handleRemovePhoto = async () => {
    try {
      setIsImageLoading(true);
      setFinalImg("");
      await updateProfile({ image: "" });
      setImageChanged(true);
    } catch (error) {
      console.error("Error removing profile photo:", error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const newemail = selectedEmail;

      const updateData: Partial<ProfileSettings> = {
        nickname,
        full_name: fullName,
        default_email: newemail,
        nameInMail: nameInEmail,
        image: finalImg,
      };

      await updateProfile(updateData);

      setInitialValues({
        nickname,
        fullName,
        selectedEmail: newemail,
        nameInEmail: nameInEmail as boolean,
        image: finalImg,
      });
      setImageChanged(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllDiscard = () => {
    setNickname(initialValues.nickname);
    setFullName(initialValues.fullName);
    setSelectedEmail(initialValues.selectedEmail);
    setnameInEmail(initialValues.nameInEmail);
    setFinalImg(initialValues.image);
    setImageChanged(false);
  };

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

  useEffect(() => {
    if (nickname) {
      const data = nickname.charAt(0).toUpperCase();
      setdummyImg(data);
    } else {
      setdummyImg("");
    }
  }, [nickname]);

  return (
    <div>
      <SettingTitle>My Profile</SettingTitle>
      <SettingHr />

      <SettingDiv>
        <div className="flex items-center gap-5">
          <div className="flex flex-col gap-2 items-center w-20 justify-center">
            <div className="h-14 w-14 flex justify-center items-center">
              <Tooltip tip="Your Profile">
                {isImageLoading ? (
                  <Spinner size={30} />
                ) : (
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={finalImg || ""} />
                    <AvatarFallback>{dummyImg}</AvatarFallback>
                  </Avatar>
                )}
              </Tooltip>
            </div>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] ">
                  Add Photo
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-[999999999]">
                  <DropdownMenuItem
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                  >
                    {" "}
                    From Device
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGravatar}>
                    From Gravatar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRemovePhoto}>
                    {" "}
                    Remove Photo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
          <div>
            <Input
              id="nickname"
              label="Nickname"
              className="mb-4"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
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
            className="w-60"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
            <SelectTrigger className="w-60">
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
            checked={nameInEmail}
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
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
            Log out of all other active sessions on other devices besides this
            one.
          </p>
          <Button variant={"destructive"} onClick={handleLogOut}>
            Log Out
          </Button>
        </div>
      </SettingDiv>

      <AnimatePresence>
        {showSaveDiscard && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="pb-4 sticky bottom-0 bg-background-secondary"
          >
            <SettingHr className="!m-0" />
            <SettingDiv className="relative w-full !mb-0 pt-1">
              <div className="w-full">
                <div className="flex gap-3 justify-end">
                  <Button
                    className="w-24"
                    onClick={handleSubmit}
                    variant={"primary"}
                  >
                    {!isLoading ? `Save` : <Spinner />}
                  </Button>
                  <Button
                    className="w-24"
                    variant={"secondary"}
                    onClick={handleAllDiscard}
                  >
                    Discard
                  </Button>
                </div>
              </div>
            </SettingDiv>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;

