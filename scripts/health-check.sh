#!/bin/bash

check_service() {
  local url=$1
  local service=$2
  local max_attempts=30
  local attempt=1

  echo "Ìø• Checking health of $service at $url..."
  
  while [ $attempt -le $max_attempts ]; do
    if curl -f -s $url > /dev/null; then
      echo "‚úÖ $service is healthy!"
      return 0
    else
      echo "‚è≥ Attempt $attempt/$max_attempts - $service not ready yet..."
      sleep 2
      ((attempt++))
    fi
  done
  
  echo "‚ùå $service failed health check after $max_attempts attempts"
  return 1
}

ENVIRONMENT=${1:-all}

echo "Ì¥ç Starting health checks for $ENVIRONMENT..."

if [ "$ENVIRONMENT" = "all" ] || [ "$ENVIRONMENT" = "dev" ]; then
  echo "Ì¥ß Checking Development Environment..."
  check_service "http://localhost:5001/api/health" "Dev Backend" || true
  check_service "http://localhost:3001" "Dev Frontend" || true
fi

if [ "$ENVIRONMENT" = "all" ] || [ "$ENVIRONMENT" = "staging" ]; then
  echo "Ìæ≠ Checking Staging Environment..."
  check_service "http://localhost:5002/api/health" "Staging Backend" || true
  check_service "http://localhost:3002" "Staging Frontend" || true
fi

if [ "$ENVIRONMENT" = "all" ] || [ "$ENVIRONMENT" = "prod" ]; then
  echo "Ìø≠ Checking Production Environment..."
  check_service "http://localhost:5003/api/health" "Prod Backend" || true
  check_service "http://localhost:3003" "Prod Frontend" || true
fi

echo "ÔøΩÔøΩ Health checks completed!"
