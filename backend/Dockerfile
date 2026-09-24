# ==========================================
# Stage 1: Build Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code and build NestJS
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Production Runner
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install openssl for Prisma engine runtime on Alpine
RUN apk add --no-cache openssl

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy generated Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy compiled NestJS application
COPY --from=builder /app/dist ./dist

# Ensure upload directories exist
RUN mkdir -p uploads/nasabah uploads/kategori uploads/hadiah

EXPOSE 3000

# Automatically sync database tables on MySQL (Aiven) and launch NestJS
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/main.js"]
