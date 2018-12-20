FROM alpine:3.8 as base

RUN apk update
ENV LANGUAGE=en_US.UTF-8 LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8

# Utilities
RUN apk add --no-cache nodejs
RUN apk add --no-cache wget jq tar yarn git python make g++
RUN yarn global add node-gyp

# Build Stage
FROM base as build

# Build tools
COPY . /app
# COPY ../contracts/build/contracts /app/src/abi/build
RUN cd /app && \
    yarn 
# RUN cd /app && \
#     if cat package.json | jq -e '.scripts|has("build")' > /dev/bull; then \
#       yarn --unsafe-perm run build; \
#     fi

# Final Stage
FROM base as final
COPY --from=build /app /app

# Open port for dev
EXPOSE 3000

WORKDIR /app

CMD ["yarn", "start" ]
