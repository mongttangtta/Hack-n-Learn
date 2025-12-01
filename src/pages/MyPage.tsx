import { type ReactNode, useEffect, useState } from 'react';
import CircularProgress from '../components/CircularProgress';
import { ArrowRight, Settings, Award, Trash } from 'lucide-react';
import { fetchMyPageData } from '../services/userService';
import { getWrongNote, deleteWrongNote } from '../services/wrongNoteService';
import type {
  MyPageData,
  Profile,
  QuizProgress,
  Practice,
  WrongNote,
} from '../types/mypage';
import EditProfileModal from '../components/EditProfileModal';
import Modal from '../components/Modal';
import { useAuthStore } from '../store/authStore';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';

// 프로필 섹션
const UserProfile = ({
  profile,
  onEditClick,
}: {
  profile: Profile | null;
  onEditClick: () => void;
}) => {
  if (!profile) return <Spinner />;

  const getTierColorClass = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze':
        return 'text-award-bronze';
      case 'silver':
        return 'text-award-silver';
      case 'gold':
        return 'text-award-gold';
      case 'platinum':
        return 'text-award-platinum';
      case 'diamond':
        return 'text-award-diamond';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-col items-center text-center my-12 relative bg-card-background p-5 rounded-lg border border-gray-700">
      {/* 프로필 이미지 */}
      <div className="relative mb-4 cursor-pointer" onClick={onEditClick}>
        <img
          src={profile.profileImageUrl}
          alt="프로필 이미지"
          className="w-32 h-32 rounded-full border-2 border-edge object-cover hover:opacity-80 transition-opacity"
        />
        <span className="absolute top-0 right-0 bg-edge border-4 border-card-background rounded-full p-1 text-xs">
          <Settings className="w-4.5 h-4.5 text-[#121212]" />
        </span>
      </div>
      {/* 사용자 정보 */}
      <h2 className="text-h3 font-bold text-primary-text">
        {profile.nickname}
      </h2>
      {profile.titles && profile.titles.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-2 mb-1">
          {profile.titles.map((title, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium text-accent-primary1 bg-accent-primary1/10 border border-accent-primary1 rounded-full"
            >
              {title}
            </span>
          ))}
        </div>
      )}
      <p className="text-secondary-text text-body uppercase">{profile.tier}</p>
      <div className="flex gap-1">
        <Award className={`w-5 h-5 mt-2 ${getTierColorClass(profile.tier)}`} />
      </div>
      <p className="text-sm text-secondary-text mt-2">
        Points: {profile.points}
      </p>
      {profile.rank && (
        <p className="text-sm text-secondary-text">Rank: {profile.rank}</p>
      )}
    </div>
  );
};

// 나의 학습 진도 카드
const ProgressCard = ({
  quizProgress,
  practice,
}: {
  quizProgress: QuizProgress | null;
  practice: Practice | null;
}) => {
  if (!quizProgress || !practice)
    return <Spinner />;

  // Determine last learned topic (example logic: first with progress > 0 or just the first one)
  const lastLearnedTopic =
    quizProgress.parts.find((p) => p.progress > 0) || quizProgress.parts[0];

  // Determine last practice (example logic: first in list)
  const lastPractice =
    practice.practiceList.length > 0 ? practice.practiceList[0] : null;

  return (
    <div className="bg-card-background p-6 rounded-lg border border-gray-700 h-full">
      <h3 className="text-body font-bold text-primary-text mb-6">
        나의 학습 진도
      </h3>
      <div className="flex justify-between items-start text-center gap-4">
        {/* 이론 학습 */}
        <div className="flex-1 flex flex-col items-center">
          <p className="mb-4 text-primary-text font-semibold">
            이론 학습 진행도
          </p>
          <CircularProgress
            percentage={Math.round(quizProgress.summary.progress)}
            colorStart="var(--color-accent-primary1)"
            colorEnd="var(--color-accent-primary2)"
          />
          <p className="text-secondary-text text-sm mt-4">
            {lastLearnedTopic ? (
              <>
                {lastLearnedTopic.title}
                <br />
                을(를){' '}
                {lastLearnedTopic.progress > 0
                  ? '학습 중입니다.'
                  : '시작해보세요.'}
              </>
            ) : (
              '학습 기록이 없습니다.'
            )}
          </p>
        </div>
        {/* 실전 문제 */}
        <div className="flex-1 flex flex-col items-center">
          <p className="mb-4 text-primary-text font-semibold">
            실전 문제 진행도
          </p>
          <CircularProgress
            percentage={Math.round(practice.successRate)}
            colorStart="var(--color-accent-warning)"
            colorEnd="var(--color-accent-caution)"
          />
          <p className="text-secondary-text text-sm mt-4">
            {lastPractice ? (
              <>
                최근 푼 문제:
                <br />
                {lastPractice.problem.slug}
              </>
            ) : (
              '아직 푼 문제가 없습니다.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

// 우측 카드 (재사용)
interface InfoCardProps {
  title: string;
  children: ReactNode;
}

const InfoCard = ({ title, children }: InfoCardProps) => (
  <div className="bg-card-background p-6 rounded-lg border border-gray-700">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-body font-bold text-primary-text">{title}</h3>
      <button className="text-secondary-text hover:text-primary-text">
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
    <div>{children}</div>
  </div>
);

// 마이페이지 전체
export default function MyPage() {
  const [data, setData] = useState<MyPageData | null>(null);
  const [wrongNotes, setWrongNotes] = useState<WrongNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<WrongNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { user, updateUser } = useAuthStore();

  useEffect(() => {
    const fetchDataAndRanking = async () => {
      setLoading(true);
      setError(null);
      try {
        const [myPageResponse, wrongNoteResponse] = await Promise.all([
          fetchMyPageData(),
          getWrongNote(),
        ]);

        if (wrongNoteResponse && wrongNoteResponse.success) {
          setWrongNotes(wrongNoteResponse.data);
        }

        if (myPageResponse.success && myPageResponse.data) {
          const combinedProfile: Profile = {
            ...myPageResponse.data.profile,
          };
          if (user?.tier && user.tier !== combinedProfile.tier) {
            setToastMessage(
              `티어가 '${combinedProfile.tier}'(으)로 변경되었습니다!`
            );
            setShowToast(true);
          }

          if (user?.titles && combinedProfile.titles) {
            const oldTitlesSet = new Set(user.titles);
            const newTitles = combinedProfile.titles.filter(
              (t) => !oldTitlesSet.has(t)
            );
            if (newTitles.length > 0) {
              setToastMessage(
                `새로운 칭호 '${newTitles.join(', ')}'을(를) 획득했습니다!`
              );
              setShowToast(true);
            }
          }

          updateUser({
            tier: combinedProfile.tier,
            titles: combinedProfile.titles || [],
            nickname: combinedProfile.nickname,
          });

          setData({
            ...myPageResponse.data,
            profile: combinedProfile,
          });
        } else {
          setError('Failed to load MyPage data');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndRanking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileUpdate = (newNickname: string, newImageUrl: string) => {
    if (data && data.profile) {
      setData({
        ...data,
        profile: {
          ...data.profile,
          nickname: newNickname,
          profileImageUrl: newImageUrl,
        },
      });
    }
  };

  const handleDeleteNote = async (
    e: React.MouseEvent<HTMLButtonElement>,
    noteId: string
  ) => {
    e.stopPropagation(); // Prevent opening the note detail modal
    try {
      await deleteWrongNote(noteId);
      setWrongNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== noteId)
      );
      setToastMessage('오답 노트가 삭제되었습니다.');
      setShowToast(true);
      // If the deleted note was currently selected and open in the modal, close the modal
      if (selectedNote && selectedNote._id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Failed to delete wrong note:', error);
      setToastMessage('오답 노트 삭제에 실패했습니다.');
      setShowToast(true);
    }
  };

  if (loading) {
    return <Spinner fullScreen />;
  }

  if (error) {
    return (
      <div className="bg-main min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-main min-h-screen">
      <main className="container mx-auto px-6 py-8">
        {/* 프로필 섹션 */}
        <UserProfile
          profile={data?.profile || null}
          onEditClick={() => setIsEditModalOpen(true)}
        />

        {/* 메인 대시보드 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 학습 진도 (lg 화면에서 1/3 차지) */}
          <div className="lg:col-span-1">
            <ProgressCard
              quizProgress={data?.quizProgress || null}
              practice={data?.practice || null}
            />
          </div>

          {/* 우측: 풀이 이력 & 오답 노트 (lg 화면에서 2/3 차지) */}
          <div className="lg:col-span-2 space-y-6">
            <InfoCard title="나의 풀이 이력">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 ">
                  <h4 className="text-sm font-semibold text-secondary-text mb-2">
                    실전 문제
                  </h4>
                  {data?.practice.practiceList &&
                  data.practice.practiceList.filter(
                    (item) => item.result === 'solved'
                  ).length > 0 ? (
                    data.practice.practiceList
                      .filter((item) => item.result === 'solved')
                      .map((item, index) => (
                        <p
                          key={index}
                          className="flex justify-between text-primary-text p-2 rounded-md cursor-pointer transition-colors hover:bg-gray-800"
                        >
                          <span>{item.problem.slug}</span>
                          <span>{item.score} 점</span>
                        </p>
                      ))
                  ) : (
                    <p className="text-secondary-text text-center py-2 text-sm">
                      해결한 실전 문제가 없습니다.
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm  font-semibold text-secondary-text mb-2">
                    이론 학습
                  </h4>
                  {data?.quizProgress.parts &&
                  data.quizProgress.parts.filter(
                    (part) =>
                      part.status === 'solved' || part.status === 'in_progress'
                  ).length > 0 ? (
                    data.quizProgress.parts
                      .filter(
                        (part) =>
                          part.status === 'solved' ||
                          part.status === 'in_progress'
                      )
                      .map((part, index) => (
                        <p
                          key={index}
                          className="flex justify-between text-primary-text p-2 rounded-md cursor-pointer transition-colors hover:bg-gray-800"
                        >
                          <span>{part.slug}</span>
                          <span className="text-sm text-secondary-text ">
                            {part.status === 'solved' ? '완료' : '진행 중'}
                          </span>
                        </p>
                      ))
                  ) : (
                    <p className="text-secondary-text text-center py-2 text-sm">
                      진행 중이거나 완료된 이론 학습이 없습니다.
                    </p>
                  )}
                </div>
              </div>
            </InfoCard>

            <InfoCard title="문제 오답노트">
              {wrongNotes.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {wrongNotes.map((note) => (
                    <div
                      key={note._id}
                      onClick={() => setSelectedNote(note)}
                      className="p-3 bg-main rounded cursor-pointer hover:bg-gray-800 transition-colors border border-gray-800 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm text-primary-text line-clamp-2">
                          {note.rawQuestion}
                        </p>
                        <p className="text-xs text-secondary-text mt-1">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteNote(e, note._id)}
                        className="text-red-500 hover:text-red-400 p-1"
                        aria-label="Delete note"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary-text text-center py-4">
                  오답 노트가 비어있습니다.
                </p>
              )}
            </InfoCard>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {data?.profile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentNickname={data.profile.nickname}
          currentProfileImage={data.profile.profileImageUrl}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      <Modal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        title="오답 상세"
      >
        {selectedNote && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <h4 className="text-sm font-semibold text-accent-primary1 mb-1">
                문제
              </h4>
              <p className="text-primary-text text-sm bg-main p-3 rounded border border-gray-700">
                {selectedNote.rawQuestion}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-1">
                  나의 답
                </h4>
                <p className="text-primary-text text-sm bg-main p-3 rounded border border-gray-700 break-all">
                  {selectedNote.userAnswer}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-1">
                  정답
                </h4>
                <p className="text-primary-text text-sm bg-main p-3 rounded border border-gray-700 break-all">
                  {selectedNote.correctAnswer}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-accent-primary2 mb-1">
                해설
              </h4>
              <div className="text-primary-text text-sm bg-main p-3 rounded border border-gray-700 leading-relaxed">
                {selectedNote.explanation}
              </div>
            </div>
            <div className="text-right text-xs text-secondary-text pt-2">
              {new Date(selectedNote.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </Modal>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
