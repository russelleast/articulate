FROM python:3.12-slim

WORKDIR /app
COPY src/KnowledgeApi/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY src/shared ./src/shared
COPY src/KnowledgeApi ./src/KnowledgeApi
COPY src/ReviewProposedClaimAgent ./src/ReviewProposedClaimAgent
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONPATH="/app/src/shared:/app/src/KnowledgeApi:/app/src/ReviewProposedClaimAgent" \
    PYTHONUNBUFFERED=1
CMD ["python", "-m", "knowledge_api.runtime"]
