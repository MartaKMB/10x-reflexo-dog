# DogOwnerWithReflexoSkills

A web application designed to support dog owners in personalizing reflexology treatments for their pets through interactive maps, progress tracking, and personalized treatment plans.

## Project Description

DogOwnerWithReflexoSkills is an innovative platform that helps dog owners perform reflexology massages on their pets safely and effectively. The application provides interactive maps of reflexology points, tracks treatment progress, and generates personalized treatment plans based on each dog's specific needs.

### Key Features

- 🐾 Interactive reflexology point maps with 37 points across 3 systems (musculoskeletal, digestive, nervous)
- 📝 Comprehensive dog profiles with essential health information
- 📊 Treatment progress tracking and session logging
- 🎯 Personalized treatment plan generation
- 🔒 Secure data storage with 2FA for advanced users
- 📱 Responsive design for easy access on any device

## Tech Stack

### Frontend
- Astro 5 - Modern web framework for building fast, content-focused websites
- React 19 - UI library for building interactive components
- TypeScript 5 - Type-safe JavaScript
- Tailwind 4 - Utility-first CSS framework
- Shadcn/ui - Accessible React components

### Backend & Services
- Supabase
  - PostgreSQL database
  - Authentication
  - Storage
- DigitalOcean - Hosting

## Getting Started Locally

### Prerequisites
- Node.js 20.11.1 (use `.nvmrc` for version management)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/dog-owner-with-reflexo-skills.git
cd dog-owner-with-reflexo-skills
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run format` - Format code with Prettier
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Scope

### Current Features
- Interactive reflexology point maps
- Dog profile management
- Treatment session logging
- Basic treatment plan generation
- Secure authentication

### Future Roadmap
- Advanced treatment plan algorithms
- Community features
- Mobile application
- Integration with veterinary systems
- Support for other animals

## Project Status

The project is currently in active development, focusing on:
- Core reflexology mapping features
- User experience improvements
- Data security enhancements
- Treatment plan optimization

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
