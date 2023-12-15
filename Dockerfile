FROM node:16
# Installing libvips-dev for sharp Compatability
RUN apt-get update && apt-get install libvips-dev -y
#ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/
COPY ./package.json ./
ENV PATH /opt/node_modules/.bin:$PATH
RUN npm install
WORKDIR /opt/app
COPY ./ .
COPY ./app/favicon.ico .
#RUN mkdir -p public
#RUN mkdir -p public/uploads
#RUN npm install react@^18.0.0 react-dom@^18.0.0 react-router-dom@^5.2.0 styled-components@^5.2.1
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "develop"]