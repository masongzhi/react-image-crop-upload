const rollup = require("rollup");
const terser = require("rollup-plugin-terser").terser;
const babel = require("rollup-plugin-babel");
const postcss = require("rollup-plugin-postcss");

async function buildCrop() {
  const bundle = await rollup.rollup({
    input: "src/react-image-crop.js",
    plugins: [
      terser(),
      postcss({
        extract: true,
        plugins: [require("autoprefixer")]
      }),
      babel({
        exclude: "node_modules/**",
        plugins: ["external-helpers"]
      })
    ]
  });

  await bundle.write({
    file: "dist/react-image-crop.js",
    format: "es"
  });
}

async function buildUpload() {
  const bundle = await rollup.rollup({
    input: "index.js",
    plugins: [
      terser(),
      postcss({
        extract: true,
        plugins: [require("autoprefixer")]
      }),
      babel({
        exclude: "node_modules/**",
        plugins: ["external-helpers"]
      })
    ]
  });

  await bundle.write({
    file: "dist/index.js",
    format: "es"
  });
}

buildCrop();
buildUpload();
