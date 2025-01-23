# Google Drive File Picker

## Setting up

Before setting up, make sure you have the `.env` file ready so this can be connected to the backend. It should follow the format below:

```env
AUTH_EMAIL=test@email.com
AUTH_PASSWORD=password
AUTH_URL=https://api.example.com
SUPABASE_URL=https://sb.example.com
API_KEY=example-api-key
```

To set up the project, follow these steps:

1. Install the dependencies:

```bash
npm install
```

2. For developing, it's recommended to run in the development server:

```bash
npm run dev
```

or

```bash
next dev
```

3. To see how the app looks like in production locally, run:

```bash
npm run build
npm run serve
```

### Tech Stacks

- **TanStack Query**: For data fetching and caching. Super straightforward to work with
- **TanStack Table**: A powerful tool for making tables, though it can get a bit overwhelming for those who are new
- **React Context API**: I chose this over Redux or Zustand since the state management flow in this app is rather simple and doesn't require complex logics so a global dependency injection API like Context is already a great choice
- **Next.js** and **Shadcn**