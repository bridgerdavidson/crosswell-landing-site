import { ANSWER, IconUp, QUESTION } from "./shared";

export function ChatView() {
  return (
    <div className="cwd-view cwd-view-chat absolute inset-0 flex flex-col p-5 sm:p-6">
      <div className="relative mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-3">
        <div className="cwd-q max-w-[78%] self-end rounded-2xl rounded-br-[5px] bg-charcoal px-3.5 py-2 text-[13px] leading-relaxed">
          {QUESTION}
        </div>

        <div className="relative min-h-[150px] sm:min-h-[118px]">
          <div className="cwd-thinking absolute left-0 top-0 flex items-center gap-1.5 rounded-2xl rounded-bl-[5px] bg-[#24221c] px-3.5 py-3 opacity-0 invisible">
            <span className="chat-dot" />
            <span className="chat-dot" />
            <span className="chat-dot" />
          </div>
          <div className="cwd-answer max-w-[88%] rounded-2xl rounded-bl-[5px] bg-[#24221c] px-4 py-3 text-[13px] leading-relaxed text-ivory/90">
            {ANSWER}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="cwd-cite cwd-cite-new rounded-full bg-fern/30 px-2.5 py-0.5 text-[10.5px] font-semibold text-[#c2d6c2] shadow-[0_0_0_1.5px_rgba(147,179,147,0.55)]">
                Policy note · Apr 8
              </span>
              <span className="cwd-cite rounded-full bg-fern/20 px-2.5 py-0.5 text-[10.5px] font-semibold text-fern-soft">
                Ops meeting · Mar 28
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 flex w-full max-w-[560px] items-center gap-2.5 rounded-full bg-[#24221c] py-2.5 pl-4 pr-2.5 text-[13px]">
        <span className="min-w-0 flex-1 truncate text-ivory/40">
          <span className="cwd-composer-text text-ivory/85" />
          <span
            className="cwd-caret chat-caret ml-0.5 opacity-0 invisible"
            style={{ background: "var(--color-fern-soft)" }}
          />
          <span className="cwd-composer-hint">Ask anything about your firm…</span>
        </span>
        <span className="cwd-send ml-auto flex h-6 w-6 flex-none items-center justify-center rounded-full bg-fern text-ivory">
          <IconUp />
        </span>
      </div>
    </div>
  );
}
