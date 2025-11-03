import AuthInput from '../components/AuthInput';
import Button from '../components/Button';
export default function SignupPage() {
  return (
    <div className=" min-h-screen flex items-center justify-center my-10">
      <div className="w-full max-w-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-h1 font-bold text-primary-text mb-10">
            회원가입
          </h1>
        </div>
        <form className="space-y-8">
          <div className="space-y-2">
            <AuthInput id="username" placeholder="아이디" />
          </div>
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <AuthInput
                id="email"
                type="email"
                placeholder="이메일"
                className="flex-grow"
              />
              <Button variant="secondary">인증</Button>
            </div>
          </div>
          <div className="space-y-2">
            <AuthInput id="auth-code" placeholder="메일 인증 번호" />
          </div>
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <AuthInput
                id="nickname"
                placeholder="닉네임"
                className="flex-grow"
              />
              <Button variant="secondary">중복검사</Button>
            </div>
          </div>
          <div className="space-y-2">
            <AuthInput id="password" type="password" placeholder="비밀번호" />
          </div>
          <div className="space-y-2">
            <AuthInput
              id="password-confirm"
              type="password"
              placeholder="비밀번호 확인"
            />
          </div>
          <hr className="border-edge" />
          <label className="flex items-center justify-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              id="terms"
              className="rounded border-edge bg-card-background text-accent-primary1 focus:ring-accent-primary1"
            />
            <span className="text-primary-text">
              이용약관 및 개인정보처리방침에 동의합니다.
            </span>
          </label>
          <Button type="submit" variant="primary" className="w-full">
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
