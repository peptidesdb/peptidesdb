import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contribute — PeptidesDB",
  description:
    "PeptidesDB is a community manuscript. Every plate has a maintainer of one and contributors of many. Here is how a citation, correction, or new peptide enters the atlas.",
  alternates: { canonical: `${SITE_URL}/contribute` },
};

export default function ContributePage() {
  return (
    <article className="mx-auto max-w-[720px] px-6 sm:px-16 py-16 sm:py-24">
      {/* MASTHEAD ————————————————— */}
      <header className="text-center mb-16 sm:mb-24">
        <p className="at-folio text-[11px] tracking-[0.22em] text-at-soft mb-6">
          A community manuscript
        </p>
        <h1 className="at-display text-[56px] sm:text-[80px] leading-[0.95] mb-6">
          Contribute
        </h1>
        <p className="at-display-italic text-[24px] sm:text-[28px] text-at-mute max-w-[520px] mx-auto">
          Every plate has a maintainer of one and{" "}
          <span className="text-at-gold">contributors of many</span>.
        </p>
      </header>

      <hr className="border-0 border-t border-at-line mb-16" />

      {/* § 01 — THESIS ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block text-[11px] tracking-[0.22em] text-at-soft mb-2">
            § 01 · The thesis
          </span>
          <span className="font-serif text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            A peer-reviewed reference, written in public.
          </span>
        </h2>
        <div className="at-prose space-y-4 text-[16px] leading-[1.7] text-at-ink-2">
          <p>
            PeptidesDB is not a peptide store, a forum, or a SaaS app. It is
            a community-edited atlas. Every claim points to a paper. Every
            paper points to its DOI or PubMed entry. Every plate cites its
            sources. When a claim cannot be cited yet, it is marked uncited
            so a future contributor can close the gap.
          </p>
          <p>
            The five guarantees the atlas makes to its readers are documented
            in{" "}
            <Link href="/" className="at-link">
              DESIGN.md § 1
            </Link>
            . The mechanical rules contributors follow to keep those
            guarantees true are documented below.
          </p>
        </div>
      </section>

      {/* § 02 — WHAT WE EXPECT ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block text-[11px] tracking-[0.22em] text-at-soft mb-2">
            § 02 · What a contribution looks like
          </span>
          <span className="font-serif text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Small, well-cited, reversible.
          </span>
        </h2>
        <ol className="at-prose space-y-5 text-[16px] leading-[1.7] text-at-ink-2 list-decimal pl-6 marker:at-folio marker:text-at-soft">
          <li>
            <strong className="text-at-ink">Add a citation.</strong>{" "}
            A claim on a plate is unsourced or weakly sourced and you have a
            paper that supports it. PubMed ID or DOI is the unit of currency.
            Vendor pages are not citations.
          </li>
          <li>
            <strong className="text-at-ink">
              Correct a claim.
            </strong>{" "}
            A figure is wrong. A mechanism description is outdated. An
            evidence level overstates what the literature supports. Bring a
            citation if you have one — if not, the maintainer will help find
            one.
          </li>
          <li>
            <strong className="text-at-ink">
              Add a peptide plate.
            </strong>{" "}
            A peptide with a published clinical or preclinical evidence base
            is missing. Open a plate proposal with two to five starter
            citations.
          </li>
          <li>
            <strong className="text-at-ink">
              Fix a typo or formatting issue.
            </strong>{" "}
            Spelling, grammar, broken link, layout glitch. One-line edits
            welcome.
          </li>
        </ol>
      </section>

      {/* § 03 — THE FLOW ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block text-[11px] tracking-[0.22em] text-at-soft mb-2">
            § 03 · The flow
          </span>
          <span className="font-serif text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            From a paper you read to a plate that cites it.
          </span>
        </h2>
        <ol className="at-prose space-y-5 text-[16px] leading-[1.7] text-at-ink-2 list-decimal pl-6 marker:at-folio marker:text-at-soft">
          <li>
            Find the plate. Each plate page (e.g.{" "}
            <Link href="/p/tesamorelin" className="at-link">
              /p/tesamorelin
            </Link>
            ) has a colophon at the bottom with{" "}
            <em className="font-serif">Edit on GitHub →</em>. That link opens
            the plate&rsquo;s YAML in GitHub&rsquo;s editor.
          </li>
          <li>
            Make the change. Each plate is a single YAML file in{" "}
            <code className="at-folio normal-case tracking-normal text-[13px] bg-at-cream-2 px-1.5 py-0.5">
              content/peptides/&lt;slug&gt;.yaml
            </code>
            . Citations are referenced by ID; the registry lives in{" "}
            <code className="at-folio normal-case tracking-normal text-[13px] bg-at-cream-2 px-1.5 py-0.5">
              content/refs.yaml
            </code>
            .
          </li>
          <li>
            Open a pull request. GitHub provides a one-click flow: edit, add
            a commit message, propose a change. The audit workflow runs the
            schema gate automatically (
            <code className="at-folio normal-case tracking-normal text-[13px] bg-at-cream-2 px-1.5 py-0.5">
              bun run audit:trust
            </code>
            ). A maintainer reviews and merges, or asks a question.
          </li>
          <li>
            See it live. Once merged to{" "}
            <code className="at-folio normal-case tracking-normal text-[13px] bg-at-cream-2 px-1.5 py-0.5">
              main
            </code>
            , Vercel rebuilds the affected plate within a minute. Your{" "}
            <code className="at-folio normal-case tracking-normal text-[13px] bg-at-cream-2 px-1.5 py-0.5">
              @handle
            </code>{" "}
            joins the colophon.
          </li>
        </ol>
        <p className="at-folio text-[11px] tracking-[0.22em] text-at-soft mt-8">
          A short screencast walking through this flow is planned for a
          future release.
        </p>
      </section>

      {/* § 04 — SCHEMA + REFERENCE ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block text-[11px] tracking-[0.22em] text-at-soft mb-2">
            § 04 · The schema
          </span>
          <span className="font-serif text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            One YAML, one peptide, one source of truth.
          </span>
        </h2>
        <div className="at-prose space-y-4 text-[16px] leading-[1.7] text-at-ink-2">
          <p>
            The full plate YAML schema is defined as a Zod schema in{" "}
            <code className="at-folio normal-case tracking-normal text-[13px] bg-at-cream-2 px-1.5 py-0.5">
              src/lib/schemas/peptide.ts
            </code>
            . The audit script enforces it at build time and on every PR.
          </p>
          <p>
            New plates start from{" "}
            <code className="at-folio normal-case tracking-normal text-[13px] bg-at-cream-2 px-1.5 py-0.5">
              content/peptides/_template.yaml
            </code>
            . Read{" "}
            <a
              href="https://github.com/peptidesdb/peptidesdb/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="at-link"
            >
              CONTRIBUTING.md
            </a>{" "}
            for the field-by-field walkthrough and{" "}
            <a
              href="https://github.com/peptidesdb/peptidesdb/blob/main/DESIGN.md"
              target="_blank"
              rel="noopener noreferrer"
              className="at-link"
            >
              DESIGN.md
            </a>{" "}
            for the editorial conventions.
          </p>
        </div>
      </section>

      {/* § 05 — RECOGNITION ————————————————— */}
      <section className="mb-16">
        <h2 className="mb-6">
          <span className="at-folio block text-[11px] tracking-[0.22em] text-at-soft mb-2">
            § 05 · Recognition
          </span>
          <span className="font-serif text-[28px] sm:text-[32px] leading-[1.15] text-at-ink">
            Named in the colophon. Linked to your work.
          </span>
        </h2>
        <div className="at-prose space-y-4 text-[16px] leading-[1.7] text-at-ink-2">
          <p>
            Each contributor is listed in the colophon of every plate they
            have touched, by GitHub handle, linked to their profile. The
            atlas does not paywall, gate, or rebrand contributor work. What
            you write here stays here, under the project&rsquo;s MIT license,
            with your name beside it.
          </p>
          <p>
            Maintainers operate under the{" "}
            <a
              href="https://github.com/peptidesdb/peptidesdb/blob/main/CODE_OF_CONDUCT.md"
              target="_blank"
              rel="noopener noreferrer"
              className="at-link"
            >
              Contributor Covenant 2.1
            </a>
            .
          </p>
        </div>
      </section>

      {/* CALL TO ACTION ————————————————— */}
      <hr className="border-0 border-t-2 border-at-ink mb-12" />
      <footer className="text-center">
        <p className="at-folio text-[11px] tracking-[0.22em] text-at-soft mb-6">
          Where to begin
        </p>
        <p className="at-display-italic text-[28px] sm:text-[36px] leading-[1.2] text-at-ink mb-10 max-w-[560px] mx-auto">
          Open a plate. Read the colophon. Click{" "}
          <span className="text-at-gold">Edit on GitHub →</span>.
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link
            href="/catalog"
            className="at-folio text-[12px] tracking-[0.22em] hover:text-at-gold"
          >
            Browse catalogue →
          </Link>
          <a
            href="https://github.com/peptidesdb/peptidesdb/issues/new/choose"
            target="_blank"
            rel="noopener noreferrer"
            className="at-folio text-[12px] tracking-[0.22em] hover:text-at-gold"
          >
            File an issue →
          </a>
          <a
            href="https://github.com/peptidesdb/peptidesdb"
            target="_blank"
            rel="noopener noreferrer"
            className="at-folio text-[12px] tracking-[0.22em] hover:text-at-gold"
          >
            Repository ↗
          </a>
        </div>
      </footer>
    </article>
  );
}
