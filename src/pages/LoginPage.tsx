import AuthInput from '../components/AuthInput';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-text mt-10 mb-10">
            로그인
          </h1>
        </div>
        <form className="space-y-6">
          <div className="space-y-2">
            <AuthInput id="username" placeholder="아이디" />
          </div>
          <div className="space-y-2">
            <AuthInput id="password" type="password" placeholder="비밀번호" />
          </div>
          <hr className="mt-15 text-edge" />
          <div className="flex flex-col items-center space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="remember"
                className="rounded border-edge bg-card-background text-accent-primary1 focus:ring-accent-primary1"
              />
              <span className="text-primary-text">계정 저장</span>
            </label>
            <Button type="submit" variant="primary" className="w-full">
              로그인
            </Button>
            <p className=" text-primary-text hover:underline">
              계정을 잊으셨나요?
              <a href="#" className="text-accent-primary1 ml-2">
                →
              </a>
            </p>
          </div>
        </form>
        <div className="space-y-4 mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SocialButton provider="google">Google로 로그인</SocialButton>
            <SocialButton provider="github">Github으로 로그인</SocialButton>
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
