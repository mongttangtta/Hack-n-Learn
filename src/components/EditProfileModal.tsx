import React, { useState, useRef } from 'react';
import Modal from './Modal';
import {
  checkNicknameAvailability,
  updateNickname,
  uploadProfileImage,
} from '../services/userService';
import { Camera } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  currentProfileImage: string;
  onProfileUpdate: (newNickname: string, newImageUrl: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentNickname,
  currentProfileImage,
  onProfileUpdate,
}) => {
  const [nickname, setNickname] = useState(currentNickname);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<
    boolean | null
  >(null);
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(currentProfileImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setIsNicknameAvailable(null);
    setNicknameMessage('');
  };

  const handleCheckNickname = async () => {
    if (!nickname) {
      setNicknameMessage('닉네임을 입력해주세요.');
      return;
    }
    if (nickname === currentNickname) {
      setNicknameMessage('현재 닉네임과 동일합니다.');
      return;
    }

    const result = await checkNicknameAvailability(nickname);
    if (result.available) {
      setIsNicknameAvailable(true);
      setNicknameMessage('사용 가능한 닉네임입니다.');
    } else {
      setIsNicknameAvailable(false);
      setNicknameMessage('이미 사용 중인 닉네임입니다.');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    let updatedNickname = currentNickname;
    let updatedImageUrl = currentProfileImage;

    // 1. Update Nickname if changed and verified
    if (nickname !== currentNickname) {
      if (isNicknameAvailable !== true) {
        alert('닉네임 중복 확인을 해주세요.');
        return;
      }
      const result = await updateNickname(nickname);
      if (result.success) {
        updatedNickname = nickname;
      } else {
        if (
          result.error === 'Nickname change cooldown active' &&
          result.nextAvailableAt
        ) {
          const nextDate = new Date(result.nextAvailableAt).toLocaleString();
          alert(
            `닉네임 변경은 24시간에 한 번만 가능합니다.\n남은 시간: ${result.remainHours}시간\n변경 가능 시간: ${nextDate}`
          );
        } else {
          alert('닉네임 변경에 실패했습니다.');
        }
        return;
      }
    }

    // 2. Upload Profile Image if changed
    if (selectedFile) {
      const result = await uploadProfileImage(selectedFile);
      if (result.success && result.data?.profileImageUrl) {
        updatedImageUrl = result.data.profileImageUrl;
      } else {
        alert('프로필 이미지 업로드에 실패했습니다.');
        return;
      }
    }

    onProfileUpdate(updatedNickname, updatedImageUrl);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="프로필 수정">
      <div className="flex flex-col gap-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          <div
            className="relative cursor-pointer group"
            onClick={handleImageClick}
          >
            <img
              src={previewImage || 'https://via.placeholder.com/128'}
              alt="Profile Preview"
              className="w-32 h-32  rounded-full object-cover border-2 border-edge"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-primary-text" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <span className="text-sm text-secondary-text mt-2">
            프로필 사진 변경
          </span>
        </div>

        {/* Nickname Section */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-secondary-text">
            닉네임
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-primary-text focus:outline-none focus:border-accent-primary1"
              placeholder="닉네임 입력"
            />
            <button
              onClick={handleCheckNickname}
              className="px-4 py-2 bg-accent-primary1 text-black rounded hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
              중복 확인
            </button>
          </div>
          {nicknameMessage && (
            <p
              className={`text-sm ${
                isNicknameAvailable ? 'text-green-500' : 'text-accent-warning'
              }`}
            >
              {nicknameMessage}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-primary-text rounded hover:bg-gray-600 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-accent-primary1 text-black rounded hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
