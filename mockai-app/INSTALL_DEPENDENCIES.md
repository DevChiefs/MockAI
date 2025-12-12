# Install Required Dependencies

Before running the updated authentication forms, you need to install the following packages:

## Required Packages

```bash
npm install react-hook-form zod @hookform/resolvers @radix-ui/react-label
```

Or if you need to use sudo (due to permission issues):

```bash
sudo npm install react-hook-form zod @hookform/resolvers @radix-ui/react-label
```

## What These Packages Do

- **react-hook-form**: Performant, flexible forms with easy-to-use validation
- **zod**: TypeScript-first schema validation library
- **@hookform/resolvers**: Resolver library to integrate Zod with React Hook Form
- **@radix-ui/react-label**: Accessible label component from Radix UI

## After Installation

Once the packages are installed, restart your development server:

```bash
npm run dev
```

Then visit:

- `http://localhost:3000/login` - Login page
- `http://localhost:3000/register` - Registration page

## What Changed

The login and register forms now:

- ✅ Match the landing page theme (dark with blue/cyan gradients and terminal background)
- ✅ Use React Hook Form for better form management
- ✅ Use Zod for schema validation
- ✅ Use shadcn/ui Form components for consistent styling
- ✅ Have better error handling and validation messages
- ✅ Include real-time form validation
- ✅ Are fully accessible with Radix UI primitives

## Troubleshooting

If you still have permission issues, you may need to fix your npm permissions:

```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /Users/cncdev/Documents/MockAI/mockai-app/node_modules
```

Then try installing again without sudo:

```bash
npm install react-hook-form zod @hookform/resolvers @radix-ui/react-label
```
