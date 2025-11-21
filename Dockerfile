
FROM node:18 AS build
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-slim
WORKDIR /src
ENV NODE_ENV=production
COPY package*.json ./
# skip lifecycle scripts (avoid "husky: not found" during prod install)
RUN npm ci --omit=dev --ignore-scripts
# copy build output and docs from build stage into runtime image
COPY --from=build /src/dist ./dist
COPY --from=build /src/docs ./docs
# copy build output from correct path
COPY --from=build /src/dist ./dist
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
