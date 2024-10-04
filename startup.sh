#!/bin/bash
bunx prisma migrate deploy
bun run ./server.js
