# IntelliNLP v2 — Product & Technical Blueprint

## 1. Product vision

IntelliNLP is a local-first document intelligence workspace. Users can upload and organize documents, search their contents semantically, ask questions grounded in those documents, generate summaries, and inspect evidence for every answer.

The product must be useful without a paid AI API or a dedicated GPU. External model providers may be added as optional adapters, never as mandatory dependencies.

## 2. Rebuild principles

- Preserve the original repository and its history; all v2 work is isolated on the `intellinlp-v2` branch.
- Build vertical slices that can be run and tested before moving forward.
- No fake buttons, placeholder API responses, fabricated citations, or claims of completion without tests.
- Every generated answer must distinguish sourced evidence from model interpretation.
- Document access must be isolated by user/workspace.
- Model downloads must be configurable and lazy; avoid loading multiple large models at startup.
- Support CPU-only development on a 16 GB RAM machine.

## 3. Product scope

### Core capabilities
1. Workspace and document library
2. PDF, DOCX, TXT, and Markdown ingestion
3. Extraction status, page metadata, and ingestion error reporting
4. Text normalization and configurable chunking with overlap
5. Embedding generation and persistent vector indexing
6. Hybrid retrieval: lexical search plus semantic retrieval
7. Optional cross-encoder reranking behind a configurable interface
8. Document-grounded question answering with page/section citations
9. Short, medium, and detailed summaries
10. Single-document and multi-document question answering
11. Conversation history scoped to a workspace
12. Search result inspection and source previews
13. Document deletion with vector-index cleanup
14. Evaluation datasets and retrieval/answer quality metrics
15. Export of summaries and answer/source records

### Later capabilities (not required for the first MVP)
- OCR for scanned PDFs
- CSV/XLSX extraction
- Named entity extraction and document classification
- Knowledge graph / entity relationship exploration
- Collaborative workspaces and role-based access
- Optional hosted LLM adapters
- Batch processing and scheduled ingestion

## 4. Recommended architecture

### Frontend
- React + TypeScript + Vite
- Tailwind CSS and an accessible component system
- TanStack Query for server state
- React Router for navigation
- Zod for client-side schemas
- Vitest + React Testing Library; Playwright for end-to-end tests

### Backend
- Python 3.12 or a currently supported compatible version
- FastAPI + Pydantic v2
- SQLAlchemy 2.x + Alembic
- PostgreSQL for deployment; SQLite for the first local development slice if it simplifies setup
- Qdrant local persistent storage for vectors
- PyMuPDF for PDF extraction; python-docx for DOCX
- Sentence Transformers behind an embedding-provider interface
- Hugging Face Transformers behind task-specific model adapters
- Pytest + HTTPX for API tests

### Runtime and operations
- Docker Compose for reproducible local services where practical
- Environment-based configuration with validated settings
- Structured logs, request IDs, health/readiness endpoints
- GitHub Actions for linting, type checks, tests, and build verification
- No Redis or distributed task queue until a measured workload requires it

## 5. CPU-first model strategy

Do not use `facebook/bart-large-cnn` as an unconditional startup dependency. It is comparatively heavy for a CPU-only laptop.

- Embeddings: begin with a compact multilingual or English sentence-transformer model, configurable by environment variable.
- QA/generation: use a provider interface. Start with extractive QA and retrieval-grounded responses; add a small instruct model or optional hosted adapter only after benchmarking.
- Summarization: provide a lightweight configurable summarization adapter and a deterministic extractive fallback.
- Load models lazily on first use, cache them, expose model identity in diagnostics, and return actionable errors if a model is unavailable.
- Keep model selection, download behavior, and device selection configurable.
- Never describe a model score as answer truth or confidence unless it is calibrated and validated for that meaning.

## 6. High-level request flow

1. Client uploads a document to the API.
2. API validates type, size, and workspace permission.
3. Document metadata and ingestion state are stored.
4. Extractor obtains text and page/section metadata.
5. Chunker creates stable chunks with source offsets.
6. Embedding provider encodes chunks.
7. Vector store persists vectors and payload metadata.
8. Document is marked indexed only after all required steps succeed.
9. A question is normalized and retrieved using lexical + vector search.
10. Optional reranker orders candidate passages.
11. Answer provider receives only selected evidence and a strict grounding instruction.
12. API validates source references and returns answer plus citations.
13. UI displays answer and allows inspection of cited passages.

## 7. Data model (initial)

- User: id, email, password_hash or external identity, created_at
- Workspace: id, owner_id, name, created_at
- WorkspaceMember (later): workspace_id, user_id, role
- Document: id, workspace_id, filename, mime_type, size_bytes, checksum, status, page_count, error_message, created_at, indexed_at
- DocumentChunk: id, document_id, chunk_index, page_number, section_title, text, char_start, char_end, token_count
- Conversation: id, workspace_id, title, created_at, updated_at
- Message: id, conversation_id, role, content, created_at
- MessageCitation: id, message_id, document_id, chunk_id, quote, page_number, retrieval_score, rank
- IngestionJob: id, document_id, status, attempt_count, started_at, completed_at, error_message

Use UUID identifiers. Add database constraints and indexes for workspace scoping, document checksums, status, and foreign keys. Avoid storing secrets or raw model prompts unnecessarily.

## 8. API contract (initial proposal)

- GET /api/v1/health
- GET /api/v1/ready
- POST /api/v1/workspaces
- GET /api/v1/workspaces
- POST /api/v1/workspaces/{workspace_id}/documents
- GET /api/v1/workspaces/{workspace_id}/documents
- GET /api/v1/documents/{document_id}
- DELETE /api/v1/documents/{document_id}
- POST /api/v1/workspaces/{workspace_id}/search
- POST /api/v1/workspaces/{workspace_id}/questions
- POST /api/v1/documents/{document_id}/summaries
- POST /api/v1/workspaces/{workspace_id}/conversations
- GET /api/v1/conversations/{conversation_id}
- POST /api/v1/conversations/{conversation_id}/messages

All request and response payloads must have explicit Pydantic schemas. Add pagination, consistent error envelopes, request limits, and authorization checks before exposing endpoints beyond local development.

## 9. Security and privacy requirements

- Validate file extension, MIME type, actual content signature where feasible, and maximum upload size.
- Generate server-side storage names; never trust user-supplied paths.
- Store uploads outside the public web root.
- Enforce workspace ownership on every document, conversation, and vector retrieval operation.
- Never expose API keys to the frontend.
- Configure CORS with explicit allowed origins.
- Add rate limits before public deployment.
- Do not execute uploaded content, macros, scripts, or embedded links.
- Sanitize filenames and escape rendered document text.
- Provide deletion that removes metadata, files, chunks, and vectors.
- Do not log document contents, secrets, or full prompts by default.

## 10. Evaluation and quality gates

Create a small, versioned evaluation corpus with questions, expected source documents/pages, and reference answers. Track:
- extraction success rate
- ingestion failure rate
- Recall@k / MRR for retrieval
- citation precision and citation coverage
- answer faithfulness judged against retrieved evidence
- answer relevance
- latency and memory usage
- summarization coverage and factual consistency

A feature is complete only when its tests pass and its limitations are documented. Never claim factual correctness from a single demo query.

## 11. Definition of done

- Fresh clone setup documented and repeatable.
- Backend and frontend start using documented commands.
- Migrations work from an empty database.
- Automated tests cover success, validation, authorization, and failure paths.
- No secrets committed.
- Lint/type checks and production builds pass.
- Upload, retrieval, citations, deletion, and error states are demonstrably functional.
- CPU and memory behavior measured on the target development machine.
