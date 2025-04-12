FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  FLASK_APP=wsgi.py

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  gcc \
  python3-dev \
  libpq-dev \
  postgresql-client \
  && rm -rf /var/lib/apt/lists/*

# Install Python dependencies in stages to identify issues
COPY requirements.txt .
RUN pip install --upgrade pip && \
  pip install --no-cache-dir setuptools wheel && \
  pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create the data directory if not exists
RUN mkdir -p .data

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]