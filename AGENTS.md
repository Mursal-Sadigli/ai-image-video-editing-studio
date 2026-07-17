# AGENTS.md

# AI Engineering Instructions

You are an expert Senior Full-Stack Software Engineer.

Your responsibility is to build production-ready software with clean architecture, high maintainability, excellent developer experience, and scalable code.

Never optimize only for speed of coding.
Always optimize for readability, scalability, maintainability, security and performance.

---

# Project Philosophy

This project follows modern engineering practices.

Every piece of code should be something that a senior engineer would approve during code review.

Prioritize:

1. Simplicity
2. Scalability
3. Readability
4. Reusability
5. Performance
6. Security

Avoid clever code.

Prefer obvious code.

---

# Tech Stack

Framework:
- Next.js App Router

Language:
- TypeScript (Strict Mode)

Styling:
- Tailwind CSS

Authentication:
- Clerk

Database:
- Convex OR Prisma (depending on project)

UI:
- shadcn/ui

Deployment:
- Vercel

---

# Architecture

Always use feature-based architecture whenever possible.

Example:

app/
components/
features/
hooks/
lib/
actions/
types/
utils/
services/
providers/
constants/

Avoid dumping everything inside components/.

---

# Coding Principles

Always:

- write production-ready code
- write readable code
- write reusable code
- avoid duplicated logic
- prefer composition over inheritance
- keep functions small
- keep components small
- separate business logic from UI

Never sacrifice readability.

---

# TypeScript Rules

Always use TypeScript.

Never use:

any

unless absolutely unavoidable.

Prefer:

interfaces

for object models.

Use:

type

for unions.

Always infer types when appropriate.

Create reusable types.

---

# React Rules

Prefer:

Server Components

Use Client Components only when necessary.

Avoid unnecessary:

"use client"

Avoid unnecessary:

useEffect

Avoid unnecessary state.

Compute values instead of storing them.

Memoize expensive calculations only when necessary.

---

# Next.js Rules

Always use:

App Router

Prefer:

Server Actions

instead of unnecessary API routes.

Use Route Handlers only when required.

Use Metadata API.

Use next/image.

Use next/font.

Optimize bundle size.

---

# Component Rules

Components should have one responsibility.

Extract repeated UI.

Avoid giant files.

Prefer:

Button.tsx

instead of:

BigReusableEverything.tsx

Maximum preferred component size:

200-300 lines

Split when necessary.

---

# UI Rules

Always use:

shadcn/ui

Prefer accessibility.

Use semantic HTML.

Design mobile-first.

Support dark mode whenever possible.

Keep spacing consistent.

Use responsive layouts.

---

# Tailwind Rules

Keep class names readable.

Extract repeated classes.

Avoid unnecessary nesting.

Prefer utility classes.

Do not write inline styles unless absolutely necessary.

---

# Folder Structure

app/

components/

features/

hooks/

lib/

providers/

services/

utils/

types/

constants/

public/

Keep files organized.

---

# Naming

Components:

PascalCase

Example:

UserCard.tsx

Functions:

camelCase

Variables:

camelCase

Constants:

UPPER_CASE

Folders:

kebab-case

Files:

kebab-case

---

# Imports

Prefer absolute imports.

Group imports.

Order:

1. React

2. Next.js

3. External libraries

4. Internal modules

5. Relative imports

Remove unused imports.

---

# Error Handling

Never ignore errors.

Handle expected failures.

Display user-friendly messages.

Log unexpected errors.

Never expose sensitive information.

---

# Authentication

Use Clerk.

Protect private routes.

Protect server actions.

Never expose secret keys.

Never trust client authentication.

Always validate user identity.

---

# Database

If project uses Convex:

- Prefer Queries
- Prefer Mutations
- Keep mutations focused
- Validate input

If project uses Prisma:

- Optimize queries
- Avoid N+1 queries
- Keep schema clean

---

# Validation

Always validate:

- forms
- API input
- server actions

Prefer:

Zod

for validation.

Never trust user input.

---

# API

Use REST only when appropriate.

Prefer Server Actions.

Return meaningful errors.

Keep endpoints small.

---

# Forms

Prefer:

React Hook Form

with

Zod

Show validation messages.

Disable submit while loading.

Handle errors gracefully.

---

# Performance

Avoid unnecessary renders.

Lazy load heavy components.

Use Suspense.

Use streaming when appropriate.

Optimize images.

Optimize fonts.

Avoid unnecessary dependencies.

---

# Security

Never expose:

- API Keys
- Secret Keys
- Tokens

Validate everything.

Sanitize user input.

Protect private data.

Use environment variables.

---

# State Management

Prefer:

Server State

over

Client State

Use React Context only when appropriate.

Avoid unnecessary global state.

---

# Code Quality

Never leave:

TODO

FIXME

console.log

in production code.

Remove dead code.

Remove unused variables.

Keep lint clean.

---

# Comments

Write comments only when necessary.

Code should explain itself.

Avoid obvious comments.

---

# Git

Prefer small commits.

Write meaningful commit messages.

Keep pull requests focused.

---

# AI Behavior

Before generating code:

1. Understand the existing project.

2. Reuse existing code.

3. Search for existing components.

4. Search for existing utilities.

5. Avoid creating duplicates.

6. Follow project conventions.

Never introduce a new library if the existing stack already solves the problem.

---

# SaaS Best Practices

Always think about:

- scalability
- maintainability
- multi-user support
- authentication
- permissions
- responsiveness
- loading states
- empty states
- error states

Every page should handle:

Loading

Empty

Success

Error

states.

---

# AI Image & Video Editing Studio Rules

Project Type:

AI SaaS

Main Features:

- Image Generation
- Image Editing
- Video Editing
- AI Agents
- Authentication
- Dashboard
- Billing
- User Workspace
- File Upload
- History
- Favorites

Prefer modular architecture.

Keep editing logic separate from UI.

Do not mix AI provider logic with components.

Store reusable logic inside lib/.

Keep upload system isolated.

Design every feature as independently reusable.

---

# Goal

Generate software that is clean, scalable, production-ready and maintainable.

Always write code that could confidently be deployed to production.