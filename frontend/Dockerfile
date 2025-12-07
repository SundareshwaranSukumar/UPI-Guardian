# Step 1: Build the React Application
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Build command may vary, usually 'npm run build'
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config if needed, otherwise default is used
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
