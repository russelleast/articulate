FROM python:3.12-slim
WORKDIR /app

COPY src/ClaimSimulator/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY src/shared ./src/shared
COPY src/ClaimSimulator ./src/ClaimSimulator

ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONPATH="/app/src/shared:/app/src/ClaimSimulator" \
    PYTHONUNBUFFERED=1
    
CMD ["python", "-m", "claim_simulator.main"]
