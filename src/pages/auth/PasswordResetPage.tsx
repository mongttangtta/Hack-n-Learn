import { useForm } from 'react-hook-form';
import AuthInput from '../../components/AuthInput';
import Button from '../../components/Button';
import FormErrorMessage from '../../components/FormErrorMessage';
import axios from 'axios';

type IPasswordResetFormInput = {
  id: string;
  email: string;
};

export default function PasswordResetPage() {
  const {
    register,
    formState: { errors },
    getValues,
  } = useForm<IPasswordResetFormInput>();

  const handleSendEmail = async () => {
    const { id, email } = getValues();
    if (!id) {
      alert('아이디를 입력해주세요.');
      return;
    }
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      await axios.post('/api/auth/reset-password', {
        id,
        email,
      });
      alert('비밀번호 재설정 이메일이 발송되었습니다. 이메일을 확인해주세요.');
    } catch (error) {
      console.error('비밀번호 재설정 이메일 발송 실패:', error);
      alert('비밀번호 재설정 이메일 발송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 space-y-10">
        <div className="text-center">
          <h1 className="text-h2 font-bold text-primary-text ">
            이메일을 인증 해주세요
          </h1>
          <p className="text-secondary-text mt-2">
            메일을 인증하면 메일이 발송돼요
          </p>
        </div>
        <form className="space-y-8">
          <div className="flex flex-col gap-8">
            <AuthInput
              id="id"
              type="text"
              placeholder="아이디"
              {...register('id', {
                required: '아이디는 필수입니다.',
              })}
            />
            {errors.id && <FormErrorMessage message={errors.id.message} />}
            <AuthInput
              id="email"
              type="email"
              placeholder="이메일"
              {...register('email', {
                required: '이메일은 필수입니다.',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: '유효한 이메일 형식이 아닙니다.',
                },
              })}
            />
            <Button
              className="w-full"
              type="button"
              variant="primary"
              onClick={handleSendEmail}
            >
              인증
            </Button>
            {errors.email && (
              <FormErrorMessage message={errors.email.message} />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
