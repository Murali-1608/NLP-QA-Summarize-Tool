from transformers import pipeline

# Load Hugging Face models
qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")
summarizer_pipeline = pipeline("summarization", model="facebook/bart-large-cnn")

def answer_question(question: str, context: str):
    return qa_pipeline(question=question, context=context)

def summarize_text(text: str):
    return summarizer_pipeline(text, max_length=100, min_length=30, do_sample=False)
