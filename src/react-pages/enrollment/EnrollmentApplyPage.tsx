import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, CalendarIcon } from "lucide-react";
import { fetchAcademies } from "@/api/academy/academies";
import { createIsland } from "@/lib/createIsland";
import type { Academy } from "@/data/academies";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { createEnrollment } from "@/api/enrollment/enrollments";
import type { EnrollmentInsert } from "@/types/enrollment";
import { enrollmentSchema, STEP_FIELDS } from "./enrollmentSchema";
import type { EnrollmentFormValues } from "./enrollmentSchema";
import EnrollmentStepper from "./components/EnrollmentStepper";
import StepAcademySelect from "./components/StepAcademySelect";
import StepCourseSelect from "./components/StepCourseSelect";
import StepTermsAgreement from "./components/StepTermsAgreement";
import LoadingOverlay from "@/components/LoadingOverlay";

// 어학원 선택 → 상세 선택(코스·기숙사·일정) → 약관 동의 순서로 진행
const STEPS = [
  { label: "어학원 선택", description: "관심 어학원" },
  { label: "상세 선택", description: "코스·기숙사·일정" },
  { label: "약관 동의", description: "이용약관·환불규정" },
];

// 3단계 폼(어학원 선택 → 상세 선택 → 약관 동의)을 통해 수속을 신청하는 페이지
function EnrollmentApplyPage() {
  const source = new URLSearchParams(window.location.search).get("from"); // 유입 경로 추적
  const { user } = useAuth();

  const { data: academies = [], isLoading: academiesLoading } = useQuery<Academy[]>({
    queryKey: ["academies"],
    queryFn: fetchAcademies,
  });

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      academyId: "",
      weeks: "",
      termsAgreed: false as never, // 초기값은 false, 스키마는 literal(true)
      refundAgreed: false as never,
      studentNote: "",
    },
  });

  const { watch, trigger, resetField, getValues, handleSubmit: rhfHandleSubmit } = form;

  const [currentStep, setCurrentStep] = useState(0); // 0: 어학원 선택, 1: 상세 선택, 2: 약관 동의
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null); // 생성된 수속 ID

  const academyId = watch("academyId");
  const courseIndex = watch("courseIndex");
  const dormIndex = watch("dormIndex");
  const weeks = watch("weeks");
  const startDate = watch("startDate");
  const termsAgreed = watch("termsAgreed");
  const refundAgreed = watch("refundAgreed");

  const selectedAcademy = academies.find((academy) => academy.id === academyId);
  const selectedCourse = selectedAcademy && courseIndex !== undefined ? selectedAcademy.courses[courseIndex] : null;
  const selectedDorm = selectedAcademy && dormIndex !== undefined ? selectedAcademy.dormitories[dormIndex] : null;
  const weeksNum = Number(weeks) || 0;

  // 수업 종료 예상일 (시작일 + 연수 주 수 × 7일)
  const endDate =
    startDate && weeksNum > 0
      ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + weeksNum * 7)
      : null;

  // 어학원이 바뀌면 코스·기숙사 선택 초기화
  useEffect(() => {
    resetField("courseIndex");
    resetField("dormIndex");
  }, [academyId, resetField]);

  // 유효성 검사 통과 시 다음 단계로 이동
  async function handleNext() {
    const valid = await trigger(STEP_FIELDS[currentStep]);
    if (!valid) return;
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }

  function handlePrev() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  // 최종 제출: 유효성 검사 → 서버 전송 → 완료 화면 전환
  async function onSubmit(values: EnrollmentFormValues) {
    setSubmitError(null);

    if (!user) {
      setSubmitError("로그인이 필요합니다.");
      return;
    }

    const academy = academies.find((academy) => academy.id === values.academyId);
    const course = academy?.courses[values.courseIndex];
    const dorm = academy?.dormitories[values.dormIndex];

    setSubmitting(true);
    try {
      const payload: EnrollmentInsert = {
        user_id: user.id,
        academy_id: values.academyId,
        academy_name: academy!.name,
        course_name: course!.name,
        dormitory_type: dorm!.type,
        duration_weeks: Number(values.weeks),
        start_date: values.startDate.toISOString().split("T")[0], // "YYYY-MM-DD" 형식
        terms_agreed: values.termsAgreed,
        refund_policy_agreed: values.refundAgreed,
        student_note: values.studentNote || null,
        source,
      };

      const { data, error } = await createEnrollment(payload);
      if (error) {
        setSubmitError("수속 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setSubmitting(false);
        return;
      }

      setCreatedId(data?.id ?? null);
      setSubmitted(true);
    } catch {
      setSubmitError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  // handleSubmit 래퍼: 마지막 단계 검증 후 onSubmit 호출
  async function handleFormSubmit() {
    const valid = await trigger(STEP_FIELDS[2]);
    if (!valid) return;
    await rhfHandleSubmit(onSubmit)();
  }

  // 로그인하지 않은 경우
  if (!user) {
    return (
      <div className="bg-cream min-h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="px-6 py-12">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="bg-white rounded-[20px] p-10 border border-beige-dark shadow-lg">
              <h2 className="text-[1.3rem] font-extrabold text-brown-dark mb-3">로그인이 필요합니다</h2>
              <p className="text-brown text-[0.9rem] mb-6">수속 신청은 로그인 후 이용하실 수 있습니다.</p>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" asChild>
                  <a href="/" className="no-underline">
                    홈으로
                  </a>
                </Button>
                <Button asChild>
                  {/* 로그인 후 수속 신청 페이지로 돌아올 수 있도록 from 파라미터 포함 */}
                  <a href={"/login?from=" + encodeURIComponent("/enrollment/apply")} className="no-underline">
                    로그인
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (academiesLoading) {
    return <LoadingOverlay visible />;
  }

  // 신청 완료 후 완료 안내 화면
  if (submitted) {
    const submittedAcademy = academies.find((academy) => academy.id === getValues("academyId"));

    return (
      <div className="bg-cream min-h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="px-6 py-12">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="bg-white rounded-[20px] p-10 border border-beige-dark shadow-lg">
              <div className="w-16 h-16 bg-accent-green-light rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckIcon className="w-8 h-8 text-accent-green" strokeWidth={2.5} />
              </div>
              <h2 className="text-[1.5rem] font-extrabold text-brown-dark mb-3">수속 신청이 완료되었습니다</h2>
              <p className="text-brown text-[0.9rem] leading-relaxed mb-2">
                <span className="font-bold text-brown-dark">{submittedAcademy?.name}</span>
                <br />
                수속 신청이 정상적으로 접수되었습니다.
              </p>
              <p className="text-brown-light text-[0.82rem] mb-6">담당자 확인 후 연락드리겠습니다. (1~2 영업일)</p>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" asChild>
                  <a href="/" className="no-underline">
                    홈으로
                  </a>
                </Button>
                {createdId && (
                  <Button asChild>
                    <a href={`/enrollment/${createdId}`} className="no-underline">
                      진행현황 보기
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <LoadingOverlay visible={submitting} />

      {/* 브레드크럼 (홈 > 수속 신청) */}
      <div className="bg-white border-b border-beige-dark">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-brown">
            <a href="/" className="hover:text-brown-dark no-underline text-brown">
              홈
            </a>
            <span>/</span>
            <span className="text-brown-dark font-medium">수속 신청</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* 좌측: 신청 폼 (3/5), 우측: 신청 요약 (2/5) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[20px] p-6 md:p-8 border border-beige-dark">
              <h1 className="text-[1.5rem] md:text-[1.8rem] font-extrabold text-brown-dark tracking-tight mb-1">
                수속 신청
              </h1>
              <p className="text-brown text-[0.9rem] mb-6">어학원과 코스를 선택하고 수속을 신청하세요.</p>

              <EnrollmentStepper currentStep={currentStep} steps={STEPS} />

              <FormProvider {...form}>
                {currentStep === 0 && <StepAcademySelect academies={academies} />}

                {currentStep === 1 && <StepCourseSelect academy={selectedAcademy} />}

                {currentStep === 2 && <StepTermsAgreement />}
              </FormProvider>

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="rounded-[10px]"
                >
                  이전
                </Button>

                {/* 마지막 단계가 아니면 "다음", 마지막이면 "수속 신청하기" */}
                {currentStep < STEPS.length - 1 ? (
                  <Button type="button" onClick={handleNext} className="rounded-[10px]">
                    다음
                  </Button>
                ) : (
                  <Button type="button" onClick={handleFormSubmit} disabled={submitting} className="rounded-[10px]">
                    {submitting ? "신청 중..." : "수속 신청하기"}
                  </Button>
                )}
              </div>

              {submitError && <p className="text-terracotta text-[0.8rem] text-center mt-4">{submitError}</p>}
            </div>
          </div>

          {/* 우측: 신청 요약 (스크롤해도 고정) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-[20px] p-6 border border-beige-dark shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent-green" />
                <h3 className="font-bold text-brown-dark text-lg mb-5">신청 요약</h3>

                {selectedAcademy ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-[0.75rem] text-muted-foreground mb-1">어학원</div>
                      <div className="font-bold text-brown-dark">{selectedAcademy.name}</div>
                      <div className="text-[0.75rem] text-muted-foreground">
                        {selectedAcademy.region} · {selectedAcademy.academy_system}
                      </div>
                    </div>

                    {selectedCourse && (
                      <div>
                        <div className="text-[0.75rem] text-muted-foreground mb-1">코스</div>
                        <div className="font-bold text-brown-dark">{selectedCourse.name}</div>
                      </div>
                    )}

                    {selectedDorm && (
                      <div>
                        <div className="text-[0.75rem] text-muted-foreground mb-1">기숙사</div>
                        <div className="font-bold text-brown-dark">{selectedDorm.type}</div>
                      </div>
                    )}

                    {(startDate || weeksNum > 0) && (
                      <div>
                        <div className="text-[0.75rem] text-muted-foreground mb-1">일정</div>
                        {startDate && (
                          <div className="font-bold text-brown-dark">
                            {startDate.toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                            {endDate && (
                              <>
                                {" ~ "}
                                {endDate.toLocaleDateString("ko-KR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </>
                            )}
                          </div>
                        )}
                        {weeksNum > 0 && <div className="text-[0.75rem] text-muted-foreground">{weeksNum}주</div>}
                      </div>
                    )}

                    {termsAgreed && refundAgreed && (
                      <div className="pt-3 border-t border-beige-dark">
                        <div className="flex items-center gap-1.5 text-sm text-accent-green">
                          <CheckIcon className="w-4 h-4" />
                          <span>약관 동의 완료</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarIcon className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      어학원과 코스를 선택하면
                      <br />
                      요약 정보가 표시됩니다
                    </p>
                  </div>
                )}

                <div className="mt-6 p-3 bg-accent rounded-[10px]">
                  <p className="text-[0.75rem] text-accent-foreground leading-relaxed">
                    수속 신청 후 담당자가 확인하여 연락드립니다. 진행 상황은 마이페이지에서 확인하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default createIsland(EnrollmentApplyPage);
