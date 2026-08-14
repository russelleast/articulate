FROM python:3.12-slim
WORKDIR /app

COPY src/tools/claim_simulator/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY src/knowledge/shared ./src/knowledge/shared
COPY src/tools/claim_simulator ./src/tools/claim_simulator

ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONPATH="/app/src/knowledge/shared:/app/src/tools/claim_simulator" \
    PYTHONUNBUFFERED=1
    
CMD ["python", "-m", "claim_simulator.main"]
