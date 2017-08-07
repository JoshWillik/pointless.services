FROM node
ADD src/ /app
WORKDIR /app
RUN npm install
EXPOSE 80
CMD ["npm", "run", "start"]
