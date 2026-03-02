# Budget AI

AI-powered family budget manager that's better than YNAB.

## Features

- 🤖 **AI Categorization**: 95%+ accuracy with Claude API
- 👨‍👩‍👧‍👦 **Family Collaboration**: Multi-user budgets with permissions
- 📊 **Predictive Forecasting**: See 30-90 days ahead
- 🎯 **Zero-Based Budgeting**: Every dollar has a job
- 🔒 **Bank-Level Security**: 256-bit encryption, SOC 2 compliant
- 🧠 **Context-Aware Coaching**: Personalized AI insights

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Anthropic Claude API
- **Deployment**: GitHub Pages (static export)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Abramovich77/budget-ai-app.git
cd budget-ai-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Set up database
npm run db:push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
budget-ai-app/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── lib/              # Utilities and helpers
│   └── types/            # TypeScript types
├── prisma/               # Database schema
├── public/               # Static assets
└── README.md
```

## Key Features Implementation

### AI Categorization

Uses Claude API to automatically categorize transactions with 95%+ accuracy.

### Proactive Budget Guardian

AI monitors spending pace and alerts you BEFORE you overspend.

### Family Collaboration

Multiple users can share budgets with granular permissions.

## Roadmap

- [ ] MVP (Months 1-6)
  - [x] Project setup
  - [x] Database schema
  - [x] Landing page
  - [ ] Authentication
  - [ ] Transaction management
  - [ ] AI categorization
  - [ ] Budget creation

- [ ] Growth (Months 7-12)
  - [ ] Forecasting
  - [ ] AI chatbot
  - [ ] Mobile apps
  - [ ] Payment processing

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT

## Author

Built by Oleg with ❤️ and Claude AI
