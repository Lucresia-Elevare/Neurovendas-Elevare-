#!/bin/bash

##
# Production Build Validation Script
# 
# Validates that the production build meets quality standards:
# - TypeScript compilation passes
# - Bundle size within limits
# - Critical assets present
# - Environment variables configured
# - Health checks respond
##

set -e # Exit on error

echo "🔍 Starting Production Build Validation..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Check function
check() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
  fi
}

# 1. TypeScript Compilation
echo "📝 Checking TypeScript compilation..."
npm run check 2>&1 > /dev/null
check "TypeScript compilation passes"
echo ""

# 2. Build Production Bundle
echo "🏗️  Building production bundle..."
npm run build 2>&1 > /dev/null
check "Production build completes successfully"
echo ""

# 3. Validate Bundle Size
echo "📦 Validating bundle size..."
BUNDLE_SIZE=$(du -sb dist/assets/js/*.js | awk '{s+=$1} END {print s}')
BUNDLE_SIZE_MB=$(echo "scale=2; $BUNDLE_SIZE / 1048576" | bc)
MAX_SIZE_MB=2.0

if (( $(echo "$BUNDLE_SIZE_MB < $MAX_SIZE_MB" | bc -l) )); then
  echo -e "${GREEN}✓${NC} Bundle size: ${BUNDLE_SIZE_MB}MB (under ${MAX_SIZE_MB}MB limit)"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} Bundle size: ${BUNDLE_SIZE_MB}MB (exceeds ${MAX_SIZE_MB}MB limit)"
  ((FAILED++))
fi
echo ""

# 4. Check Critical Assets
echo "🎯 Checking critical assets..."
CRITICAL_FILES=(
  "dist/index.html"
  "dist/assets/js/index"
  "dist/assets/css/index"
)

for file_pattern in "${CRITICAL_FILES[@]}"; do
  if ls $file_pattern* 1> /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Found: $(basename $file_pattern)"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} Missing: $file_pattern"
    ((FAILED++))
  fi
done
echo ""

# 5. Environment Variables
echo "🔐 Validating environment variables..."
ENV_VARS=(
  "DATABASE_URL"
  "JWT_SECRET"
  "AWS_ACCESS_KEY_ID"
  "AWS_SECRET_ACCESS_KEY"
  "AWS_S3_BUCKET"
  "OPENAI_API_KEY"
)

ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
  for var in "${ENV_VARS[@]}"; do
    if grep -q "^${var}=" "$ENV_FILE"; then
      echo -e "${GREEN}✓${NC} $var is configured"
      ((PASSED++))
    else
      echo -e "${YELLOW}⚠${NC} $var is missing (using .env.example as reference)"
    fi
  done
else
  echo -e "${YELLOW}⚠${NC} .env file not found (required for production)"
  echo -e "   Copy .env.example to .env and configure values"
fi
echo ""

# 6. Health Check Endpoints (if server is running)
echo "🏥 Checking health endpoints..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/trpc/health.ping 2>/dev/null | grep -q "200"; then
  echo -e "${GREEN}✓${NC} Health check endpoint responds"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} Health check endpoint not responding (server may not be running)"
fi
echo ""

# 7. Check for console.log in production bundle
echo "🧹 Checking for console.log in production bundle..."
if grep -r "console\.log" dist/assets/js/*.js > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠${NC} Found console.log statements in production bundle"
  echo -e "   Consider removing debug logs for production"
else
  echo -e "${GREEN}✓${NC} No console.log statements in production bundle"
  ((PASSED++))
fi
echo ""

# 8. Validate package.json scripts
echo "📜 Validating package.json scripts..."
REQUIRED_SCRIPTS=("build" "test" "check" "dev")
for script in "${REQUIRED_SCRIPTS[@]}"; do
  if grep -q "\"$script\":" package.json; then
    echo -e "${GREEN}✓${NC} Script '$script' exists"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} Script '$script' missing"
    ((FAILED++))
  fi
done
echo ""

# Summary
echo "═══════════════════════════════════════"
echo "📊 Validation Summary"
echo "═══════════════════════════════════════"
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ Production build is ready!${NC}"
  exit 0
else
  echo -e "${RED}❌ Production build has issues. Please fix before deploying.${NC}"
  exit 1
fi
