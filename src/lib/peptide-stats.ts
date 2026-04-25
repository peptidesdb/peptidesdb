import type { Peptide, StackProtocol } from "./schemas/peptide";

/* =========================================================
   Build-time peptide stats: count cited vs uncited claims so
   the trust promise of PeptideDB is mechanically queryable.

   Claims counted:
   - Every CitableValue in mechanism / dosage / fat_loss / side_effects
   - Each hero_stat (the value+label+cite triplet)
   - Each StackProtocol's rationale + primary_benefit (counted as claims;
     stack-level cite[] is the source. If empty, claim is uncited.)
   - StackProtocol.protocol.* values reference dosing already counted
     elsewhere, so they're omitted to avoid double-counting.

   AdminStep.body is descriptive prose (how to inject) and not a research
   claim — omitted from the audit.
   ========================================================= */

export interface PeptideStats {
  total_claims: number;
  cited_claims: number;
  uncited_claims: number;
  citation_density: number;
  citation_ratio: number;
  uncited_fields: string[];
}

function isCitableValue(
  obj: unknown,
): obj is { value: string; cite: string[] } {
  if (!obj || typeof obj !== "object") return false;
  const r = obj as Record<string, unknown>;
  return (
    typeof r.value === "string" &&
    Array.isArray(r.cite) &&
    r.cite.every((x) => typeof x === "string")
  );
}

function isStackProtocol(
  obj: unknown,
): obj is StackProtocol {
  if (!obj || typeof obj !== "object") return false;
  const r = obj as Record<string, unknown>;
  return (
    typeof r.rationale === "string" &&
    typeof r.primary_benefit === "string" &&
    typeof r.partner_slug === "string"
  );
}

export function computePeptideStats(p: Peptide): PeptideStats {
  let total = 0;
  let cited = 0;
  let density = 0;
  const uncited: string[] = [];

  function countClaim(refs: string[], path: string): void {
    total += 1;
    density += refs.length;
    if (refs.length > 0) cited += 1;
    else uncited.push(path);
  }

  function visit(node: unknown, path: string): void {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach((item, i) => visit(item, `${path}[${i}]`));
      return;
    }
    if (typeof node !== "object") return;

    if (isCitableValue(node)) {
      countClaim(node.cite, path);
      // CitableValues don't currently nest other CitableValues, so stop.
      return;
    }

    if (isStackProtocol(node)) {
      // A stack contributes TWO claims: the rationale + the primary benefit.
      // Both are governed by the stack-level cite[].
      countClaim(node.cite ?? [], `${path}.rationale`);
      countClaim(node.cite ?? [], `${path}.primary_benefit`);
      // Don't recurse into protocol.* (those are reference values from dosage)
      return;
    }

    const obj = node as Record<string, unknown>;
    for (const [k, v] of Object.entries(obj)) {
      visit(v, path ? `${path}.${k}` : k);
    }
  }

  visit(p.mechanism, "mechanism");
  visit(p.dosage, "dosage");
  if (p.fat_loss) visit(p.fat_loss, "fat_loss");
  visit(p.side_effects, "side_effects");
  // administration intentionally omitted — protocol prose, not research claims
  if (p.synergy) visit(p.synergy, "synergy");
  visit(p.hero_stats, "hero_stats");

  return {
    total_claims: total,
    cited_claims: cited,
    uncited_claims: total - cited,
    citation_density: density,
    citation_ratio: total === 0 ? 0 : cited / total,
    uncited_fields: uncited,
  };
}
