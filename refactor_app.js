const fs = require('fs');

let content = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Add lazy and Suspense to imports
if (!content.includes('import { lazy, Suspense')) {
  // First, find the empty line before "import Home"
  content = content.replace(
    /import Home from "\.\/pages\/Home";/,
    'import { lazy, Suspense } from "react";\n\nconst Home = lazy(() => import("./pages/Home"));'
  );
}

// 2. Replace static page imports with lazy imports
const pageRegex = /import (\w+) from "\.\/(pages\/(?!provider\/)[a-zA-Z]+)";/g;
content = content.replace(pageRegex, 'const $1 = lazy(() => import("./$2"));');

const providerRegex = /import (\w+) from "\.\/pages\/provider\/([a-zA-Z]+)";/g;
content = content.replace(providerRegex, 'const $1 = lazy(() => import("./pages/provider/$2"));');

// The layout component shouldn't be lazy loaded if it's the element for a Route wrapper, 
// wait actually it can be. But let's leave ProviderLayout static to be safe.
// Let's make sure ProviderLayout doesn't get converted by the above regex? The regex targets `./pages/` 
// ProviderLayout is imported from `./components/provider/ProviderLayout`, so it's safe!

// 3. Add Suspense wrapper
const suspenseFallback = `
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0A0C10]">
    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
);
`;

if (!content.includes('SuspenseFallback')) {
  content = content.replace('function App() {', suspenseFallback + '\nfunction App() {');
}

if (!content.includes('<Suspense fallback={<SuspenseFallback />}>')) {
  content = content.replace(
    /<Routes>/,
    '<Suspense fallback={<SuspenseFallback />}>\n          <Routes>'
  );
  content = content.replace(
    /<\/Routes>/,
    '</Routes>\n          </Suspense>'
  );
}

fs.writeFileSync('frontend/src/App.jsx', content);
console.log("App.jsx refactored for lazy loading!");
