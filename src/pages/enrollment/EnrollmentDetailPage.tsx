import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useEnrollment } from "@/hooks/useEnrollment";
import { Button } from "@/components/ui/button";
import StatusProgress from "./components/StatusProgress";
import DocumentUploadCard from "./components/DocumentUploadCard";
import DocumentViewCard from "./components/DocumentViewCard";

export default function EnrollmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { enrollment, documents, loading, error } = useEnrollment(id);

  const admissionDoc = documents.find((doc) => doc.document_type === "ADMISSION_LETTER");
  const invoiceDoc = documents.find((doc) => doc.document_type === "INVOICE");

  if (!user) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="pt-[140px] pb-20 px-6">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="bg-white rounded-[20px] p-10 border border-beige-dark shadow-lg">
              <h2 className="text-[1.3rem] font-extrabold text-brown-dark mb-3">
                로그인이 필요합니다
              </h2>
              <p className="text-brown text-[0.9rem] mb-6">
                수속 진행현황은 로그인 후 확인하실 수 있습니다.
              </p>
              <Button asChild>
                <Link to="/login" state={{ from: `/enrollment/${id}` }} className="no-underline">
                  로그인
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="pt-[140px] pb-20 px-6">
          <div className="max-w-[520px] mx-auto text-center">
            <p className="text-brown text-[0.9rem]">수속 정보를 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="pt-[140px] pb-20 px-6">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="bg-white rounded-[20px] p-10 border border-beige-dark shadow-lg">
              <h2 className="text-[1.3rem] font-extrabold text-brown-dark mb-3">
                수속 정보를 찾을 수 없습니다
              </h2>
              <p className="text-brown text-[0.9rem] mb-6">
                {error ?? "해당 수속 신청 내역이 존재하지 않습니다."}
              </p>
              <Button variant="secondary" asChild>
                <Link to="/my" className="no-underline">마이페이지로</Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const startDate = new Date(enrollment.start_date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + enrollment.duration_weeks * 7);

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-20 bg-white border-b border-beige-dark">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-brown">
            <Link to="/" className="hover:text-brown-dark no-underline text-brown">홈</Link>
            <span>/</span>
            <Link to="/my" className="hover:text-brown-dark no-underline text-brown">마이페이지</Link>
            <span>/</span>
            <span className="text-brown-dark font-medium">수속 진행현황</span>
          </div>
        </div>
      </div>

      <main className="max-w-[900px] mx-auto px-6 py-8 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-[1.5rem] md:text-[1.8rem] font-extrabold text-brown-dark tracking-tight mb-1">
            수속 진행현황
          </h1>
          <p className="text-brown text-[0.9rem]">
            수속 진행 상태와 필요 서류를 확인하세요.
          </p>
        </div>

        {/* Status Progress */}
        <section className="bg-white rounded-[20px] p-6 md:p-8 border border-beige-dark">
          <h2 className="font-bold text-brown-dark text-lg mb-5">진행 상태</h2>
          <StatusProgress currentStatus={enrollment.status} />
        </section>

        {/* Enrollment Info */}
        <section className="bg-white rounded-[20px] p-6 md:p-8 border border-beige-dark">
          <h2 className="font-bold text-brown-dark text-lg mb-5">수속 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-[0.75rem] text-muted-foreground mb-1">어학원</div>
              <div className="font-bold text-brown-dark">{enrollment.academy_name}</div>
            </div>
            <div>
              <div className="text-[0.75rem] text-muted-foreground mb-1">코스</div>
              <div className="font-bold text-brown-dark">{enrollment.course_name}</div>
            </div>
            <div>
              <div className="text-[0.75rem] text-muted-foreground mb-1">기숙사</div>
              <div className="font-bold text-brown-dark">{enrollment.dormitory_type}</div>
            </div>
            <div>
              <div className="text-[0.75rem] text-muted-foreground mb-1">연수 기간</div>
              <div className="font-bold text-brown-dark">{enrollment.duration_weeks}주</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-[0.75rem] text-muted-foreground mb-1">일정</div>
              <div className="font-bold text-brown-dark">
                {startDate.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                {" ~ "}
                {endDate.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
            {enrollment.student_note && (
              <div className="sm:col-span-2">
                <div className="text-[0.75rem] text-muted-foreground mb-1">요청사항</div>
                <div className="text-sm text-brown">{enrollment.student_note}</div>
              </div>
            )}
          </div>
        </section>

        {/* Student Documents Upload */}
        <section className="bg-white rounded-[20px] p-6 md:p-8 border border-beige-dark">
          <h2 className="font-bold text-brown-dark text-lg mb-2">서류 업로드</h2>
          <p className="text-sm text-muted-foreground mb-5">
            수속에 필요한 서류를 업로드해주세요. (현재 UI 미리보기 - 실제 저장은 추후 연동)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DocumentUploadCard
              title="항공권"
              description="e-티켓 또는 항공권 예약 확인서"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <DocumentUploadCard
              title="여행자 보험"
              description="해외여행자 보험 가입 확인서"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </section>

        {/* Admin Documents View */}
        <section className="bg-white rounded-[20px] p-6 md:p-8 border border-beige-dark">
          <h2 className="font-bold text-brown-dark text-lg mb-2">수속 서류</h2>
          <p className="text-sm text-muted-foreground mb-5">
            담당자가 업로드한 서류를 확인하세요.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DocumentViewCard
              title="입학허가서"
              description="어학원 발행 입학허가서 (LOA)"
              document={admissionDoc}
            />
            <DocumentViewCard
              title="인보이스"
              description="등록비 및 숙소비 인보이스"
              document={invoiceDoc}
            />
          </div>
        </section>

        {/* Back Link */}
        <div className="text-center">
          <Button variant="outline" asChild className="rounded-[10px]">
            <Link to="/my" className="no-underline">마이페이지로 돌아가기</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
