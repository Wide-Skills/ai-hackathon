# AI Agent Instructions & Best Practices

This document outlines everything an AI coding assistant needs to know when working on this project. Please adhere strictly to the following guidelines, rules, and best practices.

## Follow Structure
- **Design Patterns:** Match the coding style, formatting, and file organization of the current workspace.
- **Consistency:** Study the existing codebase before creating new files or modifying existing ones. Ensure your code blends seamlessly with the rest of the project.
- **Reusability:** Look for existing utilities, components, and configuration files before creating new ones. Do not reinvent the wheel.

## Use Docs
- **Reference Documentation:** Always refer to the official documentation for the frameworks, libraries, and tools being used (e.g., React, TypeScript, Node.js). 
- **Modern Standards:** Avoid deprecated features or unmaintained patterns. Rely on up-to-date best practices as outlined in the respective official docs.

## DOs (What you should do)
- **Write Clean Code:** Keep your code modular, readable, and focused on a single responsibility.
- **Add Context:** Provide meaningful comments for complex logic and ensure you update relevant documentation or component details when introducing significant changes.
- **Be Detail-Oriented:** Consider edge cases, error handling, and accessibility (where applicable) in your code.
- **Ask for Clarification:** If a task is ambiguous or lacks sufficient detail, stop and ask the user for clarification rather than making assumptions.

## DON'Ts (What you MUST avoid)
- **Avoid Type-Casting:** Do not resort to loose type overrides or forcing explicit type-casts (e.g., using `as any` or forced casting in TypeScript). Always define and utilize correct types and interfaces.
- **No Placeholders:** Avoid leaving `TODO` comments, placeholder text, or incomplete functions unless explicitly requested. Provide complete and working implementations.
- **Avoid Over-engineering:** Do not introduce complex patterns, unnecessary abstraction layers, or heavy dependencies if a simpler, more straightforward solution is effective and standard.
- **Do Not Guess:** If you are unsure about a specific project convention (like environment variables, secrets, or deployment pipelines), do not guess. Review existing files contextually or ask the user.

## Tooling & Execution
- **Use Appropriate Tools:** Always use the most specific tool available for a task (e.g., using file viewing/editing tools over arbitrary terminal bash commands).
- **Run Safely:** Never auto-run terminal commands that have potentially destructive or state-mutating side-effects without explicit user approval.
