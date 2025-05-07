# Code Editor Using Sandpack & Next.js

A powerful in-browser code editor built with Next.js and Sandpack that allows you to write, run, and preview code directly in your browser.

![Code Editor Screenshot](public/screenshot.png)

## Features

- **Multiple Templates**: Choose from various templates including React, React TypeScript, Vue, Angular, Node.js, and more
- **File Explorer**: Navigate, create and manage files and folders
- **Code Editor**: Syntax highlighting and autocompletion
- **Live Preview**: See your changes in real-time
- **Auto-save**: Your code is automatically saved in the browser's localStorage
- **Reset Functionality**: Easily reset to the original template code

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the code editor.

## Usage

1. **Switch Templates**: Use the dropdown menu in the preview panel to switch between different templates
2. **Create Files**: Click the "New File" button in the file explorer and enter the file path/name
3. **Create Folders**: Click the "New Folder" button and enter the folder path
4. **Edit Code**: Use the code editor to write and edit your code
5. **Reset Template**: Click the reset button to restore the original template code

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Sandpack](https://sandpack.codesandbox.io/) - In-browser bundler and runtime
- [CodeMirror](https://codemirror.net/) - Text editor component (via Sandpack)
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Shadcn UI](https://ui.shadcn.com/) - UI components

## License

[MIT](LICENSE)
