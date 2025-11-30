import React, { useState } from 'react';
import {
  Terminal,
  Server,
  BookOpen,
  Monitor,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Info,
  ShieldAlert,
  Flag,
} from 'lucide-react';

type TabType = 'flask' | 'php' | 'guide';
type OsType = 'mac' | 'window';

const DataRoomPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('flask');
  const [activeOs, setActiveOs] = useState<OsType>('mac');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 간단한 토스트 메시지나 알림을 추가할 수 있습니다.
  };

  return (
    <>
      <div className="min-h-screen py-12 px-4 sm:px-10 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* 메인 탭 네비게이션 */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <TabButton
              isActive={activeTab === 'flask'}
              onClick={() => setActiveTab('flask')}
              icon={<Terminal className="w-5 h-5" />}
              label="Flask 환경 설정"
            />
            <TabButton
              isActive={activeTab === 'php'}
              onClick={() => setActiveTab('php')}
              icon={<Server className="w-5 h-5" />}
              label="PHP 내장 서버"
            />
            <TabButton
              isActive={activeTab === 'guide'}
              onClick={() => setActiveTab('guide')}
              icon={<BookOpen className="w-5 h-5" />}
              label="학습/문제 가이드"
            />
          </div>

          {/* 콘텐츠 영역 */}
          <div className="bg-card-background backdrop-blur-md border border-edge rounded-2xl p-6 sm:p-10 shadow-2xl">
            {activeTab === 'flask' && (
              <FlaskContent
                activeOs={activeOs}
                onOsChange={setActiveOs}
                onCopy={copyToClipboard}
              />
            )}
            {activeTab === 'php' && (
              <PhpContent
                activeOs={activeOs}
                onOsChange={setActiveOs}
                onCopy={copyToClipboard}
              />
            )}
            {activeTab === 'guide' && <GuideContent />}
          </div>
        </div>
      </div>
    </>
  );
};

export default DataRoomPage;

/* --- Sub Components --- */

const TabButton = ({
  isActive,
  onClick,
  icon,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
      isActive
        ? 'bg-accent-primary1 text-black shadow-[0_0_15px_rgba(177,158,239,0.5)] transform scale-105'
        : 'bg-gray-800 text-secondary-text hover:bg-gray-700 hover:text-primary-text'
    }`}
  >
    {icon}
    {label}
  </button>
);

const OsToggle = ({
  activeOs,
  onChange,
}: {
  activeOs: OsType;
  onChange: (os: OsType) => void;
}) => (
  <div className="flex justify-center mb-8">
    <div className="bg-gray-800 p-1 rounded-lg inline-flex">
      <button
        onClick={() => onChange('mac')}
        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
          activeOs === 'mac'
            ? 'bg-gray-600 text-white shadow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        macOS
      </button>
      <button
        onClick={() => onChange('window')}
        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
          activeOs === 'window'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Windows
      </button>
    </div>
  </div>
);

const CodeBlock = ({
  code,
  label,
  onCopy,
}: {
  code: string;
  label?: string;
  onCopy: (text: string) => void;
}) => (
  <div className="my-4 rounded-lg overflow-hidden border border-gray-700 bg-[#111]">
    <div className="flex items-center justify-between px-4 py-2 bg-[#1f1f1f] border-b border-gray-700">
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        {label && <span className="ml-3 text-xs text-gray-400">{label}</span>}
      </div>
      <button
        onClick={() => onCopy(code)}
        className="text-secondary-text hover:text-white transition-colors"
        title="Copy code"
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>
    <div className="p-4 overflow-x-auto">
      <pre className="text-sm font-mono text-secondary-text leading-relaxed whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  </div>
);

/* --- Content Components --- */

const FlaskContent = ({
  activeOs,
  onOsChange,
  onCopy,
}: {
  activeOs: OsType;
  onOsChange: (os: OsType) => void;
  onCopy: (text: string) => void;
}) => (
  <div className="animate-fade-in text-gray-300">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-white mb-2">Flask 환경 설정</h2>
      <p className="text-gray-400">
        Python 기반의 웹 프레임워크인 Flask 실행 환경을 구성합니다.
      </p>
    </div>

    <OsToggle activeOs={activeOs} onChange={onOsChange} />

    <div className="space-y-8">
      <StepItem number={1} title="Python 버전 확인">
        <p className="mb-2">Python 3.8 이상 버전을 권장합니다.</p>
        <p className="text-sm text-gray-500 mb-2">
          {activeOs === 'mac'
            ? 'MacOS의 기본 Python이 아닌, Homebrew 설치 버전을 사용하는 것을 권장합니다.'
            : 'CMD 환경 기준으로 설명합니다.'}
        </p>
        <CodeBlock
          code={activeOs === 'mac' ? 'python3 --version' : 'python --version'}
          label="Terminal"
          onCopy={onCopy}
        />
      </StepItem>

      <StepItem number={2} title="pip 업데이트">
        <CodeBlock
          code={
            activeOs === 'mac'
              ? 'python3 -m pip install --upgrade pip'
              : 'python -m pip install --upgrade pip'
          }
          onCopy={onCopy}
        />
      </StepItem>

      <StepItem number={3} title="가상환경(venv) 생성 및 활성화">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-semibold text-accent-primary1">
              venv 생성
            </span>
            <CodeBlock
              code={
                activeOs === 'mac'
                  ? 'python3 -m venv venv'
                  : 'python -m venv venv'
              }
              onCopy={onCopy}
            />
          </div>
          <div>
            <span className="text-sm font-semibold text-accent-primary1">
              venv 활성화
            </span>
            <CodeBlock
              code={
                activeOs === 'mac'
                  ? 'source venv/bin/activate'
                  : 'venv\\Scripts\\activate'
              }
              onCopy={onCopy}
            />
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          터미널 프롬프트 앞에 <span className="text-green-400">(venv)</span>{' '}
          표시가 뜨면 정상적으로 활성화된 것입니다.
        </div>

        {/* Error Handling */}
        <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 mb-2 font-semibold">
            <AlertTriangle className="w-4 h-4" /> 주의사항
          </div>
          {activeOs === 'mac' ? (
            <>
              <p className="text-sm mb-2">
                "zsh: permission denied: venv/bin/activate" 에러 발생 시:
              </p>
              <CodeBlock code="chmod +x venv/bin/activate" onCopy={onCopy} />
            </>
          ) : (
            <>
              <p className="text-sm mb-2">
                "접근이 거부되었습니다." 에러 발생 시:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                <li>
                  CMD를 <strong>관리자 권한</strong>으로 실행하세요.
                </li>
                <li>
                  또는 PowerShell에서 아래 명령을 실행 후 다시 시도하세요.
                </li>
              </ul>
              <CodeBlock
                code="Set-ExecutionPolicy -Scope CurrentUser RemoteSigned"
                label="PowerShell"
                onCopy={onCopy}
              />
            </>
          )}
        </div>
      </StepItem>

      <StepItem number={4} title="Flask 설치">
        <CodeBlock code="pip install flask" onCopy={onCopy} />
      </StepItem>

      <StepItem number={5} title="파일 생성 (app.py)">
        <p className="mb-2 text-sm">
          아래 코드를 작성하여 <code>app.py</code> 파일을 생성합니다.
        </p>
        <CodeBlock
          code={`# app.py 내용\nprint("hello")`}
          label="Python Code"
          onCopy={onCopy}
        />
        {activeOs === 'mac' ? (
          <p className="text-xs text-gray-500 mt-2">
            vi 에디터 사용 시: Esc → :wq → Enter 로 저장
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-2">
            Notepad 사용 시: Ctrl + S 로 저장
          </p>
        )}
      </StepItem>

      <StepItem number={6} title="Flask 실행 및 접속">
        <CodeBlock
          code={activeOs === 'mac' ? 'python3 app.py' : 'python app.py'}
          onCopy={onCopy}
        />
        <p className="text-sm mt-2">
          실행 후 브라우저에서{' '}
          <a
            href="http://127.0.0.1:5000"
            className="text-accent-primary1 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            http://127.0.0.1:5000/
          </a>{' '}
          으로 접속하여 "hello"가 출력되는지 확인합니다.
        </p>
      </StepItem>

      <StepItem number={7} title="서버 중단">
        <p className="text-sm">
          터미널에서 <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl</kbd> +{' '}
          <kbd className="bg-gray-700 px-2 py-1 rounded">C</kbd> 를 눌러
          종료합니다.
        </p>
      </StepItem>
    </div>
  </div>
);

const PhpContent = ({
  activeOs,
  onOsChange,
  onCopy,
}: {
  activeOs: OsType;
  onOsChange: (os: OsType) => void;
  onCopy: (text: string) => void;
}) => (
  <div className="animate-fade-in text-gray-300">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-white mb-2">PHP 내장 서버</h2>
      <p className="text-gray-400">
        간단한 PHP 실습을 위한 내장 웹 서버 실행 방법입니다.
      </p>
    </div>

    <OsToggle activeOs={activeOs} onChange={onOsChange} />

    <div className="space-y-8">
      <StepItem number={1} title="PHP 설치 확인">
        <CodeBlock code="php -V" onCopy={onCopy} />

        {activeOs === 'mac' ? (
          <div className="mt-2 text-sm">
            <p>설치가 안 되어 있다면 Homebrew로 설치합니다:</p>
            <CodeBlock code="brew install php" onCopy={onCopy} />
          </div>
        ) : (
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-900/50 rounded-lg">
            <h4 className="font-semibold text-blue-400 mb-2">
              XAMPP 설치 및 환경변수 설정
            </h4>
            <ol className="list-decimal list-inside text-sm space-y-2 text-gray-300">
              <li>
                <a
                  href="https://www.apachefriends.org/"
                  target="_blank"
                  className="text-accent-primary1 underline"
                  rel="noreferrer"
                >
                  XAMPP for Windows
                </a>{' '}
                다운로드 및 설치 (Apache, MySQL, PHP 필수 체크)
              </li>
              <li>
                환경변수 편집: <code>C:\xampp\php</code> 경로를 Path에 추가
              </li>
              <li>
                새 CMD 창에서 <code>php -V</code> 입력하여 설치 확인
              </li>
            </ol>
          </div>
        )}
      </StepItem>

      <StepItem number={2} title="PHP 서버 실행">
        <p className="mb-2 text-sm">
          <code>static/upload</code> 경로 안에 실행할 .php 파일이 있어야 합니다.
        </p>
        <CodeBlock
          code="php -S 127.0.0.1:8000 -t static/upload"
          onCopy={onCopy}
        />
      </StepItem>

      <StepItem number={3} title="포트 충돌 해결">
        <p className="mb-2 text-sm">
          이미 8000번 포트를 사용 중이라면 포트 번호를 변경합니다 (예: 9000).
        </p>
        <CodeBlock
          code="php -S 127.0.0.1:9000 -t static/upload"
          onCopy={onCopy}
        />
      </StepItem>
    </div>
  </div>
);

const GuideContent = () => (
  <div className="animate-fade-in text-gray-300 grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* 이론학습 실습문제 가이드 */}
    <div className="bg-[#222] p-6 rounded-xl border border-gray-700">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
        <ShieldAlert className="w-8 h-8 text-red-500" />
        <h3 className="text-xl font-bold text-white">
          이론학습 실습문제 가이드
        </h3>
      </div>

      <ul className="space-y-4">
        <li className="flex gap-3">
          <Monitor className="w-5 h-5 text-accent-primary1 shrink-0 mt-1" />
          <div>
            <strong className="text-white">로컬 환경 준수</strong>
            <p className="text-sm text-gray-400 mt-1">
              모든 실습(Flask, PHP)은 반드시 로컬(localhost)에서만 실행해야
              합니다. 외부 네트워크 접근은 금지합니다.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
          <div>
            <strong className="text-white">악성 파일 업로드 금지</strong>
            <p className="text-sm text-gray-400 mt-1">
              실습용 악성 파일이나 웹셸을 실제 운영 중인 서버나 호스팅에 절대
              업로드하지 마세요.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
          <div>
            <strong className="text-white">실습 후 삭제</strong>
            <p className="text-sm text-gray-400 mt-1">
              학습이 끝난 후 생성된 테스트 파일들은 즉시 삭제할 것을 권장합니다.
            </p>
          </div>
        </li>
        <li className="p-3 bg-red-900/10 border border-red-900/30 rounded text-xs text-red-300">
          교육 목적 외 사용 시 모든 책임은 본인에게 있으며, Hack ‘n’ Learn은
          이에 대한 책임을 지지 않습니다.
        </li>
      </ul>
    </div>

    {/* 실전문제 가이드 */}
    <div className="bg-[#222] p-6 rounded-xl border border-gray-700">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
        <Flag className="w-8 h-8 text-accent-primary1" />
        <h3 className="text-xl font-bold text-white">실전문제 가이드</h3>
      </div>

      <ul className="space-y-4">
        <li className="flex gap-3">
          <div className="bg-gray-800 p-2 rounded shrink-0 h-fit">
            <span className="font-mono text-accent-primary1 font-bold">
              FLAG{`{...}`}
            </span>
          </div>
          <div>
            <strong className="text-white">FLAG 형식</strong>
            <p className="text-sm text-gray-400 mt-1">
              정답은 <code>FLAG{`{찾은값}`}</code> 형식으로 제출합니다.
              <br />
              예: 찾은 값이 <code>Hello</code>라면 <code>FLAG{`{Hello}`}</code>{' '}
              입력
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
          <div>
            <strong className="text-white">CTF 방식 및 힌트</strong>
            <p className="text-sm text-gray-400 mt-1">
              각 문제는 독립적이며 취약점별로 1개의 Flag가 존재합니다.
              <br />
              힌트는 3단계이며, 열람 시 <strong>-10점</strong>, 오답 제출 시{' '}
              <strong>-10점</strong>이 차감됩니다.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-1" />
          <div>
            <strong className="text-white">AI 해설 제공</strong>
            <p className="text-sm text-gray-400 mt-1">
              문제를 맞히면 결과 페이지에서 상세한 AI 해설을 볼 수 있습니다.
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
);

const StepItem = ({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex gap-4">
    <div className="shrink-0 w-8 h-8 rounded-full  flex items-center justify-center font-bold text-primary-text">
      {number}
    </div>
    <div className="grow">
      <h3 className="text-lg font-semibold text-primary-text mb-2">{title}</h3>
      <div className="text-secondary-text">{children}</div>
    </div>
  </div>
);
