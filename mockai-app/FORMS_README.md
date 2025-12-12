# Authentication Forms - React Hook Form + Zod + shadcn/ui

## 🎨 New Design

The login and register forms have been redesigned to perfectly match the landing page theme with:

- **Dark theme** with terminal background effect
- **Blue/cyan gradient** accents
- **Glassmorphic** form cards
- **Smooth animations** and transitions
- **Professional** and modern UI

## 📦 Installation

**Step 1:** Install the required dependencies

```bash
npm install react-hook-form zod @hookform/resolvers @radix-ui/react-label
```

If you have permission issues, use sudo:

```bash
sudo npm install react-hook-form zod @hookform/resolvers @radix-ui/react-label
```

**Step 2:** Restart your development server

```bash
npm run dev
```

## 🚀 Quick Start

### View the Forms

- **Login**: Visit `http://localhost:3000/login`
- **Register**: Visit `http://localhost:3000/register`
- **Home**: Visit `http://localhost:3000` (has auth buttons)

### Test Registration

1. Go to `/register`
2. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
3. Click "Sign Up"
4. You'll be redirected to home page, logged in

### Test Login

1. Go to `/login`
2. Enter credentials from registration
3. Click "Sign In"
4. You'll be redirected to home page, logged in

## 🛠️ Tech Stack

| Technology          | Purpose                               |
| ------------------- | ------------------------------------- |
| **React Hook Form** | Form state management and performance |
| **Zod**             | Schema validation and type safety     |
| **shadcn/ui**       | Form components and accessibility     |
| **Radix UI**        | Accessible primitives                 |
| **Tailwind CSS**    | Styling and theming                   |
| **Convex**          | Backend and database                  |

## 📁 File Structure

```
app/
├── login/
│   ├── page.tsx                        # Login route
│   └── _components/
│       └── login-form.tsx              # Login form component
└── register/
    ├── page.tsx                        # Register route
    └── _components/
        └── register-form.tsx           # Register form component

components/
└── ui/
    ├── form.tsx                        # shadcn Form components
    ├── input.tsx                       # Input component
    ├── label.tsx                       # Label component
    └── button.tsx                      # Button component

hooks/
└── use-auth.ts                         # Authentication hook

convex/
├── schema.ts                           # Database schema
└── auth.ts                             # Auth functions
```

## 🎯 Features

### Form Validation

✅ **Real-time validation** - Errors appear as you type
✅ **Type-safe schemas** - TypeScript catches errors at compile time
✅ **Custom error messages** - Clear, user-friendly messages
✅ **Field-level validation** - Each field validates independently

### User Experience

✅ **Loading states** - Clear feedback during submission
✅ **Error handling** - Graceful error display
✅ **Keyboard navigation** - Full keyboard support
✅ **Focus management** - Proper focus flow
✅ **Responsive design** - Works on all screen sizes

### Accessibility

✅ **ARIA labels** - Screen reader friendly
✅ **Keyboard navigation** - All features accessible via keyboard
✅ **Error announcements** - Errors announced to screen readers
✅ **Focus indicators** - Clear focus states

## 📝 Code Examples

### Login Form Schema

```typescript
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
```

### Register Form Schema

```typescript
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
```

### Using the Form Hook

```typescript
const form = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: "",
    password: "",
  },
});

const onSubmit = async (values: LoginFormValues) => {
  await signIn(values.email, values.password);
};
```

### Form Field Component

```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" placeholder="you@example.com" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## 🎨 Theme Customization

### Colors

The forms use these color variables (can be customized in `globals.css`):

```css
/* Backgrounds */
--background: #000000; /* Pure black */
--card: rgba(17, 24, 39, 0.5); /* Gray-900 with 50% opacity */

/* Borders */
--border: #1f2937; /* Gray-800 */

/* Text */
--foreground: #ffffff; /* White */
--muted-foreground: #9ca3af; /* Gray-400 */

/* Accents */
--primary: linear-gradient(to right, #3b82f6, #22d3ee); /* Blue to Cyan */

/* States */
--destructive: #ef4444; /* Red-500 for errors */
```

### Typography

```css
/* Headings */
.heading {
  @apply text-4xl font-bold;
  background: linear-gradient(to right, #3b82f6, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Labels */
.label {
  @apply text-gray-300 text-sm font-medium;
}

/* Inputs */
.input {
  @apply bg-gray-800/50 border-gray-700 text-white;
}
```

## 🔧 Customization

### Change Validation Rules

Edit the Zod schema in the form component:

```typescript
// Stronger password requirement
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});
```

### Add New Fields

1. Update the Zod schema:

```typescript
const schema = z.object({
  // ... existing fields
  phoneNumber: z.string().regex(/^\d{10}$/, "Invalid phone number"),
});
```

2. Add the form field:

```tsx
<FormField
  control={form.control}
  name="phoneNumber"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Phone Number</FormLabel>
      <FormControl>
        <Input type="tel" placeholder="1234567890" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

3. Update the Convex schema and mutation.

### Change Colors

Update the className in form components:

```tsx
// Change gradient
className = "bg-gradient-to-r from-purple-600 to-pink-500";

// Change input colors
className = "bg-gray-900 border-gray-600";
```

## 📊 Performance

- **Optimized renders**: React Hook Form minimizes re-renders
- **Lazy validation**: Validation only runs when needed
- **Small bundle**: Zod and RHF are lightweight
- **Fast feedback**: Instant validation on blur/submit

## 🐛 Troubleshooting

### "Cannot find module 'react-hook-form'"

**Solution**: Install dependencies

```bash
npm install react-hook-form zod @hookform/resolvers @radix-ui/react-label
```

### Form not validating

**Solution**: Check that resolver is passed to useForm

```typescript
const form = useForm({
  resolver: zodResolver(yourSchema), // ← Make sure this is here
});
```

### Styling looks wrong

**Solution**: Verify Tailwind is configured correctly

```bash
# Check tailwind.config.js exists
# Check globals.css has @tailwind directives
# Restart dev server
```

### TypeScript errors

**Solution**: Ensure types are correct

```typescript
// Define your form values type
type FormValues = z.infer<typeof yourSchema>;

// Use it in useForm
const form = useForm<FormValues>({
  /* ... */
});
```

### Submit button not working

**Solution**: Check form.handleSubmit is used

```tsx
<form onSubmit={form.handleSubmit(onSubmit)}>{/* ... */}</form>
```

## 📚 Resources

### Documentation

- [React Hook Form](https://react-hook-form.com/) - Form library docs
- [Zod](https://zod.dev/) - Validation library docs
- [shadcn/ui](https://ui.shadcn.com/) - Component library docs
- [Radix UI](https://www.radix-ui.com/) - Primitive components docs

### Examples

- [RHF + Zod Tutorial](https://react-hook-form.com/get-started#SchemaValidation)
- [shadcn/ui Form Examples](https://ui.shadcn.com/docs/components/form)
- [Zod Validation Examples](https://zod.dev/?id=basic-usage)

### Community

- [React Hook Form Discord](https://discord.gg/yYv7GZ8)
- [shadcn/ui GitHub](https://github.com/shadcn/ui)

## ✅ Next Steps

1. **Install dependencies** (see Installation section)
2. **Test the forms** (see Quick Start section)
3. **Review the code** (see File Structure section)
4. **Customize as needed** (see Customization section)
5. **Run the testing checklist** (see TESTING_CHECKLIST.md)

## 📧 Support

For issues or questions:

1. Check the Troubleshooting section
2. Review the documentation links
3. Check the main AUTH_README.md
4. Open an issue in the repository

---

Happy coding! 🚀
