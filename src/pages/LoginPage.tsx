import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthInput from '../components/AuthInput';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';
import FormErrorMessage from '../components/FormErrorMessage';

type ILoginFormInput = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInput>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ILoginFormInput> = async data => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch('https://hacknlearn.site/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: data.username, // Assuming backend expects 'id' for username
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인에 실패했습니다.');
      }

      // Assuming the backend returns a token or user info on successful login
      const result = await response.json();
      // TODO: Store the authentication token (e.g., in localStorage or a cookie)
      console.log('Login successful:', result);

      navigate('/'); // Redirect to home page or dashboard
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-text mt-10 mb-10">
            로그인
          </h1>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <AuthInput
            id="username"
            placeholder="아이디"
            {...register('username', { required: '아이디는 필수입니다.' })}
          />
          {errors.username && (
            <FormErrorMessage message={errors.username.message} />
          )}

          <AuthInput
            id="password"
            type="password"
            placeholder="비밀번호"
            {...register('password', { required: '비밀번호는 필수입니다.' })}
          />
          {errors.password && (
            <FormErrorMessage message={errors.password.message} />
          )}

          <hr className="mt-15 text-edge" />
          <div className="flex flex-col items-center space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="rememberMe"
                className="rounded border-edge bg-card-background text-accent-primary1 focus:ring-accent-primary1"
                {...register('rememberMe')}
              />
              <span className="text-primary-text">계정 저장</span>
            </label>
            {apiError && <FormErrorMessage message={apiError} />}
            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
            <p className=" text-primary-text">
              계정을 잊으셨나요?
              <a href="#" className="text-accent-primary1 ml-2">
                →
              </a>
            </p>
          </div>
        </form>
        <div className="space-y-4 mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SocialButton
              provider="google"
              onClick={() =>
                (window.location.href =
                  'https://hacknlearn.site/api/auth/google')
              }
            >
              Google로 로그인
            </SocialButton>
            <SocialButton
              provider="github"
              onClick={() =>
                (window.location.href =
                  'https://hacknlearn.site/api/auth/github')
              }
            >
              Github으로 로그인
            </SocialButton>
          </div>
        </div>
        <div className="text-center space-x-3.5">
          <p className="text-primary-text">
            계정이 없으신가요?{' '}
            <a href="/signup" className="text-accent-primary1 ml-2">
              회원가입 →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}