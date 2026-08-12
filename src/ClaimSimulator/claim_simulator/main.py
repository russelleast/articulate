import os

import uvicorn


def run() -> None:
    uvicorn.run(
        "claim_simulator.api:app",
        host=os.getenv("CLAIM_SIMULATOR_HOST", "0.0.0.0"),
        port=int(os.getenv("CLAIM_SIMULATOR_PORT", "8000")),
    )


if __name__ == "__main__":
    run()
