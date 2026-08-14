FROM python:3.12-slim

WORKDIR /app
COPY src/knowledge/api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY src/knowledge/shared ./src/knowledge/shared
COPY src/knowledge/api ./src/knowledge/api
COPY src/knowledge/agents/review_proposed_claim ./src/knowledge/agents/review_proposed_claim
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONPATH="/app/src/knowledge/shared:/app/src/knowledge/api:/app/src/knowledge/agents/review_proposed_claim" \
    PYTHONUNBUFFERED=1
CMD ["python", "-m", "knowledge_api.runtime"]
