FROM alpine:3.7 as base

RUN apk update
ENV LANGUAGE=en_US.UTF-8 LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8

# Utilities
RUN apk add --no-cache wget jq tar nodejs git python make g++

# Build Stage
FROM base as build

# Build tools
COPY . /app
COPY ../contracts/build/contracts /app/abi/build
RUN cd /app && \
    npm --unsafe-perm install
RUN cd /app && \
    if cat package.json | jq -e '.scripts|has("build")' > /dev/bull; then \
      npm --unsafe-perm run build; \
    fi

# Final Stage
FROM base as final
COPY --from=build /app /app

# Open port for dev
EXPOSE 3000

WORKDIR /app

CMD ["npm", "start" ]