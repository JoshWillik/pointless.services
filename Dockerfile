FROM node
ADD src/ /app
WORKDIR /app
RUN install
EXPOSE 80
CMD ["npm", "run", "start"]
