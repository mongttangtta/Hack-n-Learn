import { useState, useEffect, useCallback } from 'react'; // Add useCallback
import { useBlocker, useNavigate } from 'react-router-dom'; // Import useBlocker, useNavigate
import LogBox from '../components/Challenge/Logbox';
import ChallengeHeader from '../components/Challenge/ChallengeHeader';
import type { LogEntry, HintData } from '../types/logs';
import Button from '../components/Button';

const CORRECT_FLAG = 'test_flag'; // Define CORRECT_FLAG for testing

export default function ChallengeDetailPage() {
  const [score, setScore] = useState<number>(100);
  const [flagValue, setFlagValue] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [nextHintIndex, setNextHintIndex] = useState<number>(0);
  const [shouldBlock, setShouldBlock] = useState<boolean>(true); // State to control blocking
  const navigate = useNavigate(); // Initialize useNavigate

  // Use useBlocker for in-app navigation
  const blocker = useBlocker(useCallback(() => shouldBlock, [shouldBlock]));

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const autoConfirm = window.confirm(
        '변경사항이 저장되지 않을 수 있습니다. 정말로 페이지를 떠나시겠습니까?'
      );
      if (autoConfirm) {
        // User confirmed, proceed with navigation
        setShouldBlock(false); // Allow navigation
        blocker.proceed();
      } else {
        // User cancelled, reset blocker
        blocker.reset();
      }
    }
  }, [blocker, shouldBlock]);

  // Keep useEffect for browser tab close/external navigation
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldBlock) {
        // Only block if shouldBlock is true
        event.preventDefault();
        event.returnValue =
          '변경사항이 저장되지 않을 수 있습니다. 정말로 페이지를 떠나시겠습니까?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldBlock]); // Add shouldBlock to dependency array

  /** 힌트 요청 처리 */
  const handleHintRequest = () => {
    if (nextHintIndex >= hintDatabase.length) {
      setLogs((prev) => [
        ...prev,
        {
          type: 'feedback',
          text: '더 이상 제공할 힌트가 없습니다.',
          cost: 0,
        },
      ]);
      return;
    }

    const hint = hintDatabase[nextHintIndex];

    // 1. 점수 차감
    setScore((prev) => Math.max(0, prev - hint.cost));

    // 2. 로그 추가 (액션 + 힌트 내용)
    setLogs((prev) => [
      ...prev,
      {
        type: 'action',
        text: `[ AI 힌트 요청 (${hint.cost}점 차감) ]`,
        cost: hint.cost,
      },
      {
        type: 'hint',
        text: `[ ${hint.level}단계 힌트 ] ${hint.text}`,
        cost: 0,
      },
    ]);

    // 3. 다음 힌트 인덱스 증가
    setNextHintIndex((prev) => prev + 1);
  };

  /** 정답 제출 처리 */
  const handleAnswerSubmit = () => {
    if (flagValue === CORRECT_FLAG) {
      // 정답
      alert('정답입니다! 결과 화면으로 이동합니다.');
      setLogs((prev) => [
        ...prev,
        {
          type: 'action',
          text: `[ 정답입니다! (점수 ${score}점 획득) ]`,
          cost: 0,
        },
      ]);
      setShouldBlock(false); // Allow navigation
      setTimeout(() => {
        navigate('/challenge/result', { state: { score } }); // Navigate to ChallengeResultPage with score
      }, 0);
    } else {
      // 오답
      const penalty = 10;
      setScore((prev) => Math.max(0, prev - penalty));
      setLogs((prev) => [
        ...prev,
        {
          type: 'feedback',
          text: `flag값이 올바르지 않습니다 (${penalty}점 차감)`,
          cost: penalty,
        },
      ]);
    }
  };

  return (
    <div className=" min-h-screen text-primary-text">
      <ChallengeHeader
        title="Challenge Title"
        subtitle="Challenge Subtitle"
        score={score}
      />
      <main className="max-w-[1440px] mx-auto px-6 py-12">
        {/* 시나리오 및 목표 */}
        <section className="mb-10 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">시나리오</h2>
            <p>로그인 페이지에서 SQLi 취약점 이용...</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">목표</h2>
            <p>관리자(admin) 계정으로 로그인하여...</p>
          </div>
        </section>

        {/* 참고 이미지 (Placeholder) */}
        <section className="mb-10">
          <div className="border-2 border-dashed border-gray-600 rounded-lg h-60 flex items-center justify-center text-gray-500">
            [ 참고 이미지 / 다이어그램 ]
          </div>
        </section>

        {/* 입력 및 버튼 영역 */}
        <section className="space-y-4">
          {/* 타겟 URL 입력창 (Disabled) */}
          <div className="flex items-center bg-code-bg border border-edge rounded-[10px] overflow-hidden">
            <span className="pl-5 pr-3 text-primary-text flex-shrink-0">
              타겟 URL:
            </span>
            <input
              type="text"
              value="http://abc.challenge.com/login.php"
              disabled
              className="flex-grow bg-transparent py-2 pr-5 text-secondary-text outline-none whitespace-nowrap overflow-x-auto"
            />
          </div>

          {/* Flag 입력창 */}
          <input
            type="text"
            value={flagValue}
            onChange={(e) => setFlagValue(e.target.value)}
            placeholder="Flag 값을 입력하세요 (예: flag{...})"
            className="
              w-full bg-code-bg border border-edge rounded-[10px]
              px-5 py-2 placeholder-secondary-text text-primary-text
              focus:outline-none focus:border-accent-primary1 focus:ring-1 focus:ring-accent-primary1
            "
          />

          {/* 버튼 그룹 */}
          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={handleHintRequest}
              className="
              "
            >
              AI 힌트 요청
            </Button>
            <Button onClick={handleAnswerSubmit} className="">
              정답 확인
            </Button>
          </div>
        </section>

        {/* 로그 박스 */}
        <LogBox logs={logs} />
      </main>
    </div>
  );
}
