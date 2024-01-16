# Stage 1: Build the Next.js frontend Port - 7860
FROM node:18.18-alpine AS frontend
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm run build

# Stage 2: Build the Flask backend Port - 5000
FROM python:3.9-slim-buster AS backend
WORKDIR /app/backend
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY /api/ .

# Stage 3: Combine frontend and backend
FROM node:18.18-alpine
WORKDIR /app
COPY --from=frontend /app/frontend/ ./app
COPY --from=backend /app/backend /app/api/

EXPOSE 7860
CMD ["npm", "run", "dev"]