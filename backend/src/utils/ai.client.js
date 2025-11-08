import dotenv from "dotenv";
import OPENAI from "openai";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) { console.warn("Warning: OPENAI_API_KEY is not set in environment variables."); }

const client = new OPENAI({ apiKey: OPENAI_API_KEY });

const isResponsesPreferred = (model) => /^gpt-5(?!-chat)/.test(model || "");

/**
 * 일반 챗봇용 호출자
 * @param {Object} p
 * @param {Array<{role:'system'|'user'|'assistant', content:string}>} p.messages
 * @param {string} [p.model=process.env.CHAT_MODEL || 'gpt-5']
 * @param {number} [p.maxTokens=process.env.CHAT_MAX_TOKENS || 600]
 * @param {number} [p.temperature=1]
 * @returns {Promise<{text:string, model:string, usage?:{prompt:number, completion:number, total:number}}>}
 */

export async function chatCompletion({
        messages,
        model = process.env.CHAT_MODEL || "gpt-5",
        maxTokens = Number(process.env.CHAT_MAX_TOKENS) || 600,
        temperature = 1,
}) {
        const resp = await client.chat.completions.create({
                model,
                messages,
                temperature,
                max_completion_tokens: maxTokens,
        });

        const choice = resp?.choices?.[0]?.message?.content || "";
        const usage = resp?.usage ? {
                prompt: resp.usage.prompt_tokens ?? undefined,
                completion: resp.usage.completion_tokens ?? undefined,
                total: resp.usage.total_tokens ?? undefined,
        } : undefined;

        return {
                text: String(choice),
                model : resp?.model || model,
                usage,
        };
}

function maskSecrets(text) {
        if(!text) return text;
        const flagRegex = /\b(?:FLAG|CTF|flag|ctf)\{[^}]+\}/gi;
        let out = text.replace(flagRegex, "[REDACTED_FLAG]");
        out = out.replace(/\bsk-[A-Za-z0-9\-_]{16,}\b/g, "[REDACTED_KEY]");
        return out;
}

function extractJsonSubstring(s) {
        if(typeof s !== "string") return null;
        const first = s.indexOf("{");
        const last = s.lastIndexOf("}");
        if (first === -1 || last === -1 || last < first) return null;
        return s.slice(first, last + 1);
}

function sanitizeResult(r) {
  return {
    questionId: r?.questionId ?? null,
    reasonSummary: maskSecrets(r?.reasonSummary ?? null),
    mistakeAnalysis: Array.isArray(r?.mistakeAnalysis) ? r.mistakeAnalysis.map(maskSecrets) : [],
    stepByStepSolution: Array.isArray(r?.stepByStepSolution) ? r.stepByStepSolution.map(maskSecrets) : [],
    learningTips: r?.learningTips ?? null,
  };
}

function fallbackFromItem(it) {
  return {
    questionId: it.questionId ?? null,
    reasonSummary: null,
    mistakeAnalysis: [],
    stepByStepSolution: [],
    learningTips: null,
  };
}

function buildSystemPrompt(){
        return [
                {
                        role: "system",
                        content: [
                                "당신은 퀴즈 답안 분석 및 교육용 해설 전문 어시스턴트입니다.",
                                "반드시 단 하나의 JSON 객체만 반환하세요. 출력 외 어떤 텍스트도 금지합니다. 오직 JSON만.",
                                "최상위 키는 'results'이며, 배열입니다.",
                                "각 결과 객체는 questionId (string), isCorrect (boolean), correctAnswer (string), userAnswer (string), reasonSummary (string), mistakeAnalysis (배열 문자열), stepByStepSolution (배열 문자열), difficulty (string|null), confidence (string|null), learningTips (string), references (배열 문자열), explainLikeIm5 (string)를 반드시 포함해야 합니다.",
                                "reasonSummary, mistakeAnalysis 각 항목, stepByStepSolution 각 단계, learningTips, explainLikeIm5, references 설명 등은 모두 자연스러운 한국어 문장으로 작성하세요.",
                                "만약 필드에 해당 내용이 없으면 null 또는 빈 배열([])로 대체하세요.",
                                "출력 예시(샘플 JSON) : { \"results\": [{ \"questionId\": \"abc123\", \"isCorrect\": true, \"correctAnswer\": \"1\", \"userAnswer\": \"1\", \"reasonSummary\": \"...\", \"mistakeAnalysis\": [\"...\"]}] }",
                                "출력에 JSON 외 텍스트(설명, 마크다운 등)는 포함하지 마세요.",
                                "FLAG, 비밀값 등은 모두 '[REDACTED_FLAG]'로 대체하세요."
                        ].join(" "),
                },
        ];
}

function buildUserPrompt(payload) {
        return {
                role: "user",
                content: "아래 입력(JSON 배열)을 분석해서, 시스템 메시지에서 정의한 정확한 JSON 스키마로 **한국어** 결과를 반환하세요.\n\nInput:\n\n" + JSON.stringify(payload),
        };
}

export async function analyzeAnswersBatch({
        payload,
        model = process.env.EXPLAIN_MODEL || "gpt-5",
        timeoutMs = parseInt(process.env.EXPLAIN_TIMEOUT_MS) || 12000,
        maxRetries = 1,
}) {
        console.log("[analyzeAnswersBatch] 시작 - model=%s, timeoutMs=%d, maxRetries=%d", model, timeoutMs, maxRetries);
        if(!payload || !Array.isArray(payload.items)){
                throw new Error("Invalid payload: expected { userId, items: [] }");
        }

        const batchMax = 10;
        const items = payload.items;
        console.log("[analyzeAnswersBatch] 총 아이템 개수: %d, 청크 크기: %d", items.length, batchMax);
        const chunks = [];
        for(let i=0; i<items.length; i+=batchMax){
                chunks.push(items.slice(i, i+batchMax));
        }
        console.log("[analyzeAnswersBatch] 청크 개수: %d", chunks.length);

        const aggregatedResults = [];

        for(let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++){
                const chunkItems = chunks[chunkIdx];
                console.log("[analyzeAnswersBatch] 청크 #%d 처리 시작 - 아이템 수: %d", chunkIdx, chunkItems.length);
                const chunkPayload = { userId: payload.userId, items: chunkItems };
                
                let parsed = null;

                for(let attempt = 0; attempt <= maxRetries; attempt++){
                        if(attempt > 0){
                                console.log("[analyzeAnswersBatch] 청크 #%d 재시도 %d/%d", chunkIdx, attempt, maxRetries);
                        }
                        const controller = new AbortController();
                        const timer = setTimeout(() => {
                                console.warn("[analyzeAnswersBatch] 청크 #%d 타임아웃 발생 (%dms 초과) - abort 호출", chunkIdx, timeoutMs);
                                controller.abort();
                        }, timeoutMs);

                        try{
                                const messages = [
                                        ...buildSystemPrompt(),
                                        buildUserPrompt(chunkPayload),
                                ];
                                console.log("[analyzeAnswersBatch] 청크 #%d OpenAI 호출 시작 - model=%s", chunkIdx, model);
                                const apiCallStart = Date.now();
                                let text;
                                if(isResponsesPreferred(model)){
                                        console.log("[analyzeAnswersBatch] 청크 #%d responses.create 사용", chunkIdx);
                                        const r = await client.responses.create({
                                                model,
                                                input: messages,
                                        });
                                        text = String(r.output_text ?? "");
                                } else {
                                        console.log("[analyzeAnswersBatch] 청크 #%d chat.completions.create 사용", chunkIdx);
                                        const r = await client.chat.completions.create({
                                                model,
                                                messages,
                                                temperature: 1,
                                                max_completion_tokens : Number(process.env.AI_MAX_TOKENS) || 1500,
                                                response_format: { type: "json_object" },
                                        },{ signal: controller.signal });
                                        text = String(r.choices?.[0]?.message?.content ?? "");
                                }
                                const apiCallDuration = Date.now() - apiCallStart;
                                console.log("[analyzeAnswersBatch] 청크 #%d OpenAI 응답 수신 완료 - 소요시간: %dms, 응답 길이: %d", chunkIdx, apiCallDuration, text.length);

                                clearTimeout(timer);

                                const candidate = extractJsonSubstring(text) ?? text;
                                const candidateMasked = maskSecrets(candidate);

                                console.log("[analyzeAnswersBatch] 청크 #%d JSON 파싱 시도 - 후보 길이: %d", chunkIdx, candidateMasked.length);

                                try {
                                        const json = JSON.parse(candidateMasked);
                                        parsed = Array.isArray(json?.results) ? json : Array.isArray(json) ? { results: json } : null;
                                        if(parsed){
                                                console.log("[analyzeAnswersBatch] 청크 #%d JSON 파싱 성공 - 결과 개수: %d", chunkIdx, parsed.results.length);
                                        } else {
                                                console.warn("[analyzeAnswersBatch] 청크 #%d JSON 구조 불일치 - results 배열 없음", chunkIdx);
                                        }
                                } catch(parseErr){
                                        parsed = null;
                                        console.error("[analyzeAnswersBatch] 청크 #%d JSON 파싱 실패 - 에러: %s, 텍스트 일부: %s", chunkIdx, parseErr.message, candidateMasked.slice(0, 200));
                                }

                                if(parsed) {
                                        aggregatedResults.push(...parsed.results.map(sanitizeResult));
                                        console.log("[analyzeAnswersBatch] 청크 #%d 성공 - 누적 결과 개수: %d", chunkIdx, aggregatedResults.length);
                                        break;
                                } else {
                                        console.warn("[analyzeAnswersBatch] 청크 #%d attempt %d 실패 - 재시도 또는 fallback 예정", chunkIdx, attempt);
                                }
                        } catch (err) {
                                console.error("[analyzeAnswersBatch] 청크 #%d API 호출 오류 (attempt %d/%d): %s", chunkIdx, attempt, maxRetries, err?.message || err);
                                console.error("[analyzeAnswersBatch] 에러 상세:", err);
                        } finally {
                                try { clearTimeout(timer); } catch {}
                        }
                }
                if(!parsed){
                        console.warn("[analyzeAnswersBatch] 청크 #%d 최종 실패 - fallback 적용 (아이템 수: %d)", chunkIdx, chunkItems.length);
                        aggregatedResults.push(...chunkItems.map(fallbackFromItem));
                }
                
        }
        console.log("[analyzeAnswersBatch] 전체 처리 완료 - 최종 결과 개수: %d", aggregatedResults.length);
        return { results: aggregatedResults };
}