FROM node:latest
ENV PORT=3000
COPY . /clinica-essencial
WORKDIR /clinica-essencial
RUN npm install
ENTRYPOINT npm run dev
EXPOSE $PORT