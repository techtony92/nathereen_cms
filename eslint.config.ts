// @ts-check
import eslint from '@eslint/js';
import tseslint,{type Config} from 'typescript-eslint';
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import typescriptParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import pluginJest from "eslint-plugin-jest";
const configuration:Config =  tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    eslintPluginPrettierRecommended, // prettier is always last
    {
        files: ['**/*.{ts}', "**/*.{test}.{ts}"],

    },
    {
      ignores:[
          "@typescript-eslint/no-non-null-assertion",
          "node_modules/**",
          "coverage/**",
          "*.config.ts"
      ],
    },
 {
     plugins:{
         "jest":pluginJest,
         "@typescript-eslint":tsPlugin
     },

 },
  {
    languageOptions: {
        globals:pluginJest.environments.globals.globals,
        parser:typescriptParser,
        parserOptions: {
                projectService:true,
                tsconfigRootDir:__dirname
            },
        },
    },
    {

        rules:{
            '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
            "@no-undef":'off',
            /* Jest rules*/
            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/no-identical-title': 'error',
            'jest/prefer-to-have-length': 'warn',
            'jest/valid-expect': 'error',
            "prettier/prettier":[
                "off",
                {
                    "tabWidth":4,
                    "tabs":true,
                    "bracketSpacing": false ,
                    
                    
                }
            ]
        },
    }
);

export default configuration;