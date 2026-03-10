import { z } from "zod";

export const enrollmentSchema = z.object({
  academyId: z.string().min(1, "어학원을 선택해주세요."),
  courseIndex: z.number({ error: "코스를 선택해주세요." }),
  dormIndex: z.number({ error: "기숙사 타입을 선택해주세요." }),
  weeks: z
    .string()
    .min(1, "연수 기간을 입력해주세요.")
    .refine(
      (val) => {
        const n = Number(val);
        return n >= 1 && n <= 52;
      },
      "1~52주 사이로 입력해주세요.",
    ),
  startDate: z.date({ error: "수업 시작 희망일을 선택해주세요." }),
  termsAgreed: z.literal(true, { message: "이용약관에 동의해주세요." }),
  refundAgreed: z.literal(true, { message: "환불 규정에 동의해주세요." }),
  studentNote: z.string().optional(),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

// 단계별 검증할 필드 목록
export const STEP_FIELDS: (keyof EnrollmentFormValues)[][] = [
  ["academyId"],
  ["courseIndex", "dormIndex", "weeks", "startDate"],
  ["termsAgreed", "refundAgreed"],
];
