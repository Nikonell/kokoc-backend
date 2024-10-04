#!/bin/bash
bun prisma migrate deploy
bun run ./src/app.ts
