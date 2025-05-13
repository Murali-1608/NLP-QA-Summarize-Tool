# **_Semantic FAQ Search - NLP QA & Summarization_**

This project focuses on implementing an NLP-based FAQ Search System with capabilities for Question Answering (QA) and Text Summarization. The system is designed to intelligently search through FAQs and extract relevant answers or summarize information using state-of-the-art natural language processing (NLP) techniques.

Features
FAQ Search: Search the FAQ database by submitting questions, and the system will retrieve relevant answers.

Question Answering (QA): Uses pretrained NLP models (like BERT or GPT) to find precise answers from the FAQs.

Text Summarization: Summarizes long FAQs or answers into concise versions, making it easier for users to digest information.

Semantic Search: Utilizes semantic search techniques to match user queries with the most relevant FAQ entries.

Customizable Dataset: Easily configurable with your own FAQ data to adapt to different domains or industries.

Technologies Used
Python: The core language for the implementation.

Transformers: Hugging Face’s library for pretrained models like BERT, GPT-2, and T5.

SpaCy: For NLP pipeline tasks such as tokenization and named entity recognition (NER).

NLTK: For various NLP utilities, including text preprocessing and stemming.

Flask/FastAPI: For serving the API to handle user queries and responses.

Pandas: For data manipulation and working with FAQ datasets.

TensorFlow/PyTorch: Backend for training and fine-tuning NLP models.


Run In Terminal 

**_For Backend_** - uvicorn main:app --reload

**_For Frontend_** - npm run dev