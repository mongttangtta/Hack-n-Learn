import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthInput from '../../components/AuthInput';
import Button from '../../components/Button';
import FormErrorMessage from '../../components/FormErrorMessage';
import axios from 'axios';
import { useState } from 'react';

type IChangePasswordFormInput = {
  password: string;
  passwordConfirm: string;
};

export default function ChangePasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IChangePasswordFormInput>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const password = watch('password');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IChangePasswordFormInput> = async (data) => {
    const token = searchParams.get('token');
    if (!token) {
      setErrorMessage('유효하지 않은 접근입니다. 다시 시도해주세요.');
      return;
    }

    try {
      await axios.post(`/api/auth/reset-password/${token}`, {
        newPassword: data.password,
      });
      alert('비밀번호가 성공적으로 변경되었습니다!');
      navigate('/login');
    } catch (error) {
      setErrorMessage('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      console.error('Password change failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-h2 font-bold text-primary-text ">
            비밀번호 변경
          </h1>
          <p className="text-secondary-text mt-2">
            새로 사용할 비밀번호를 입력해주세요.
          </p>
        </div>
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <AuthInput
            id="password"
            type="password"
            placeholder="새 비밀번호"
            {...register('password', {
              required: '비밀번호는 필수입니다.',
              minLength: {
                value: 8,
                message: '비밀번호는 8자 이상이어야 합니다.',
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/,
                message:
                  '비밀번호는 8자 이상이며, 대소문자, 숫자, 특수문자를 포함해야 합니다.',
              },
            })}
          />
          {errors.password && (
            <FormErrorMessage message={errors.password.message} />
          )}

          <AuthInput
            id="passwordConfirm"
            type="password"
            placeholder="새 비밀번호 확인"
            {...register('passwordConfirm', {
              required: '비밀번호 확인은 필수입니다.',
              validate: (value) =>
                value === password || '비밀번호가 일치하지 않습니다.',
            })}
          />
          {errors.passwordConfirm && (
            <FormErrorMessage message={errors.passwordConfirm.message} />
          )}

          {errorMessage && <FormErrorMessage message={errorMessage} />}

          <div className="pt-6">
            <Button type="submit" variant="primary" className="w-full">
              비밀번호 변경
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
