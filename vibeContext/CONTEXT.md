 # CONTEXT.md
 
 ## Introduction
  This document outlines the steps required to set up a React app with TypeScript, Node.js backend, using tailwind css. The app will use React Context API for managing theme switching.

 ## Tech Stack:
  React 19.1.0 with TypeScript
  Vite 7.0.4 as the build tool
  TailwindCSS 4.1.11 for styling
  Modern development tooling including ESLint and TypeScript configuration

  ## Project Structure:
  Modern modular architecture with clear separation of concerns
  Uses the latest React features with strict TypeScript typing

  ## Theme Implementation:
  Implements a theme system using React Context API
  ThemeContext.tsx defines a type-safe context with:
  Theme states: 'light' or 'dark'
  Toggle functionality for theme switching
  Default light theme

  ## Layout and Components:
  Organized layout structure with BaseLayout.tsx as the main layout component
  Modular component structure with:
  Header
  Footer
  Sidebar
  Components are organized in a hierarchical structure under the layouts directory

  ## Project Setup:

  Development server available via npm run dev
  Production build with TypeScript compilation (tsc -b && vite build)
  ESLint configuration for code quality
  Full TypeScript support with strict type checking
