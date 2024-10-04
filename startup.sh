#!/bin/bash
bunx prisma migrate deploy
bun run /app/build/server.ts
