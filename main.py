from fastapi import FastAPI
from pydantic import BaseModel
from services import answer_question, summarize_text
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS: Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class QARequest(BaseModel):
    question: str
    context: str

class SummaryRequest(BaseModel):
    text: str

# Routes
@app.post("/qa")
def get_answer(data: QARequest):
    result = answer_question(data.question, data.context)
    return {"answer": result["answer"]}

@app.post("/summarize")
def get_summary(data: SummaryRequest):
    result = summarize_text(data.text)
    return {"summary": result[0]["summary_text"]}
