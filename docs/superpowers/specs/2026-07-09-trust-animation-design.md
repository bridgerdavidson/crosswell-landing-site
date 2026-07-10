# Security section animation: the secured route

Date: 2026-07-09. Status: approved (chosen from a 9-concept board, then 3 securing-treatment variants, via visual companion mockups).

## Concept

Replaces the rotating vault rings in the Security section. A network diagram that tells the section's actual claim: data moves between parties only through a channel the shield has sealed.

## Sequence (one-shot, on scroll-into-view)

1. Source dot pops in (left).
2. One continuous dashed warm-gray line draws out: accelerates down the trunk, splits at the junction, decelerates into both endpoints. Implemented as a mask-reveal wiper so the dashes are revealed, not dash-crawled; must read as a single pen stroke that forks.
3. Endpoint dots land as the line reaches them.
4. The shield draws in on top of the junction (the route runs underneath, no gap), inner border follows, opaque face covers the lines.
5. Lock appears; shackle clicks shut with a soft scale pop, interior warms fern briefly, outline deepens. No glint/glare effects.
6. The securing moment (S2 "the gaps seal shut"): the dashes stretch until every gap closes and the route warms from gray to fern. Color semantics: warm gray = unsecured, fern = secured.
7. Each endpoint confirms with an expanding ring.
8. Ambient loop: every 7s a pulse leaves the source, passes underneath the shield, splits, and both endpoints answer with a soft halo. Shield outline breathes at 8s.

## Constraints

- Pure CSS + inline SVG, no animation library.
- Plays when scrolled into view (IntersectionObserver, threshold 0.35), once.
- No-JS safe: server-rendered state is the finished diagram.
- Reduced motion: no animation; the finished diagram fades in.
- Visible on all viewports (the old vault was desktop-only).
- Rejected along the way: vault-rings-lock-in (A), enclosure dots (B), stamp seal (C), scan/handshake tech variants, guilloche, watermark, cipher, redaction; and securing treatments S1 (solidify outward) and S3 (escort pulses).

## Files

- `src/components/TrustDiagram.tsx` — client component, SVG + observer.
- `src/app/globals.css` — `.trust-diagram` / `td-*` styles and keyframes.
- `src/components/Trust.tsx` — mounts the diagram in the right column.
