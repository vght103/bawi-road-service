import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, CalendarIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchAcademies } from "@/api/academy/academies";
import type { Academy } from "@/data/academies";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { createEnrollment } from "@/api/enrollment/enrollments";
import type { EnrollmentInsert } from "@/types/enrollment";
import EnrollmentStepper from "./components/EnrollmentStepper";
import StepAcademySelect from "./components/StepAcademySelect";
import StepCourseSelect from "./components/StepCourseSelect";
import StepTermsAgreement from "./components/StepTermsAgreement";
import LoadingOverlay from "@/components/LoadingOverlay";

const STEPS = [
  { label: "어학원 선택", description: "관심 어학원" },
  { label: "상세 선택", description: "코스·기숙사·일정" },
  { label: "약관 동의", description: "이용약관·환불규정" },
];

export default function EnrollmentApplyPage() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get("from");

  const { user } = useAuth();
  const { data: academies = [], isLoading: academiesLoading } = useQuery<Academy[]>({
    queryKey: ["academies"],
    queryFn: fetchAcademies,
  });

  const [currentStep, setCurrentStep] = useState(0);

  // Step 1
  const [academyId, setAcademyId] = useState("");
  // Step 2
  const [courseIndex, setCourseIndex] = useState<number | "">("");
  const [dormIndex, setDormIndex] = useState<number | "">("");
  const [weeks, setWeeks] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  // Step 3
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [refundAgreed, setRefundAgreed] = useState(false);
  const [studentNote, setStudentNote] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const selectedAcademy = academies.find((academy) => academy.id === academyId);
  const selectedCourse = selectedAcademy && courseIndex !== "" ? selectedAcademy.courses[courseIndex] : null;
  const selectedDorm = selectedAcademy && dormIndex !== "" ? selectedAcademy.dormitories[dormIndex] : null;
  const weeksNum = Number(weeks) || 0;

  const endDate =
    startDate && weeksNum > 0
      ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + weeksNum * 7)
      : null;

  useEffect(() => {
    setCourseIndex("");
    setDormIndex("");
  }, [academyId]);

  function validateStep(step: number) {
    const errs: Record<string, string> = {};

    if (step === 0) {
      if (!academyId) errs.academy = "어학원을 선택해주세요.";
    } else if (step === 1) {
      if (courseIndex === "") errs.course = "코스를 선택해주세요.";
      if (dormIndex === "") errs.dorm = "기숙사 타입을 선택해주세요.";
      if (!startDate) errs.startDate = "수업 시작 희망일을 선택해주세요.";
      if (!weeks.trim()) errs.weeks = "연수 기간을 입력해주세요.";
      else if (Number(weeks) < 1 || Number(weeks) > 52) errs.weeks = "1~52주 사이로 입력해주세요.";
    } else if (step === 2) {
      if (!termsAgreed) errs.terms = "이용약관에 동의해주세요.";
      if (!refundAgreed) errs.refund = "환불 규정에 동의해주세요.";
    }

    return errs;
  }

  function handleNext() {
    const errs = validateStep(currentStep);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }

  function handlePrev() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  async function handleSubmit() {
    const errs = validateStep(2);
    setErrors(errs);
    setSubmitError(null);
    if (Object.keys(errs).length > 0) return;

    if (!user) {
      setSubmitError("로그인이 필요합니다.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: EnrollmentInsert = {
        user_id: user.id,
        academy_id: academyId,
        academy_name: selectedAcademy!.name,
        course_name: selectedCourse!.name,
        dormitory_type: selectedDorm!.type,
        duration_weeks: weeksNum,
        start_date: startDate!.toISOString().split("T")[0],
        terms_agreed: termsAgreed,
        refund_policy_agreed: refundAgreed,
        student_note: studentNote || null,
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

  if (!user) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="pt-[140px] pb-20 px-6">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="bg-white rounded-[20px] p-10 border border-beige-dark shadow-lg">
              <h2 className="text-[1.3rem] font-extrabold text-brown-dark mb-3">로그인이 필요합니다</h2>
              <p className="text-brown text-[0.9rem] mb-6">수속 신청은 로그인 후 이용하실 수 있습니다.</p>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" asChild>
                  <Link to="/" className="no-underline">
                    홈으로
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/login" state={{ from: "/enrollment/apply" }} className="no-underline">
                    로그인
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (academiesLoading) {
    return <LoadingOverlay visible />;
  }

  if (submitted) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="pt-[140px] pb-20 px-6">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="bg-white rounded-[20px] p-10 border border-beige-dark shadow-lg">
              <div className="w-16 h-16 bg-accent-green-light rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckIcon className="w-8 h-8 text-accent-green" strokeWidth={2.5} />
              </div>
              <h2 className="text-[1.5rem] font-extrabold text-brown-dark mb-3">수속 신청이 완료되었습니다</h2>
              <p className="text-brown text-[0.9rem] leading-relaxed mb-2">
                <span className="font-bold text-brown-dark">{selectedAcademy?.name}</span>
                <br />
                수속 신청이 정상적으로 접수되었습니다.
              </p>
              <p className="text-brown-light text-[0.82rem] mb-6">담당자 확인 후 연락드리겠습니다. (1~2 영업일)</p>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" asChild>
                  <Link to="/" className="no-underline">
                    홈으로
                  </Link>
                </Button>
                {createdId && (
                  <Button asChild>
                    <Link to={`/enrollment/${createdId}`} className="no-underline">
                      진행현황 보기
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <LoadingOverlay visible={submitting} />
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-20 bg-white border-b border-beige-dark">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-brown">
            <Link to="/" className="hover:text-brown-dark no-underline text-brown">
              홈
            </Link>
            <span>/</span>
            <span className="text-brown-dark font-medium">수속 신청</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[20px] p-6 md:p-8 border border-beige-dark">
              <h1 className="text-[1.5rem] md:text-[1.8rem] font-extrabold text-brown-dark tracking-tight mb-1">
                수속 신청
              </h1>
              <p className="text-brown text-[0.9rem] mb-6">어학원과 코스를 선택하고 수속을 신청하세요.</p>

              <EnrollmentStepper currentStep={currentStep} steps={STEPS} />

              {/* Step Content */}
              {currentStep === 0 && (
                <StepAcademySelect
                  academies={academies}
                  academyId={academyId}
                  onSelect={setAcademyId}
                  error={errors.academy}
                />
              )}

              {currentStep === 1 && (
                <StepCourseSelect
                  academy={selectedAcademy}
                  courseIndex={courseIndex}
                  onCourseSelect={setCourseIndex}
                  dormIndex={dormIndex}
                  onDormSelect={setDormIndex}
                  weeks={weeks}
                  onWeeksChange={setWeeks}
                  startDate={startDate}
                  onStartDateChange={setStartDate}
                  errors={errors}
                />
              )}

              {currentStep === 2 && (
                <StepTermsAgreement
                  termsAgreed={termsAgreed}
                  onTermsChange={setTermsAgreed}
                  refundAgreed={refundAgreed}
                  onRefundChange={setRefundAgreed}
                  studentNote={studentNote}
                  onNoteChange={setStudentNote}
                  errors={errors}
                />
              )}

              {/* Navigation */}
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

                {currentStep < STEPS.length - 1 ? (
                  <Button type="button" onClick={handleNext} className="rounded-[10px]">
                    다음
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSubmit} disabled={submitting} className="rounded-[10px]">
                    {submitting ? "신청 중..." : "수속 신청하기"}
                  </Button>
                )}
              </div>

              {submitError && <p className="text-terracotta text-[0.8rem] text-center mt-4">{submitError}</p>}
            </div>
          </div>

          {/* Right: Summary */}
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

      <Footer />
    </div>
  );
}
