#!/bin/bash
set -e

ENVIRONMENT=${1:-dev}
ACTION=${2:-up}

echo "� Managing $ENVIRONMENT environment..."

case $ENVIRONMENT in
  "dev")
    COMPOSE_FILE="environments/dev/docker-compose.dev.yml"
    PORTS="Dev: Frontend=3001, Backend=5001"
    ;;
  "staging")
    COMPOSE_FILE="environments/staging/docker-compose.staging.yml"
    PORTS="Staging: Frontend=3002, Backend=5002"
    ;;
  "prod")
    COMPOSE_FILE="environments/prod/docker-compose.prod.yml"
    PORTS="Prod: Frontend=3003, Backend=5003"
    ;;
  *)
    echo "❌ Invalid environment. Use: dev, staging, or prod"
    exit 1
    ;;
esac

echo "� Using compose file: $COMPOSE_FILE"
echo "� $PORTS"

case $ACTION in
  "up")
    echo "⬆️  Starting $ENVIRONMENT environment..."
    docker-compose -f $COMPOSE_FILE up -d --build
    echo "✅ $ENVIRONMENT environment is running!"
    ;;
  "down")
    echo "⬇️  Stopping $ENVIRONMENT environment..."
    docker-compose -f $COMPOSE_FILE down
    echo "✅ $ENVIRONMENT environment stopped!"
    ;;
  "logs")
    echo "�� Showing logs for $ENVIRONMENT environment..."
    docker-compose -f $COMPOSE_FILE logs -f
    ;;
  "status")
    echo "� Status of $ENVIRONMENT environment:"
    docker-compose -f $COMPOSE_FILE ps
    ;;
  "restart")
    echo "� Restarting $ENVIRONMENT environment..."
    docker-compose -f $COMPOSE_FILE down
    docker-compose -f $COMPOSE_FILE up -d --build
    echo "✅ $ENVIRONMENT environment restarted!"
    ;;
  *)
    echo "❌ Invalid action. Use: up, down, logs, status, restart"
    exit 1
    ;;
esac
