import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: 'class',
	theme: {
		extend: {
			// backgroundImage: {
			// 	"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
			// 	"gradient-conic":
			// 		"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			// },
      screens: {
        sm: '480px',
        md: '768px',
        lmd: '890px',
        lg: '976px',
        xl: '1024px',
        xxl: '1440px',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
      },
      typography: {
        headlineBig: {
          css: {
            color: '#191C1B',
            fontSize: '64px',
            fontWeight: 800,
            lineHeight: '78px',
          },
        },
        headlineMedium: {
          css: {
            color: '#191C1B',
            fontSize: '48px',
            fontWeight: 800,
            lineHeight: '60px',
          },
        },
        headlineLittle: {
          css: {
            color: '#191C1B',
            fontSize: '40px',
            fontWeight: 800,
            lineHeight: '48px',
          },
        },
        titleH1: {
          css: {
            color: '#191C1B',
            fontSize: '48px',
            fontWeight: 700,
            lineHeight: '60px',
          },
        },
        titleH2: {
          css: {
            color: '#191C1B',
            fontSize: '40px',
            fontWeight: 700,
            lineHeight: '50px',
          },
        },
        titleH3: {
          css: {
            color: '#191C1B',
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '40px',
          },
        },
        titleH4: {
          css: {
            color: '#191C1B',
            fontSize: '26px',
            fontWeight: 700,
            lineHeight: '32px',
          },
        },
        titleH5: {
          css: {
            color: '#191C1B',
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: '27px',
          },
        },
        titleH6: {
          css: {
            color: '#191C1B',
            fontSize: '18px',
            fontWeight: 700,
            lineHeight: '22px',
          },
        },
        titleLight: {
          css: {
            color: '#191C1B',
            fontSize: '18px',
            fontWeight: 700,
            lineHeight: '22px',
          },
        },
        bodyBoldBigger: {
          css: {
            color: '#191C1B',
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: '26px',
          },
        },
        bodyBold: {
          css: {
            color: '#191C1B',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '20px',
          },
        },
        body: {
          css: {
            color: '#191C1B',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '20px',
          },
        },
        bodyLight: {
          css: {
            color: '#191C1B',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '20px',
          },
        },
        labelBold: {
          css: {
            color: '#191C1B',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '18px',
          },
        },
        label: {
          css: {
            color: '#191C1B',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '18px',
          },
        },
        labelLight: {
          css: {
            color: '#191C1B',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '18px',
          },
        },
        labelSmallBold: {
          css: {
            color: '#191C1B',
            fontSize: '12px',
            fontWeight: 700,
            lineHeight: '15px',
          },
        },
        labelSmall: {
          css: {
            color: '#191C1B',
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: '15px',
          },
        },
        labelSmallLight: {
          css: {
            color: '#191C1B',
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '15px',
          },
        },
      },
      colors: {
        orange: {
          [50]: '#FEF4E7',
          [100]: '#FBDCB4',
          [200]: '#F9CB8F',
          [300]: '#F7B35C',
          [400]: '#F5A43D',
          [500]: '#F38D0C',
          [600]: '#DD800B',
          [700]: '#AD6409',
          [800]: '#864E07',
          [900]: '#663B05',
        },
        navy: {
          [50]: '#E9EBF8',
          [100]: '#B4C0CE',
          [200]: '#90A2B6',
          [300]: '#5D7794',
          [400]: '#3D5D80',
          [500]: '#0D3460',
          [600]: '#0C2F57',
          [700]: '#092544',
          [800]: '#071D35',
          [900]: '#051628',
        },
        danger: {
          D50: '#F7E8E8',
          D75: '#DFA2A2',
          D100: '#D27B7B',
          D200: '#BE4242',
          D300: '#B11B1B',
          D400: '#7C1313',
          D500: '#6C1010',
        },
        warning: {
          W50: '#FEF6E9',
          W75: '#FBDAA5',
          W100: '#F9CB80',
          W200: '#F7B449',
          W300: '#F5A524',
          W400: '#AC7319',
          W500: '#956516',
        },
        success: {
          S50: '#E8FAF0',
          S75: '#A0E9BF',
          S100: '#78E0A5',
          S200: '#3ED27E',
          S300: '#17C964',
          S400: '#108D46',
          S500: '#0E7B3D',
        },
        black: {
          [50]: '#E8E8E8',
          [100]: '#B8B9B8',
          [200]: '#959796',
          [300]: '#656766',
          [400]: '#474949',
          [500]: '#191C1B',
          [600]: '#171919',
          [700]: '#121413',
          [800]: '#0E0F0F',
          [900]: '#0B0C0B',
        },
        orangeSurface: {
          white: '#FFFFFF',
          whiteHover: '#FEF9F3',
          whiteActive: '#FDEDD8',
          light: '#FEF9F3',
          lightHover: '#FDEDD8',
          lightActive: '#FCE3C2',
          normal: '#FEF4E7',
          normalHover: '#FCE6CA',
          normalActive: '#FBD8AC',
          dark: '#FDEEDB',
        },
        blueSurface: {
          white: '#FFFFFF',
          whiteHover: '#F3F5F7',
          whiteActive: '#D8DFE6',
          light: '#F3F5F7',
          lightHover: '#D8DFE6',
          lightActive: '#C3CCD7',
          normal: '#E7EBEF',
          normalHover: '#CAD2DC',
          normalActive: '#ADBAC9',
          dark: '#DBE1E7',
        },
        blackSurface: {
          white: '#ffffff',
          whiteHover: '#f4f4f4',
          whiteActive: '#dadbdb',
          light: '#f4f4f4',
          lightHover: '#dadbdb',
          lightActive: '#c6c6c6',
          normal: '#e8e8e8',
          normalHover: '#cccdcd',
          normalAactive: '#b1b2b1',
          dark: '#dddddd',
        },
        common: {
          background: '#ffffff',
          surface: '#fff8f5',
          surfaceVariant: '#f2dfd1',
        },
      },
      spacing: {
        '64': '64px',
        '32': '32px',
      },
		},
	},
	plugins: [
		nextui(),
		require("@tailwindcss/typography"),
	],
};

export default config;
