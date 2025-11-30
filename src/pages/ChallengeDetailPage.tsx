import { useState, useEffect, useRef } from 'react'; // Add useCallback, useRef
import { useNavigate, useParams } from 'react-router-dom'; // Import useBlocker, useNavigate
import LogBox from '../components/Challenge/Logbox';
import ChallengeHeader from '../components/Challenge/ChallengeHeader';
import type { LogEntry } from '../types/logs';
import Button from '../components/Button';
import { problemService } from '../services/problemService';
import type { ProblemDetail, ContainerEvent } from '../types/problem';

// const CORRECT_FLAG = 'test_flag'; // Define CORRECT_FLAG for testing - no longer needed with API

// Removed hardcoded hintDatabase as hints will now be fetched from the API

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [problemDetail, setProblemDetail] = useState<ProblemDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLabStarted, setIsLabStarted] = useState<boolean>(false);
  const [labUrl, setLabUrl] = useState<string>('');

  const [score, setScore] = useState<number>(100);
  const [flagValue, setFlagValue] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [nextHintIndex, setNextHintIndex] = useState<number>(0); // Represents the next hint stage to request (1-indexed)
  const [, setShouldBlock] = useState<boolean>(true); // State to control blocking
  const navigate = useNavigate(); // Initialize useNavigate

  const lastEventTimestampRef = useRef<string | null>(null);

  // Fetch problem details
  useEffect(() => {
    const fetchProblemDetail = async () => {
      if (!id) {
        setError('Problem ID is missing.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await problemService.getProblemDetail(id);
        if (response.success) {
          setProblemDetail(response.data);
        } else {
          setError(response.message || 'Failed to load problem details.');
        }
      } catch (err) {
        setError('An error occurred while fetching problem details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblemDetail();
  }, [id]);

  // Poll for container events
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchEvents = async () => {
      if (!id) return;
      try {
        const response = await problemService.getContainerEvents(id);
        if (response.success && response.data.length > 0) {
          const newEvents = response.data.filter((event: ContainerEvent) => {
            if (!lastEventTimestampRef.current) return true;
            return (
              new Date(event.timestamp) >
              new Date(lastEventTimestampRef.current)
            );
          });

          if (newEvents.length > 0) {
            // Update last timestamp
            lastEventTimestampRef.current =
              newEvents[newEvents.length - 1].timestamp;

            // Add new events to logs
            setLogs((prev) => {
              const newLogEntries: LogEntry[] = newEvents.map(
                (event: ContainerEvent) => ({
                  type: 'info', // Or determine type based on event.type
                  text: `[${new Date(event.timestamp).toLocaleTimeString()}] ${
                    event.type
                  }: ${event.details}`,
                  cost: 0,
                })
              );
              return [...prev, ...newLogEntries];
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch container events:', err);
      }
    };

    if (id && !isLoading && !error && isLabStarted) {
      // Only fetch events if lab is started
      fetchEvents(); // Initial fetch
      intervalId = setInterval(fetchEvents, 5000); // Poll every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, isLoading, error, isLabStarted]); // Add isLabStarted to dependency array

  // Use useBlocker for in-app navigation

  /** 힌트 요청 처리 */
  const handleHintRequest = async () => {
    if (!id) {
      alert('문제 ID를 찾을 수 없습니다.');
      return;
    }
    // Prevent requesting hints beyond a certain stage (e.g., 3 stages)
    // The API might return an empty array or an error if no more hints are available for a given stage
    if (nextHintIndex >= 3) {
      // Assuming a max of 3 stages for hints, based on user input "stage는 총 3단계 까지"
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

    try {
      // Request hint for the next stage (1-indexed)
      const response = await problemService.requestProblemHint(
        id,
        nextHintIndex + 1
      );

      if (response.success && response.data && response.data.hints.length > 0) {
        const { hints, penaltyApplied } = response.data;

        // 1. 점수 차감
        setScore((prev) => Math.max(0, prev - penaltyApplied));

        // 2. 로그 추가 (액션 + 힌트 내용)
        setLogs((prev) => {
          const newLogs: LogEntry[] = [
            ...prev,
            {
              type: 'action',
              text: `[ AI 힌트 요청 (${penaltyApplied}점 차감) ]`,
              cost: penaltyApplied,
            },
          ];
          hints.forEach((hint) => {
            newLogs.push({
              type: 'hint',
              // Use hint.content directly, level might not be directly available for each hint in the new structure
              text: `[ 힌트 ] ${hint.content}`,
              cost: 0,
            });
          });
          return newLogs;
        });

        // 3. 다음 힌트 인덱스 증가
        setNextHintIndex((prev) => prev + 1);
      } else {
        setLogs((prev) => [
          ...prev,
          {
            type: 'feedback',
            text: response.message || '힌트를 불러오는데 실패했습니다.',
            cost: 0,
          },
        ]);
      }
    } catch (error) {
      console.error('Error requesting hint:', error);
      alert('힌트 요청 중 오류가 발생했습니다.');
      setLogs((prev) => [
        ...prev,
        {
          type: 'feedback',
          text: '힌트 요청 중 오류 발생',
          cost: 0,
        },
      ]);
    }
  };

  /** 정답 제출 처리 */
  const handleAnswerSubmit = async () => {
    if (!id) {
      alert('문제 ID를 찾을 수 없습니다.');
      return;
    }

    try {
      const response = await problemService.submitProblemFlag(id, flagValue);

      if (response.success) {
        // 정답
        alert('정답입니다! 결과 화면으로 이동합니다.');
        const earnedScore = response.earnedScore || score; // Use earnedScore from response if available, else current score
        setLogs((prev) => [
          ...prev,
          {
            type: 'action',
            text: `[ 정답입니다! (점수 ${earnedScore}점 획득) ]`,
            cost: 0,
          },
        ]);
        setShouldBlock(false); // Allow navigation
        setTimeout(() => {
          navigate('/challenge/result', { state: { score: earnedScore } }); // Navigate to ChallengeResultPage with score
        }, 0);
      } else {
        // 오답
        const penalty = 10; // Assuming a default penalty for incorrect flags
        setScore((prev) => Math.max(0, prev - penalty));
        setLogs((prev) => [
          ...prev,
          {
            type: 'feedback',
            text: `${
              response.message || 'flag값이 올바르지 않습니다'
            } (${penalty}점 차감)`,
            cost: penalty,
          },
        ]);
      }
    } catch (error) {
      console.error('Error submitting flag:', error);
      alert('플래그 제출 중 오류가 발생했습니다.');
      // Optionally, add an error log entry
      setLogs((prev) => [
        ...prev,
        {
          type: 'feedback',
          text: '플래그 제출 중 오류 발생',
          cost: 0,
        },
      ]);
    }
  };

  /** 랩 환경 시작 처리 */
  const handleStartLab = async () => {
    if (!id) {
      alert('문제 ID를 찾을 수 없습니다.');
      return;
    }
    try {
      setLogs((prev) => [
        ...prev,
        { type: 'action', text: '[ 랩 환경을 시작합니다... ]', cost: 0 },
      ]);
      const response = await problemService.startLab(id);
      console.log('Start Lab Response:', response); // Debug log
      if (response.success) {
        setIsLabStarted(true);
        setLabUrl(response.url || ''); // Default to empty string if url is undefined
        setLogs((prev) => [
          ...prev,
          {
            type: 'feedback',
            text: `[ 랩 환경 시작 성공: ${response.url} ]`,
            cost: 0,
          },
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          {
            type: 'feedback',
            text: response.message || '랩 환경 시작에 실패했습니다.',
            cost: 0,
          },
        ]);
      }
    } catch (error) {
      console.error('Error starting lab:', error);
      alert('랩 환경 시작 중 오류가 발생했습니다.');
      setLogs((prev) => [
        ...prev,
        { type: 'feedback', text: '랩 환경 시작 중 오류 발생', cost: 0 },
      ]);
    }
  };

  /** 랩 환경 종료 처리 */
  const handleStopLab = async () => {
    if (!id) {
      alert('문제 ID를 찾을 수 없습니다.');
      return;
    }
    try {
      setLogs((prev) => [
        ...prev,
        { type: 'action', text: '[ 랩 환경을 종료합니다... ]', cost: 0 },
      ]);
      const response = await problemService.stopLab(id);
      console.log('Stop Lab Response:', response); // Debug log
      if (response.success) {
        setIsLabStarted(false);
        setLabUrl('');
        setLogs((prev) => [
          ...prev,
          { type: 'feedback', text: '[ 랩 환경 종료 성공 ]', cost: 0 },
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          {
            type: 'feedback',
            text: response.message || '랩 환경 종료에 실패했습니다.',
            cost: 0,
          },
        ]);
      }
    } catch (error) {
      console.error('Error stopping lab:', error);
      alert('랩 환경 종료 중 오류가 발생했습니다.');
      setLogs((prev) => [
        ...prev,
        { type: 'feedback', text: '랩 환경 종료 중 오류 발생', cost: 0 },
      ]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className=" min-h-screen text-primary-text">
      <ChallengeHeader
        title="Challenge Title"
        subtitle="Challenge Subtitle"
        score={score}
      />
      <main className="max-w-[1440px] mx-auto px-10 py-12">
        {/* 시나리오 및 목표 */}
        <section className="mb-10 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">시나리오</h2>
            <p className="whitespace-pre-wrap">{problemDetail?.scenario}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">목표</h2>
            <ul className="list-disc list-inside space-y-1">
              {problemDetail?.goals.map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
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
          {!isLabStarted ? (
            <Button onClick={handleStartLab} className="w-full">
              랩 환경 시작
            </Button>
          ) : (
            <Button onClick={handleStopLab} className="w-full bg-red-600 hover:bg-red-700">
              랩 환경 종료
            </Button>
          )}

          {/* 타겟 URL 입력창 (Disabled) */}
          <div className="flex items-center bg-code-bg border border-edge rounded-[10px] overflow-hidden">
            <span className="pl-5 pr-3 text-primary-text shrink-0">
              타겟 URL:
            </span>
            {isLabStarted ? (
              <a
                href={labUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="grow bg-transparent py-2 pr-5 text-accent-primary1 underline whitespace-nowrap overflow-x-auto"
              >
                {labUrl}
              </a>
            ) : (
              <span className="grow bg-transparent py-2 pr-5 text-secondary-text outline-none whitespace-nowrap overflow-x-auto">
                랩 환경을 시작해주세요.
              </span>
            )}
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
