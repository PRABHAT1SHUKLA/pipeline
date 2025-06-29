#!/bin/bash
set -e

ENVIRONMENT=${1:-dev}
ACTION=${2:-up}

echo "Ì∫Ä Managing $ENVIRONMENT environment..."

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
    echo "‚ùå Invalid environment. Use: dev, staging, or prod"
    exit 1
    ;;
esac

echo "Ì≥ã Using compose file: $COMPOSE_FILE"
echo "Ìºê $PORTS"

case $ACTION in
  "up")
    echo "‚¨ÜÔ∏è  Starting $ENVIRONMENT environment..."
    docker-compose -f $COMPOSE_FILE up -d --build
    echo "‚úÖ $ENVIRONMENT environment is running!"
    ;;
  "down")
    echo "‚¨áÔ∏è  Stopping $ENVIRONMENT environment..."
    docker-compose -f $COMPOSE_FILE down
    echo "‚úÖ $ENVIRONMENT environment stopped!"
    ;;
  "logs")
    echo "ÔøΩÔøΩ Showing logs for $ENVIRONMENT environment..."
    docker-compose -f $COMPOSE_FILE logs -f
    ;;
  "status")
    echo "Ì≥ä Status of $ENVIRONMENT environment:"
    docker-compose -f $COMPOSE_FILE ps
    ;;
  "restart")
    echo "Ì¥Ñ Restarting $ENVIRONMENT environment..."
    docker-compose -f $COMPOSE_FILE down
    docker-compose -f $COMPOSE_FILE up -d --build
    echo "‚úÖ $ENVIRONMENT environment restarted!"
    ;;
  *)
    echo "‚ùå Invalid action. Use: up, down, logs, status, restart"
    exit 1
    ;;
esac
