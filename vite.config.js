import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import process from "node:process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    plugins: [
      react(),
      federation({
        name: "TheOdcAdminFE",
        remotes: {
          TheOdcMfUI: `${env.VITE_MF_REMOTE_URL}/assets/remoteEntry.js`,
        },
        shared: {
          react: {
            singleton: true,
            strictVersion: true,
            requiredVersion: "^19.0.0",
          },
          "react-dom": {
            singleton: true,
            strictVersion: true,
            requiredVersion: "^19.0.0",
          },
          "@mui/material": {
            singleton: true,
            strictVersion: true,
            requiredVersion: "^7.0.0",
          },
          "@emotion/react": {
            singleton: true,
            strictVersion: true,
            requiredVersion: "^11.14.0",
          },
          "@emotion/styled": {
            singleton: true,
            strictVersion: true,
            requiredVersion: "^11.14.0",
          },
          "react-router-dom": { singleton: true, strictVersion: true },
          "prop-types": { singleton: true, strictVersion: true },
          "react-hook-form": {
            singleton: true,
            strictVersion: true,
            requiredVersion: "^7.56.0",
          },
          "@hookform/resolvers": { singleton: true, strictVersion: true },
          zod: { singleton: true, strictVersion: true },
        },
      }),
      // {
      //   name: "vite-plugin-reload-endpoint",
      //   configureServer(server) {
      //     server.middlewares.use((req, res, next) => {
      //       if (req.url === "/__fullReload") {
      //         server.hot.send({ type: "full-reload" });

      //         res.end("Full reload triggered");
      //       } else {
      //         next();
      //       }
      //     });
      //   },
      // },
    ],
    server: {
      hmr: true,
      cors: true,
      proxy: {
        "/remoteEntry.js": env.VITE_MF_REMOTE_URL,
      },
    },

    build: {
      modulePreload: false,
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
  };
});
