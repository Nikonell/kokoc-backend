#!/bin/bash
bun prisma migrate deploy
bun run ./src/index.ts
