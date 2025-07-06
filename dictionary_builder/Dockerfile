FROM python:3.13-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip install poetry

WORKDIR /app

COPY README.md ./
COPY pyproject.toml poetry.lock* ./

RUN poetry install --no-root --no-interaction --no-ansi

# NLTKのデータをビルド時にダウンロード
RUN poetry run python -c "import nltk; nltk.download('wordnet', quiet=True); nltk.download('omw-1.4', quiet=True)"

COPY parsers/ ./parsers/
COPY build_database.py ./

CMD ["poetry", "run", "python", "build_database.py"]