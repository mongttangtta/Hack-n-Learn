import { useForm, type SubmitHandler } from 'react-hook-form';
import AuthInput from '../../components/AuthInput';
import Button from '../../components/Button';
import FormErrorMessage from '../../components/FormErrorMessage';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type IFindIdFormInput = {
  email: string;
};

export default function FindIdPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFindIdFormInput>();
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFindIdFormInput> = async (data) => {
    setErrorMessage(null);
    setMessage(null);
    setIsLoading(true);
    try {
      await axios.post('/api/auth/find-id', { email: data.email });
      setMessage('해당 이메일로 아이디 정보를 발송했습니다.');
    } catch (error) {
      setErrorMessage('아이디 찾기에 실패했습니다. 다시 시도해주세요.');
      console.error('Find ID failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-h2 font-bold text-primary-text">아이디 찾기</h1>
          <p className="text-secondary-text mt-2">
            가입 시 사용한 이메일 주소를 입력해주세요.
          </p>
        </div>
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <AuthInput
            id="email"
            type="email"
            placeholder="이메일"
            {...register('email', {
              required: '이메일은 필수입니다.',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '유효한 이메일 주소를 입력해주세요.',
              },
            })}
          />
          {errors.email && <FormErrorMessage message={errors.email.message} />}

          {message && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          {errorMessage && <FormErrorMessage message={errorMessage} />}

          <div className="pt-6 ">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading || !!message}
            >
              {isLoading ? '전송 중...' : '아이디 찾기'}
            </Button>
            <div className="text-center">
              <button
                type="button"
                className="text-primary-text hover:text-accent-primary1 mt-10"
                onClick={() => navigate('/password-reset')}
              >
                비밀번호를 잊으셨나요? →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
