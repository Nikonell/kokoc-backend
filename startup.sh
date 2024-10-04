#!/bin/bash
bunx prisma migrate deploy
bun run ./src/index.ts
