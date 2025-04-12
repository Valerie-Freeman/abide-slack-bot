FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  FLASK_APP=wsgi.py

# Install system dependencies
RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  gcc \
  python3-dev \
  libpq-dev \
  postgresql-client \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Install Python dependencies in stages for better caching
COPY requirements.txt .

# Upgrade pip first to avoid issues
RUN pip install --no-cache-dir --upgrade pip && \
  pip install --no-cache-dir setuptools wheel

# Use --no-deps to avoid dependency resolution issues
RUN pip install --no-cache-dir --no-deps -r requirements.txt || cat /tmp/pip-error.log

# Now install with deps for the packages that need them
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create the data directory
RUN mkdir -p .data

# Make the entrypoint script executable
RUN if [ -f entrypoint.sh ]; then chmod +x entrypoint.sh; fi

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]