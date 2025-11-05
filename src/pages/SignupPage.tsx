import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthInput from '../components/AuthInput';
import Button from '../components/Button';
import FormErrorMessage from '../components/FormErrorMessage';

// IFormInput defines the structure of our form data
type IFormInput = {
  username: string;
  email: string;
  authCode: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
  terms: boolean;
};

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IFormInput>();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  // We use watch to get the value of the password field for comparison
  const password = watch('password');

  const handleEmailVerify = async () => {
    setIsVerifying(true);
    setIsCodeVerified(false); // Reset code verification status on new email send
    try {
      const email = getValues('email');
      const response = await fetch(
        'https://hacknlearn.site/api/auth/send-verification-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error('인증번호 발송에 실패했습니다.');
      }

      alert('인증번호가 발송되었습니다. 이메일을 확인해주세요.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyAuthCode = async () => {
    setIsVerifyingCode(true);
    try {
      const email = getValues('email');
      const authCode = getValues('authCode');

      if (!email || !authCode) {
        alert('이메일과 인증번호를 모두 입력해주세요.');
        return;
      }

      const response = await fetch(
        'https://hacknlearn.site/api/auth/verify-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, code: authCode }),
        }
      );

      if (!response.ok) {
        throw new Error('인증번호 확인에 실패했습니다. 다시 시도해주세요.');
      }

      alert('인증번호가 확인되었습니다.');
      setIsCodeVerified(true);
    } catch (err: any) {
      alert(err.message);
      setIsCodeVerified(false);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleNicknameCheck = () => {
    // TODO: Implement nickname duplicate check logic
    console.log('Checking for duplicate nickname...');
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      // The API call is now using the 'data' object from react-hook-form
      const response = await fetch(
        'https://hacknlearn.site/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: data.username,
            nickname: data.nickname,
            password: data.password,
            email: data.email,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }

      navigate('/login');
    } catch (err: any) {
      // You might want a more sophisticated error display here
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center my-10">
      <div className="w-full max-w-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-h1 font-bold text-primary-text mb-10">
            회원가입
          </h1>
        </div>
        {/* Use the handleSubmit from react-hook-form to wrap our onSubmit function */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <AuthInput
            id="username"
            placeholder="아이디"
            {...register('username', { required: '아이디는 필수입니다.' })}
          />
          {errors.username && (
            <FormErrorMessage message={errors.username.message} />
          )}

          <div className="flex space-x-2 items-center">
            <AuthInput
              id="email"
              type="email"
              placeholder="이메일"
              className="flex-grow"
              {...register('email', {
                required: '이메일은 필수입니다.',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: '유효한 이메일 형식이 아닙니다.',
                },
              })}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleEmailVerify}
              disabled={isVerifying || isCodeVerified}
            >
              {isVerifying ? '전송중...' : '인증'}
            </Button>
          </div>
          {errors.email && <FormErrorMessage message={errors.email.message} />}

          <div className="flex space-x-2 items-center">
            <AuthInput
              id="authCode"
              placeholder="메일 인증 번호"
              {...register('authCode', { required: '인증 번호는 필수입니다.' })}
              disabled={isCodeVerified}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleVerifyAuthCode}
              disabled={isVerifyingCode || isCodeVerified}
            >
              {isVerifyingCode
                ? '확인중...'
                : isCodeVerified
                ? '확인됨'
                : '확인'}
            </Button>
          </div>
          {errors.authCode && (
            <FormErrorMessage message={errors.authCode.message} />
          )}

          <div className="flex space-x-2 items-center">
            <AuthInput
              id="nickname"
              placeholder="닉네임"
              className="flex-grow"
              {...register('nickname', { required: '닉네임은 필수입니다.' })}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleNicknameCheck}
            >
              중복검사
            </Button>
          </div>
          {errors.nickname && (
            <FormErrorMessage message={errors.nickname.message} />
          )}

          <AuthInput
            id="password"
            type="password"
            placeholder="비밀번호"
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
            placeholder="비밀번호 확인"
            {...register('passwordConfirm', {
              required: '비밀번호 확인은 필수입니다.',
              validate: (value) =>
                value === password || '비밀번호가 일치하지 않습니다.',
            })}
          />
          {errors.passwordConfirm && (
            <FormErrorMessage message={errors.passwordConfirm.message} />
          )}

          <hr className="border-edge !my-8" />

          <label className="flex items-center justify-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              id="terms"
              className="rounded border-edge bg-card-background text-accent-primary1 focus:ring-accent-primary1"
              {...register('terms', {
                required: '이용약관에 동의해야 합니다.',
              })}
            />
            <span className="text-primary-text">
              이용약관 및 개인정보처리방침에 동의합니다.
            </span>
          </label>
          {errors.terms && <FormErrorMessage message={errors.terms.message} />}

          <Button type="submit" variant="primary" className="w-full !mt-8">
            가입하기
          </Button>
        </form>
        <div className="text-center">
          <p className="text-primary-text">
            소셜 계정으로 서비스를 이용할 수 있습니다{' '}
            <a href="/login" className="text-accent-primary1">
              로그인 →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
