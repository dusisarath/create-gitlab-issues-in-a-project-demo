#license: Licensed Materials - Property of IBM
#copyright: (c) Copyright IBM Corporation 2019 All Rights Reserved.
#note: Note to U.S. Government Users Restricted Rights: Use, duplication or disclosure restricted by GSA ADP
#Schedule Contract with IBM Corp.

FROM node:8.12-alpine

# apk packages we want
RUN apk add --no-cache tini bash

# Docker run settings
EXPOSE 3002
ENTRYPOINT ["/sbin/tini", "-vg", "--"]
# COPY dependencies
WORKDIR /usr/src/app
COPY package.json .
#Copy source code
COPY . .
# INSTALL dependencies
RUN npm install --silent \
    # app should create its own logging dirs...
    && mkdir -p /usr/src/app/logs

# Bundle app source (see .dockerignore)
CMD ["ls" ,"-ltr"]
CMD ["node", "gitlab-issue-creator.js"]
