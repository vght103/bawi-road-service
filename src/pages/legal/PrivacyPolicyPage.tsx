import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen pt-24 pb-20 px-5">
        <article className="max-w-[800px] mx-auto prose prose-neutral prose-sm leading-relaxed">
          <h1 className="text-2xl font-bold text-brown-dark mb-1">
            개인정보처리방침
          </h1>
          <p className="text-brown text-sm mb-10">시행일: 2025년 3월 1일</p>

          <p>
            바위로드(이하 &quot;회사&quot;)는 「개인정보 보호법」 제30조에 따라
            정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게
            처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.
          </p>

          {/* 제1조 */}
          <Section title="제1조 (개인정보의 처리 목적)">
            <p>
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하는
              개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이
              변경될 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는
              등 필요한 조치를 이행합니다.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>회원 가입 및 관리</strong>
                <br />
                회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증,
                회원 자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지,
                불만처리 등 민원처리, 분쟁 조정을 위한 기록 보존
              </li>
              <li>
                <strong>유학원 비교·중개 서비스 제공</strong>
                <br />
                필리핀 어학연수 유학원 정보 제공, 상담 연결 및 중개, 맞춤형
                서비스 제공
              </li>
              <li>
                <strong>1:1 상담 신청 처리</strong>
                <br />
                상담 신청 접수, 담당자 배정, 상담 이력 관리, 유학원 연결 서비스
                제공
              </li>
              <li>
                <strong>서비스 개선</strong>
                <br />
                신규 서비스 개발, 접속 빈도 파악, 서비스 이용 통계 분석
              </li>
            </ol>
          </Section>

          {/* 제2조 */}
          <Section title="제2조 (처리하는 개인정보 항목 및 수집 방법)">
            <p className="font-semibold mb-1">가. 수집 항목</p>
            <Table
              headers={["구분", "필수 항목", "선택 항목"]}
              rows={[
                ["회원 가입", "이름, 이메일 주소, 비밀번호", "전화번호"],
                [
                  "1:1 상담 신청",
                  "이름, 이메일 주소, 전화번호, 상담 내용",
                  "-",
                ],
                [
                  "서비스 이용 중 자동 수집",
                  "접속 IP, 쿠키, 이용 기록, 브라우저 종류",
                  "-",
                ],
              ]}
            />
            <p className="font-semibold mt-4 mb-1">나. 수집 방법</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                홈페이지 회원가입 및 서비스 이용 과정에서 이용자가 직접 입력
              </li>
              <li>상담 신청 양식을 통한 제출</li>
              <li>
                서비스 이용 과정에서 자동 생성·수집 (쿠키, 접속 로그 등)
              </li>
            </ul>
          </Section>

          {/* 제3조 */}
          <Section title="제3조 (개인정보의 처리 및 보유 기간)">
            <p>
              회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터
              개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서
              개인정보를 처리·보유합니다.
            </p>
            <Table
              headers={["처리 목적", "보유 기간", "근거"]}
              rows={[
                ["회원 정보", "회원 탈퇴 시까지", "이용자 동의"],
                ["상담 신청 내역", "상담 완료 후 3년", "분쟁 해결 목적"],
                [
                  "계약 또는 청약철회 등에 관한 기록",
                  "5년",
                  "전자상거래법 제6조",
                ],
                [
                  "소비자 불만 또는 분쟁처리에 관한 기록",
                  "3년",
                  "전자상거래법 제6조",
                ],
                [
                  "표시·광고에 관한 기록",
                  "6개월",
                  "전자상거래법 제6조",
                ],
                [
                  "접속에 관한 로그 기록",
                  "3개월",
                  "통신비밀보호법 제15조의2",
                ],
              ]}
            />
          </Section>

          {/* 제4조 */}
          <Section title="제4조 (개인정보의 제3자 제공)">
            <p>
              회사는 정보주체의 개인정보를 제1조에서 명시한 목적 범위 내에서만
              처리하며, 다음의 경우를 제외하고는 정보주체의 동의 없이 제3자에게
              제공하지 않습니다.
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>정보주체가 사전에 제3자 제공에 동의한 경우</li>
              <li>
                법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와
                방법에 따라 수사기관의 요구가 있는 경우
              </li>
            </ol>
            <p className="mt-3">
              이용자가 상담 연결을 요청할 경우, 해당 유학원에 이름, 연락처, 상담
              신청 내용이 제공될 수 있으며, 이는 상담 진행을 위한 목적으로만
              사용됩니다. 이용자는 제3자 제공에 동의하지 않을 권리가 있으나,
              동의하지 않을 경우 해당 유학원과의 상담 연결 서비스 이용이 제한될
              수 있습니다.
            </p>
          </Section>

          {/* 제5조 */}
          <Section title="제5조 (개인정보 처리의 위탁)">
            <p>
              회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를
              외부에 위탁하고 있습니다.
            </p>
            <Table
              headers={["수탁업체", "위탁 업무 내용", "보유·이용 기간"]}
              rows={[
                [
                  "Supabase, Inc.",
                  "데이터베이스 저장 및 인프라 운영",
                  "회원 탈퇴 시 또는 위탁 계약 종료 시까지",
                ],
              ]}
            />
            <p className="mt-2">
              회사는 위탁 계약 체결 시 「개인정보 보호법」 제26조에 따라 위탁업무
              수행 목적 외 개인정보 처리 금지, 기술적·관리적 보호조치, 재위탁
              제한, 수탁자에 대한 관리·감독, 손해배상 등을 규정하고 있습니다.
            </p>
          </Section>

          {/* 제6조 */}
          <Section title="제6조 (개인정보의 국외 이전)">
            <p>
              회사는 서비스 제공을 위해 아래와 같이 개인정보를 국외로 이전합니다.
              이는 「개인정보 보호법」 제28조의8 제1항 제3호에 따라 정보주체와의
              계약 이행을 위한 처리 위탁·보관으로, 처리방침 공개로 갈음합니다.
            </p>
            <Table
              headers={[
                "이전받는 자",
                "이전 국가",
                "이전 항목",
                "이전 목적",
                "보유 기간",
              ]}
              rows={[
                [
                  "Supabase, Inc.",
                  "미국",
                  "회원정보 전체 (이름, 이메일, 전화번호 등)",
                  "데이터베이스 저장 및 서비스 인프라 운영",
                  "회원 탈퇴 시 또는 위탁 계약 종료 시까지",
                ],
              ]}
            />
          </Section>

          {/* 제7조 */}
          <Section title="제7조 (개인정보의 파기)">
            <p>
              회사는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가
              불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
            <p className="font-semibold mt-3 mb-1">가. 파기 절차</p>
            <p>
              이용자가 입력한 정보는 목적이 달성된 후 별도의 DB에 옮겨져 내부
              방침 및 기타 관련 법령에 따라 일정 기간 저장된 후 혹은 즉시
              파기됩니다. 이 때, DB로 옮겨진 개인정보는 법률에 의한 경우가
              아니고서는 다른 목적으로 이용되지 않습니다.
            </p>
            <p className="font-semibold mt-3 mb-1">나. 파기 기한</p>
            <p>
              개인정보의 보유 기간이 경과된 경우에는 보유 기간의 종료일로부터 5일
              이내에, 개인정보의 처리 목적 달성 등 그 개인정보가 불필요하게 되었을
              때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일
              이내에 그 개인정보를 파기합니다.
            </p>
            <p className="font-semibold mt-3 mb-1">다. 파기 방법</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                전자적 파일 형태의 정보: 기록을 재생할 수 없는 기술적 방법으로
                삭제
              </li>
              <li>종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각</li>
            </ul>
          </Section>

          {/* 제8조 */}
          <Section title="제8조 (정보주체의 권리·의무 및 행사방법)">
            <p>
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련
              권리를 행사할 수 있습니다.
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ol>
            <p className="mt-3">
              위 권리 행사는 「개인정보 보호법」 시행령 제41조 제1항에 따라 서면,
              전자우편 등을 통해 하실 수 있으며, 회사는 이에 대해 지체없이
              조치하겠습니다.
            </p>
            <p className="mt-2">
              정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한
              경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를
              이용하거나 제공하지 않습니다.
            </p>
            <p className="mt-3 font-semibold">권리 침해 구제 기관</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>개인정보보호위원회: 국번없이 182 (pipc.go.kr)</li>
              <li>개인정보 침해신고센터: 국번없이 118 (privacy.kisa.or.kr)</li>
              <li>대검찰청 사이버범죄 수사단: 02-3480-3573 (spo.go.kr)</li>
              <li>경찰청 사이버안전국: 국번없이 182 (cyberbureau.police.go.kr)</li>
            </ul>
          </Section>

          {/* 제9조 */}
          <Section title="제9조 (개인정보의 안전성 확보 조치)">
            <p>
              회사는 「개인정보 보호법」 제29조에 따라 다음과 같이 안전성 확보에
              필요한 기술적·관리적 조치를 하고 있습니다.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>개인정보 취급 직원의 최소화 및 교육</strong>: 개인정보를
                취급하는 직원을 지정하고 담당자에 한정시켜 최소화하여 개인정보를
                관리합니다.
              </li>
              <li>
                <strong>개인정보에 대한 접근 제한</strong>: 데이터베이스 시스템에
                대한 접근 권한의 부여, 변경, 말소를 통해 개인정보에 대한 접근
                통제를 위하여 필요한 조치를 하고 있습니다.
              </li>
              <li>
                <strong>개인정보의 암호화</strong>: 이용자의 비밀번호는 암호화되어
                저장 및 관리되며, 중요한 데이터는 전송 시 암호화하는 등의 보안
                기능을 사용합니다.
              </li>
              <li>
                <strong>접속 기록의 보관</strong>: 개인정보처리시스템에 접속한
                기록을 최소 1년 이상 보관하며, 접속 기록이 위·변조되지 않도록
                보안 기능을 사용합니다.
              </li>
            </ol>
          </Section>

          {/* 제10조 */}
          <Section title="제10조 (쿠키의 설치·운영 및 거부)">
            <p>
              회사는 이용자에게 맞춤 서비스를 제공하기 위해 이용 정보를 저장하고
              수시로 불러오는 &apos;쿠키(cookie)&apos;를 사용합니다.
            </p>
            <p className="font-semibold mt-3 mb-1">가. 쿠키의 사용 목적</p>
            <p>
              이용자의 방문 및 이용 형태를 파악하여 최적화된 정보 제공을 위해
              사용됩니다.
            </p>
            <p className="font-semibold mt-3 mb-1">
              나. 쿠키의 설치·운영 및 거부
            </p>
            <p>
              이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹 브라우저에서
              옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다
              확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다. 다만,
              쿠키의 저장을 거부할 경우 로그인이 필요한 일부 서비스는 이용에
              어려움이 있을 수 있습니다.
            </p>
          </Section>

          {/* 제11조 */}
          <Section title="제11조 (개인정보 보호책임자)">
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-brown-dark/5 rounded-lg p-4 mt-3">
              <p className="font-semibold mb-2">개인정보 보호책임자</p>
              <ul className="space-y-1">
                <li>이메일: privacy@bawiroad.com</li>
              </ul>
            </div>
            <p className="mt-3">
              정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호
              관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보
              보호책임자에게 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해
              지체없이 답변 및 처리해드릴 것입니다.
            </p>
          </Section>

          {/* 제12조 */}
          <Section title="제12조 (개인정보 처리방침 변경)">
            <p>
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
              변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
              전부터 공지사항을 통하여 고지할 것입니다. 다만, 개인정보의 수집 및
              활용, 제3자 제공 등과 같이 이용자 권리의 중요한 변경이 있을 경우에는
              최소 30일 전에 고지합니다.
            </p>
            <p className="mt-3 font-semibold">시행일: 2025년 3월 1일</p>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-brown-dark mb-3">{title}</h2>
      <div className="text-[0.9rem] text-brown-dark/85 space-y-2">
        {children}
      </div>
    </section>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-[0.82rem] border-collapse">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="bg-brown-dark/10 text-brown-dark font-semibold px-3 py-2 text-left border border-brown-dark/15"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-3 py-2 border border-brown-dark/15"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
