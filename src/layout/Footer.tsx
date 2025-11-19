import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png'; // 로고 이미지 경로

export default function Footer() {
  return (
    <footer className="bg-navigation text-primary-text py-4">
      <div className="container mx-auto max-w-[1440px]">
        <div className="flex flex-col md:flex-row justify-around items-start gap-10">
          {/* 1. 로고 */}
          <div className="flex-shrink-0 mt-5">
            <Link to="/" className="">
              <img
                src={logo}
                alt="Hack 'n' Learn Logo"
                className="h-10 w-full"
              />
            </Link>
          </div>

          {/* 2. 서비스 정보 링크 */}
          <div>
            <h3 className="font-semibold text-primary-text mb-2">
              Information
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/about" // Placeholder link
                  className="hover:text-accent-primary1 text-sm transition-colors"
                >
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link
                  to="/terms" // Placeholder link
                  className="hover:text-accent-primary1 text-sm transition-colors"
                >
                  이용 약관
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy" // Placeholder link
                  className="hover:text-accent-primary1 text-sm transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. 연락처 */}
          <div>
            <h3 className="font-semibold text-primary-text mb-4">Contact Us</h3>
            <p className="hover:text-accent-primary1 transition-colors text-sm cursor-pointer">
              dlakrp731@gmail.com
            </p>
          </div>
        </div>
        <div className="px-10">
          <hr className="border-edge my-4 " />
        </div>
        {/* 4. 저작권 */}
        <div className="text-center text-secondary-text">
          <p className="text-sm">
            © {new Date().getFullYear()} Hack 'n' Learn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
