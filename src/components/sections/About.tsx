import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollStory } from "@/components/features/ScrollStory";
import { Terminal } from "@/components/features/Terminal";

const STORY =
  "Full stack developer with 2.9 years of experience shipping production web apps end-to-end. I’ve built real-time systems, secure authentication and a white-label multi-tenant platform running 20+ live storefronts  and I own deployment on AWS and VPS with CI/CD. I care about products that are *fast,* *reliable* and *easy* to maintain.";

export function About() {
  return (
    <section className="band" id="about" aria-labelledby="about-h">
      <div className="wrap">
        <SectionHeading label="01 / About" id="about-h">
          Hello, I’m <Accent>Nimesh.</Accent>
        </SectionHeading>
        <div>
          <ScrollStory text={STORY} />
          <div className="max-w-[860px]">
            <Reveal className="flex min-h-[380px] flex-col overflow-hidden rounded-[22px] bg-dk pb-3.5 font-mono text-[13.5px] leading-[1.6] text-[#E6E5EE] shadow-[0_30px_60px_-36px_var(--color-shadow)]">
              <Terminal />
            </Reveal>
          </div>
          <Reveal className="mt-12 border-t border-line">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-b border-line py-[18px] max-sm:grid-cols-[minmax(0,1fr)]">
              <span>
                <strong className="font-semibold">
                  B.E. Computer Engineering
                </strong>{" "}
                <span className="text-ink-2">
                  {" "}
                  Atharva College of Engineering, Mumbai
                </span>
              </span>
              <span className="mono">2021 2025</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
