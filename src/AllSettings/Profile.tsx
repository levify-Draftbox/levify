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
import zxcvbn from 'zxcvbn';


const Profile = () => {
  const {
    emails: userEmails,
    profile,
    updateProfile: updateUserProfile,
    updateSettings: updateUserSettings,
    allSetting,
  } = useProfileStore();

  //all elements
  const [finalImg, setFinalImg] = useState("");
  const [nickname, setNickname] = useState<string>(profile.nickname);
  const [fullName, setFullName] = useState<string>(profile.full_name);
  const [selectedEmail, setSelectedEmail] = useState<string>(profile.default_email);
  const [nameInEmail, setnameInEmail] = useState(allSetting.profile.nameInMail);

  const [isLoading, setIsLoading] = useState(false);

  //password
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isDataValid, setIsDataValid] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  //image
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [fileType, setFileType] = useState<string | null>(allSetting.profile?.image);
  const [dummyImg, setDummyImg] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [, setImageChanged] = useState(false);


  const [showSaveDiscard, setshowSaveDiscard] = useState(false);

  const [initialValues, setInitialValues] = useState<InitialValues>({
    nickname: "",
    fullName: "",
    selectedEmail: "",
    nameInEmail: false,
    image: "",
  });


  useEffect(() => {
    if (profile) {
      setIsImageLoading(true);
      const newNickname = profile.nickname || "";
      const newFullName = profile.full_name || "";
      const newSelectedEmail = profile.default_email || "";

      setNickname(newNickname);
      setFullName(newFullName);
      setSelectedEmail(newSelectedEmail);
      setIsImageLoading(false);
      setInitialValues((s) => ({
        ...s,
        nickname: newNickname,
        fullName: newFullName,
        selectedEmail: newSelectedEmail,
      }));
    }
  }, [profile]);

  useEffect(() => {
    setFinalImg(allSetting.profile?.image || "");
    setnameInEmail(allSetting.profile.nameInMail || false);

    setInitialValues((e) => ({
      ...e,
      image: allSetting.profile?.image,
      nameInEmail: allSetting.profile.nameInMail,
    }));
  }, [profile]);

  useEffect(() => {
    const hasChanges =
      nickname !== initialValues.nickname ||
      fullName !== initialValues.fullName ||
      selectedEmail !== initialValues.selectedEmail ||
      nameInEmail !== initialValues.nameInEmail ||
      finalImg !== initialValues.image;

    setshowSaveDiscard(hasChanges);
  }, [nickname, fullName, selectedEmail, nameInEmail, finalImg]);

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

  const updateSettings = async (obj: Partial<ProfileSettings>) => {
    setIsLoading(true);

    try {
      await updateUserSettings("profile", obj);
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
          const response = await api.post(
            "/file/profileupload",
            reader.result,
            {
              headers: {
                "X-File-Name": fileType,
              },
            }
          );
          const image = response.data.Url;
          setFinalImg(image);
          await updateSettings({ image });
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
      await updateSettings({ image: gravatarUrl });
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
      await updateSettings({ image: "" });
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

      const updateData = {
        nickname,
        full_name: fullName,
        default_email: newemail,
        nameInMail: nameInEmail,
        image: finalImg,
      };

      await updateSettings({ nameInMail: nameInEmail });
      await updateProfile(updateData);

      setInitialValues({
        nickname,
        fullName,
        selectedEmail: newemail,
        nameInEmail,
        image: finalImg,
      });

      setshowSaveDiscard(false);

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

  const checkPasswordStrength = (password: string) => {
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
    setPasswordFeedback(result.feedback.warning || result.feedback.suggestions[0] || '');
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'currentPassword':
        setCurrentPassword(value);
        setCurrentPasswordError('');
        break;
      case 'newPassword':
        setNewPassword(value);
        setNewPasswordError('');
        checkPasswordStrength(value);

        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        setConfirmPasswordError('');
        if (value !== newPassword) {
          setConfirmPasswordError('Passwords do not match');
        }
        break;
    }
  };

  const handleChangePassword = () => {
    if (isDataValid) {
      setShowConfirmationModal(true);
    }
  };

  const confirmPasswordChange = async () => {
    setIsChangingPassword(true);
    try {
      const response = await api.post("/profile/reset-password", {
        currentPassword,
        newPassword,
        confirmPassword
      });

      if (response.data.success) {
        alert("Password changed successfully");
        setChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowConfirmationModal(false);


      } else {
        throw new Error(response.data.error || "Failed to change password");
      }
    } catch (error: unknown) {
      console.error("Error changing password:", error);
      if (error instanceof Error && 'response' in error) {
        const apiError = error as { response?: { data?: { error?: string } } };
        setCurrentPasswordError(apiError.response?.data?.error || "");
      }
    } finally {
      setIsChangingPassword(false);
      setShowConfirmationModal(false);
    }
    setChangePassword(!changePassword)
   

  };

  useEffect(() => {
    const isValid = Boolean(currentPassword && newPassword && confirmPassword &&
      !currentPasswordError && !newPasswordError && !confirmPasswordError);
    setIsDataValid(isValid);
  }, [currentPassword, newPassword, confirmPassword, currentPasswordError, newPasswordError, confirmPasswordError]);

  useEffect(() => {
    if (nickname && !finalImg) {
      const data = nickname.charAt(0).toUpperCase();
      setDummyImg(data);
    } else {
      setDummyImg("");
    }
  }, [nickname, finalImg]);

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
                    {finalImg ? (
                      <AvatarImage src={finalImg} alt="Profile" />
                    ) : (
                      <AvatarFallback>{dummyImg}</AvatarFallback>
                    )}
                  </Avatar>
                )}
              </Tooltip>
            </div>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] ">
                  Edit Photo
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
          Full Name in mail
        </h2>
        <div className="flex mt-1 items-center justify-between">
          <Label
            htmlFor="nikname-switch"
            className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] mt-1"
          >
            Show full name in sent email
          </Label>
          <Switch
            id="nikname-switch"
            checked={nameInEmail}
            onCheckedChange={() => setnameInEmail(!nameInEmail)}
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
            <div className="py-6 px-6">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              <div className="">
                <Input
                  type="password"
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  disabled={isChangingPassword}
                  error={currentPasswordError}
                />

                <div className="mt-2">
                  <Input
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    disabled={isChangingPassword}
                    error={newPasswordError}
                  />
                  <AnimatePresence>
                    {newPassword && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2"
                      >
                        <div className="flex items-center">
                          <motion.div
                            className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                            initial={{ width: '0%' }}
                            animate={{ width: `${(passwordStrength + 1) * 20}%` }}
                            transition={{ duration: 0.5 }}
                          />
                          <span className="ml-2 w-32 text-sm font-medium">{getPasswordStrengthText()}</span>
                        </div>
                        {passwordFeedback && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-gray-600 mt-1 "
                          >
                            {passwordFeedback}
                          </motion.p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-2">
                  <Input
                    type="password"
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    disabled={isChangingPassword}
                    error={confirmPasswordError}
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    className="w-full sm:w-auto"
                    onClick={handleChangePassword}
                    variant="primary"
                    disabled={!isDataValid || isChangingPassword}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </ResizeableModel>
        )}

        {showConfirmationModal && (
          <ResizeableModel
            size={{ width: "400px" }}
            onClose={() => setShowConfirmationModal(false)}
            key="confirmPassword"
            modalKey="confirmPassword"
          >
            <div className="py-6 px-6">
              <h3 className="text-lg font-medium mb-4">Confirm Password Change</h3>
              <p className="mb-4">Are you sure you want to change your password? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirmationModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmPasswordChange}
                >

                  {isChangingPassword ? (
                    <Spinner size={20} />
                  ) : (
                    'Confirm Change'
                  )}

                </Button>
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
