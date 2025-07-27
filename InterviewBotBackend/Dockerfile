From node:22
RUN mkdir -p InterviewBot
WORKDIR /InterviewBot
COPY package.json .
RUN npm install
COPY . . 
EXPOSE 5000
CMD [ "node","index.js" ]