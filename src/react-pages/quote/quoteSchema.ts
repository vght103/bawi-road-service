import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().min(1, "이메일을 입력해주세요.").email("올바른 이메일 형식을 입력해주세요."),
  academyId: z.string().min(1, "어학원을 선택해주세요."),
  courseIndex: z.number({ error: "코스를 선택해주세요." }),
  dormIndex: z.number({ error: "기숙사 타입을 선택해주세요." }),
  weeks: z
    .string()
    .min(1, "연수 기간을 입력해주세요.")
    .refine(
      (val) => {
        const num = Number(val);
        return num >= 1 && num <= 52;
      },
      "1~52주 사이로 입력해주세요.",
    ),
  startDate: z.date({ error: "수업 시작 희망일을 선택해주세요." }),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
