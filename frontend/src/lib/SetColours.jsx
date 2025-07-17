const themePresets = {
   Green: {
    "--accent": "#22c55e", // green-500
    "--accent-bg-light": "#d6f7d2", // green-100
    "--accent-bg-dark": "#15803d", // green-700
    "--accent-border": "#166534", // green-800
    "--accent-underline": "#22c55e", // green-500
    "--accent-shadow": "0px 0px 80px -14px rgba(34, 197, 94, 0.5)",
    "--accent-highlight": "rgba(34, 197, 94, 0.08)",
   },

   Blue: {
    "--accent": "#3b82f6", // blue-500
    "--accent-bg-light": "#d2dcf7", // blue-100
    "--accent-bg-dark": "#1e40af", // blue-800
    "--accent-border": "#1e3a8a", // blue-900
    "--accent-underline": "#2563eb", // blue-600
    "--accent-shadow": "0px 0px 80px -14px rgba(59, 130, 246, 0.5)",
    "--accent-highlight": "rgba(59, 130, 246, 0.08)",
   },

   Red: {
    "--accent": "#ef4444", // red-500
    "--accent-bg-light": "#ffc9c9", // red-100
    "--accent-bg-dark": "#b91c1c", // red-700
    "--accent-border": "#7f1d1d", // red-900
    "--accent-underline": "#dc2626", // red-600
    "--accent-shadow": "0px 0px 80px -14px #ffb8b8",
    "--accent-highlight": "rgba(239, 68, 68, 0.08)",
   },

   Black: {
    "--accent": "#111827", // slate-900
    "--accent-bg-light": "#f7f7f7", // gray-100
    "--accent-bg-dark": "#1f2937", // gray-800
    "--accent-border": "#0f172a", // slate-950
    "--accent-underline": "#334155", // slate-700
    "--accent-shadow": "0px 0px 80px -14px rgba(0, 0, 0, 0.8)",
    "--accent-highlight": "rgba(17, 24, 39, 0.08)",
   },

   Beige: {
    "--accent": "#d6a75c",
    "--accent-bg-light": "#faecde", // warm beige
    "--accent-bg-dark": "#c58f36",
    "--accent-border": "#b7791f",
    "--accent-underline": "#f5c07c",
    "--accent-shadow": "0px 0px 80px -14px #ffb778",
    "--accent-highlight": "rgba(214, 167, 92, 0.08)",
   },

   Yellow: {
    "--accent": "#eab308", // yellow-500
    "--accent-bg-light": "#f6f7d7", // yellow-100
    "--accent-bg-dark": "#ca8a04", // yellow-700
    "--accent-border": "#a16207", // yellow-800
    "--accent-underline": "#facc15", // yellow-400
    "--accent-shadow": "0px 0px 80px -14px rgba(234, 179, 8, 0.5)",
    "--accent-highlight": "rgba(234, 179, 8, 0.08)",
   },
};

export const applyMode = (mode)=>{
  const selectedMode =mode;

  localStorage.setItem("accent-mode",mode)
  
  if(selectedMode === "Light"){
    document.documentElement.style.setProperty("--accent-text-mode","rgb(0, 3, 14)")
    document.documentElement.style.setProperty("--accent-bg-mode","#f5f6fa" )
  }
  else{
    document.documentElement.style.setProperty("--accent-text-mode","#ebebeb")
    document.documentElement.style.setProperty("--accent-bg-mode","#000717")
  }
}

export const applyTheme = (themeName) => {
  const selectedTheme = themePresets[themeName];
//   console.log(themeName)
//   console.log(selectedTheme)
  if (!selectedTheme) return;

   Object.entries(selectedTheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
   });

  localStorage.setItem("accent-theme", themeName);
};
