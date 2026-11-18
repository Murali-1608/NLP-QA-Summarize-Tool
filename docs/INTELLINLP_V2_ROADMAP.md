# IntelliNLP v2 — Implementation Roadmap

## Phase 0 — Repository and design baseline
- [x] Inspect existing NLP-QA-Summarize-Tool repository.
- [x] Create isolated `intellinlp-v2` branch.
- [ ] Record the existing behavior and migration decisions.
- [ ] Confirm product scope and local runtime assumptions.

## Phase 1 — Foundation
- [ ] Create clean frontend and backend project structures.
- [ ] Add environment configuration and example environment files.
- [ ] Add health/readiness endpoints and typed API error format.
- [ ] Add linting, formatting, type checking, and test configuration.
- [ ] Add Docker/dev setup only for dependencies that are actually needed.
- Acceptance: clean setup works from a fresh clone; smoke tests pass.

## Phase 2 — Document ingestion
- [ ] Implement upload validation and secure storage.
- [ ] Extract PDF, DOCX, TXT, and Markdown content.
- [ ] Preserve page/section metadata and character offsets.
- [ ] Implement chunking with configurable size and overlap.
- [ ] Persist document state and ingestion errors.
- Acceptance: representative files ingest correctly; invalid and oversized files fail safely.

## Phase 3 — Search and retrieval
- [ ] Add embedding-provider abstraction and compact CPU-friendly default.
- [ ] Persist vectors in Qdrant.
- [ ] Add lexical retrieval and semantic retrieval.
- [ ] Add configurable fusion and optional reranking.
- [ ] Build a versioned retrieval evaluation set.
- Acceptance: retrieval metrics are reported and every result links to a real chunk.

## Phase 4 — Question answering
- [ ] Add answer-provider abstraction.
- [ ] Implement grounded QA with evidence-only context.
- [ ] Return citations with document, page, and chunk references.
- [ ] Handle insufficient evidence explicitly.
- [ ] Add single-document and workspace-level QA.
- Acceptance: citations resolve to stored source passages; unsupported questions do not receive fabricated answers.

## Phase 5 — Summarization and NLP utilities
- [ ] Add short, medium, and detailed summaries.
- [ ] Add extractive fallback and configurable model adapters.
- [ ] Add keywords and named entities as optional utilities.
- [ ] Evaluate summary coverage and factual consistency.
- Acceptance: summaries handle long inputs safely and disclose source scope.

## Phase 6 — Frontend workspace
- [ ] Build responsive application shell and navigation.
- [ ] Build workspace and document library.
- [ ] Build upload, ingestion progress, and error states.
- [ ] Build search and source preview.
- [ ] Build chat with citations and conversation history.
- [ ] Build summarization view and export.
- Acceptance: complete user workflows work against the real API; no mock-only actions.

## Phase 7 — Hardening and release
- [ ] Add authentication and workspace authorization.
- [ ] Add deletion and data-retention checks.
- [ ] Add rate limits, security headers, and production CORS.
- [ ] Add CI, integration tests, and Playwright smoke tests.
- [ ] Benchmark CPU/RAM and document model trade-offs.
- [ ] Write setup, architecture, API, troubleshooting, and limitations docs.
- Acceptance: reproducible release candidate with passing CI and documented known limitations.

## Build discipline
Work in small batches. Before each batch, state the files to be changed and acceptance criteria. After each batch, run relevant tests and report exact results. Do not begin the next phase while a blocking failure remains unresolved.
