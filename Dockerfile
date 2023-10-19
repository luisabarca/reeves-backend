FROM node:20.8-alpine3.18

ENV NODE_ENV production

WORKDIR /app
EXPOSE 4000

# Copy all files.
COPY . .

# Required tools.
RUN npm install -g typescript
RUN npm install -g tsx
RUN npm i

CMD [ "npm", "run", "start" ]
