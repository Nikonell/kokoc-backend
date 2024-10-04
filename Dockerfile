FROM oven/bun:latest AS base
WORKDIR /app

RUN apt-get update && apt install curl postgresql-client -y

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production
RUN bunx prisma generate

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests
ENV NODE_ENV=production
RUN bun test

# Build bundle
RUN cd /app && bun run build

# copy production dependencies and source code into final image
FROM base as release
COPY --from=prerelease /app/build/server.js ./server.js
COPY --from=prerelease /app/prisma ./prisma
COPY startup.sh /app/startup.sh

RUN ["chmod", "+x", "/app/startup.sh"]

USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["/app/startup.sh"]
