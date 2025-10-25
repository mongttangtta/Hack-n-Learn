import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HeroSection from '../components/HeroSection';
import heroImage from '../assets/images/이론학습 상세.png';
import Button from '../components/Button';
import LearningPageDetail2 from './LearningPageDetail2';
import WarningMessage from '../components/WarningMessage';

export default function LearningPageDetail() {
  const [showDetail2, setShowDetail2] = useState(false);
  const navigate = useNavigate();

  const toggleDetail2 = () => {
    setShowDetail2(!showDetail2);
  };

  return (
    <div className="min-h-screen text-primary-text">

      <HeroSection
        imageUrl={heroImage}
        title="XSS (Cross-Site Scripting)"
        subtitle="사용자의 입력을 필터링하지 않고 그대로 출력할 때, 악성 스크립트를 삽입해 실행시키는 취약점."
      />
      <div className="container mx-auto max-w-[1440px] px-20 py-16">
        <WarningMessage />
        <section className="mb-16">
          <h2 className="text-h2 font-bold mb-8">개요 & 학습 목표</h2>
          <p className="text-lg">
            이 챕터에서는 크로스 사이트 스크립팅(XSS)의 기본 개념을 이해하고,
            다양한 유형의 XSS 공격을 식별하며, 안전한 코딩 관행을 통해 이를
            방어하는 방법을 학습합니다. 실습을 통해 실제 공격 시나리오를
            경험하고, 효과적인 방어 전략을 구축하는 것을 목표로 합니다.
          </p>
        </section>
        <hr className="border-edge my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">XSS란 무엇인가?</h2>
          <p className="text-lg mb-8">
            XSS(Cross Site Script)는 악의적인 사용자가 공격하려는 사이트에
            스크립트를 넣는 기법을 말한다. 공격에 성공하면 사이트에 접속한
            사용자는 삽입된 코드를 실행하게 되며, 보통 의도치 않은 행동을
            수행시키거나 쿠키나 세션 토큰 등의 민감한 정보를 탈취합니다. 쉽게
            말해 "공격자가 웹 페이지에 악성 스크립트를 삽입 → 다른 사용자의
            브라우저에서 실행"되는 문제입니다.
          </p>
          <h3 className="text-2xl font-bold mb-4">훔칠 수 있는 권한</h3>
          <ul className="list-disc list-inside mb-8 space-y-2">
            <li>
              <code className="bg-code-bg text-code-string p-1 rounded">
                document.cookie
              </code>
              로 접근 가능한 쿠키
            </li>
            <li>DOM 조작으로 화면 변조(피싱 UI)</li>
            <li>
              사용자의 입력으로 인증 토큰 등 탈취(예:{' '}
              <code className="bg-code-bg text-code-string p-1 rounded">
                localStorage
              </code>
              )
            </li>
            <li>키입력 가로채기(키로거 스크립트) 등</li>
          </ul>
          <h3 className="text-2xl font-bold mb-4">문제의 핵심</h3>
          <p className="text-lg">
            데이터(입력)를 검증하지 않고, 출력 시 문맥에 맞는 처리를 하지 않음.
          </p>
        </section>

        <hr className="border-edge my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">XSS 종류</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="bg-card-background p-6 rounded-lg border-2 border-edge cursor-pointer"
              onClick={toggleDetail2}
            >
              <h3 className="text-2xl font-bold text-primary-text mb-4">
                Stored XSS (저장형)
              </h3>
              <p className="text-secondary-text mb-4">
                공격자가 입력(예: 게시판 댓글, 프로필, 리뷰)에 악성 스크립트를
                저장 → 다른 사용자가 해당 페이지를 열 때 서버에서 DB로부터
                불러와 그대로 렌더링 → 공격 실행
              </p>
              <p className="font-bold">위험도: 매우 높음</p>
            </div>
            <div className="bg-card-background p-6 rounded-lg border-2 border-edge">
              <h3 className="text-2xl font-bold text-primary-text mb-4">
                Reflected XSS (반사형)
              </h3>
              <p className="text-secondary-text mb-4">
                악성 스크립트가 URL 파라미터/POST 데이터 등에 담겨 서버 응답에
                반영되어 즉시 실행됨. 보통 공격자는 URL을 만들어 피해자에게 클릭
                유도(피싱 이메일, 채팅 등).
              </p>
              <p className=" font-bold">위험도: 높음</p>
            </div>
            <div className="bg-card-background p-6 rounded-lg border-2 border-edge">
              <h3 className="text-2xl font-bold text-primary-text mb-4">
                DOM-based XSS (DOM 기반)
              </h3>
              <p className="text-secondary-text mb-4">
                서버 응답은 안전하지만 브라우저 내 자바스크립트가
                URL/fragment/cookie 등 클라이언트 측 데이터를 DOM에 안전하지
                않게 반영할 때 발생. 서버는 균열이 없음.
              </p>
              <p className=" font-bold">
                주의: 복잡한 SPA(React/Vue/Angular)에서도 실수로 DOM XSS가
                발생할 수 있음.
              </p>
            </div>
          </div>
          {showDetail2 && <LearningPageDetail2 />}
        </section>

        <hr className="border-edge my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">
            방어 원칙(상세) — 컨텍스트 기반 접근
          </h2>
          <p className="text-lg mb-8">
            XSS 방어는 ‘어떤 문맥에서 출력되는가(HTML, Attribute, JS, URL, CSS)’
            를 기준으로 다르게 처리해야 합니다.{' '}
            <code className="bg-code-bg text-code-string p-1 rounded">
              &lt;
            </code>{' '}
            를 HTML 본문에 넣었을 때는 태그로, 문자열 리터럴 안에 넣으면 문자로,
            URL 파라미터로 넣으면 경로의 일부로 해석됩니다. 따라서 단순히 모든{' '}
            <code className="bg-code-bg text-code-string p-1 rounded">
              &lt;
            </code>
            를 바꾸는 것만으로는 부족하고, 출력되는문맥별로 적합한
            인코딩(escaping/encoding)을 적용해야 안전합니다.
          </p>
          <div className="flex items-center mb-8">
            <div className="h-8 w-1 bg-accent-primary1 mr-4"></div>
            <p className="text-lg font-bold">
              핵심원칙 : 언제나 출력(렌더링) 시점에 인코딩하라. (입력 시점만
              처리하면 우회될 수 있음)
            </p>
          </div>

          <h3 className="text-2xl font-bold mb-4">
            4.1 출력(출력 컨텍스트)별 안전 처리
          </h3>

          <div className="mb-8">
            <h4 className="text-xl font-bold mb-4">
              HTML 본문 (문맥: 보이는 텍스트)
            </h4>
            <p className="mb-4">
              무엇을 : HTML 이스케이프 (
              <code className="bg-code-bg text-code-string p-1 rounded">
                &lt;
              </code>
              ,{' '}
              <code className="bg-code-bg text-code-string p-1 rounded">
                &gt;
              </code>
              ,{' '}
              <code className="bg-code-bg text-code-string p-1 rounded">
                &amp;
              </code>
              ,{' '}
              <code className="bg-code-bg text-code-string p-1 rounded">"</code>
              ,{' '}
              <code className="bg-code-bg text-code-string p-1 rounded">'</code>{' '}
              →{' '}
              <code className="bg-code-bg text-code-string p-1 rounded">
                &amp;lt;
              </code>{' '}
              등)
            </p>
            <p className="mb-4">왜 : 태그로 해석되는 걸 막음</p>
            <p className="mb-4">
              한 줄 처리법 : 템플릿 자동 이스케이프 /{' '}
              <code className="bg-code-bg text-code-keyword p-1 rounded">
                textContent
              </code>{' '}
              사용
            </p>
            <div className="bg-code-bg p-4 rounded-lg">
              <code className="text-code-syntax">
                el.textContent = userInput;{' '}
                <span className="text-gray-500">// JS</span>
                <br />
                html.escape(s); <span className="text-gray-500">// Python</span>
              </code>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-bold mb-4">
              HTML 속성 (예:{' '}
              <code className="bg-code-bg text-code-string p-1 rounded">
                title="..."
              </code>
              )
            </h4>
            <p className="mb-4">
              무엇을 : attribute-encoding + 따옴표로 감싸기
            </p>
            <p className="mb-4">
              왜 : 따옴표 탈출로 이벤트 속성(onerror) 등으로 이어지는 걸 막음
            </p>
            <p className="mb-4">
              한 줄 처리법 : DOM API로 설정 (
              <code className="bg-code-bg text-code-keyword p-1 rounded">
                setAttribute
              </code>
              )
            </p>
            <div className="bg-code-bg p-4 rounded-lg">
              <code className="text-code-syntax">
                el.setAttribute('title', userInput);
              </code>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-bold mb-4">
              JavaScript context (inline JS, eval 등)
            </h4>
            <p className="mb-4">
              무엇을 : JS 안전 직렬화 (문자열 내부에 넣지 말고 JSON 사용)
            </p>
            <p className="mb-4">
              왜 : 따옴표/문자열 종결로 코드 주입되는 걸 막음
            </p>
            <p className="mb-4">
              한 줄 처리법 : 서버에서 JSON 직렬화 → 클라이언트에서 파싱
            </p>
            <div className="bg-code-bg p-4 rounded-lg">
              <code className="text-code-syntax">
                {'const data = JSON.parse("{{ server_obj|tojson }}");'}
                <br />
                {'const s = JSON.stringify(userInput);'}
              </code>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Button
            variant="primary"
            className="w-72 h-12 text-xl font-semibold rounded-[20px]"
            onClick={() => navigate('/learning/quiz')} // Corrected path
          >
            퀴즈 풀러가기
          </Button>
        </div>
      </div>
    </div>
  );
}
