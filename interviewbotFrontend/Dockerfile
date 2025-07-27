From node:22
RUN mkdir -p InterviewBot
WORKDIR /InterviewBot
COPY package.json .
RUN npm install
COPY . . 
EXPOSE 3000
CMD [ "npm","run","dev" ]