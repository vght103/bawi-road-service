import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useMember } from "@/hooks/useMember";
import { createIsland } from "@/lib/createIsland";
import { fetchMyEnrollments } from "@/api/enrollment/enrollments";
import type { Enrollment } from "@/types/enrollment";
import { STATUS_CONFIG } from "@/data/enrollment/status";
import { cn } from "@/lib/utils";
import LoadingOverlay from "@/components/LoadingOverlay";

function validatePassword(pw: string) {
  const errors: string[] = [];
  if (pw.length < 8) errors.push("8자 이상");
  if (!/\d/.test(pw)) errors.push("숫자 포함");
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) errors.push("특수기호 포함");
  return errors;
}

function MyPage() {
  const { user, signOut, changePassword, deleteAccount } = useAuth();
  const { member } = useMember();
  const { data: enrollments = [] as Enrollment[], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: async () => {
      const result = await fetchMyEnrollments(user!.id);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: !!user,
  });

  // 비밀번호 변경
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSubmitting, setPwSubmitting] = useState(false);

  // 회원 탈퇴
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [showDeleteSection, setShowDeleteSection] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);

    const pwErrors = validatePassword(newPassword);
    if (pwErrors.length > 0) {
      setPwError(`비밀번호: ${pwErrors.join(", ")} 필요`);
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setPwError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setPwSubmitting(true);
    const { error } = await changePassword(newPassword);
    setPwSubmitting(false);

    if (error) {
      setPwError(error);
      return;
    }

    setPwSuccess(true);
    setNewPassword("");
    setNewPasswordConfirm("");
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "회원탈퇴") {
      setDeleteError('"회원탈퇴"를 정확히 입력해주세요.');
      return;
    }

    setDeleteError("");
    setDeleteSubmitting(true);
    const { error } = await deleteAccount();
    setDeleteSubmitting(false);

    if (error) {
      setDeleteError(error);
      return;
    }

    window.location.href = "/";
  }

  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream px-4">
        <div className="text-center">
          <p className="mb-4 text-brown-text">로그인이 필요합니다.</p>
          <a href="/login">
            <Button className="bg-terracotta hover:bg-terracotta-hover text-white">로그인</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream">
      <LoadingOverlay visible={enrollmentsLoading || pwSubmitting || deleteSubmitting} />
      <div className="mx-auto w-full max-w-lg px-4 pt-22 pb-12">
        <h1 className="mb-8 text-2xl font-bold text-brown-text">마이페이지</h1>

        {/* 내 정보 */}
        <section className="mb-8 rounded-2xl border border-beige-dark bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-brown-text">내 정보</h2>
          <div className="space-y-2 text-sm text-brown">
            <p>
              <span className="font-medium text-brown-text">이름:</span> {member?.name ?? "-"}
            </p>
            <p>
              <span className="font-medium text-brown-text">이메일:</span> {user.email}
            </p>
            <p>
              <span className="font-medium text-brown-text">연락처:</span> {member?.phone ?? "-"}
            </p>
          </div>

          <Button
            onClick={async () => {
              await signOut();
              window.location.href = "/";
            }}
            variant="outline"
            className="w-full border-brown/30 text-brown hover:bg-beige mt-4"
          >
            로그아웃
          </Button>
        </section>

        {/* 내 수속 */}
        <section className="mb-8 rounded-2xl border border-beige-dark bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brown-text">내 수속</h2>

            {enrollments.length === 0 && (
              <Button asChild size="sm" variant="outline" className="text-xs">
                <a href="/enrollment/apply?from=my-page" className="no-underline">
                  새 수속 신청
                </a>
              </Button>
            )}
          </div>

          {enrollmentsLoading ? null : enrollments.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">아직 수속 신청 내역이 없습니다.</p>
              <Button asChild size="sm">
                <a href="/enrollment/apply?from=my-page" className="no-underline">
                  수속 신청하기
                </a>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment) => {
                const statusConfig = STATUS_CONFIG[enrollment.status];
                return (
                  <a
                    key={enrollment.id}
                    href={`/enrollment/${enrollment.id}`}
                    className="block p-4 rounded-xl border border-beige-dark hover:border-brown/30 transition-colors no-underline"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-brown-dark text-sm">{enrollment.academy_name}</span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[0.7rem] font-medium border",
                          statusConfig.bgColor,
                          statusConfig.color,
                        )}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {enrollment.course_name} · {enrollment.dormitory_type} · {enrollment.duration_weeks}주
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(enrollment.start_date).toLocaleDateString("ko-KR")} 시작
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </section>

        {/* 비밀번호 변경 */}
        <section className="mb-8 rounded-2xl border border-beige-dark bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-brown-text">비밀번호 변경</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {pwError && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{pwError}</div>}
            {pwSuccess && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">비밀번호가 변경되었습니다.</div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-brown-text font-medium">
                새 비밀번호
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="8자 이상, 숫자, 특수기호 포함"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPasswordConfirm" className="text-brown-text font-medium">
                새 비밀번호 확인
              </Label>
              <Input
                id="newPasswordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={pwSubmitting}
              className="bg-terracotta hover:bg-terracotta-hover text-white w-full"
            >
              {pwSubmitting ? "변경 중..." : "비밀번호 변경"}
            </Button>
          </form>
        </section>

        {/* 회원 탈퇴 */}
        <section className="rounded-2xl border border-red-200 bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-red-600">회원 탈퇴</h2>
          <p className="mb-4 text-sm text-brown">탈퇴 시 모든 개인정보가 즉시 삭제되며 복구할 수 없습니다.</p>

          {!showDeleteSection ? (
            <Button
              onClick={() => setShowDeleteSection(true)}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 w-full"
            >
              회원 탈퇴하기
            </Button>
          ) : (
            <div className="space-y-3">
              {deleteError && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{deleteError}</div>}
              <p className="text-sm font-medium text-red-600">탈퇴를 확인하려면 아래에 "회원탈퇴"를 입력해주세요.</p>
              <Input
                type="text"
                placeholder="회원탈퇴"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="border-red-300 focus-visible:ring-red-300"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteSubmitting ? "처리 중..." : "탈퇴 확인"}
                </Button>
                <Button
                  onClick={() => {
                    setShowDeleteSection(false);
                    setDeleteConfirm("");
                    setDeleteError("");
                  }}
                  variant="outline"
                  className="border-brown/30 text-brown"
                >
                  취소
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default createIsland(MyPage);
