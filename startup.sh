#!/bin/bash
bunx prisma migrate deploy
bun run /app/server.ts
