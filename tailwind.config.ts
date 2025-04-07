
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				evo: {
					purple: '#8B5CF6',
					teal: '#0EA5E9',
					light: '#F2FCE2',
					dark: '#1A1F2C',
					neon: '#00FFFF',
					pink: '#F43F5E',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				neon: {
					blue: '#00FFFF',
					purple: '#BF00FF',
					pink: '#FF00FF',
					red: '#FF3131',
					green: '#39FF14',
					yellow: '#FFFF00'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'neon-pulse': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				},
				'flicker': {
					'0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
						opacity: '0.99',
						filter: 'brightness(1)'
					},
					'20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
						opacity: '0.4',
						filter: 'brightness(0.8)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
				'flicker': 'flicker 3s linear infinite',
				'float': 'float 3s ease-in-out infinite'
			},
			boxShadow: {
				'neon-blue': '0 0 5px #00FFFF, 0 0 10px #00FFFF',
				'neon-purple': '0 0 5px #BF00FF, 0 0 10px #BF00FF',
				'neon-pink': '0 0 5px #FF00FF, 0 0 10px #FF00FF',
				'neon-sm': '0 0 2px theme("colors.primary.DEFAULT"), 0 0 4px theme("colors.primary.DEFAULT")',
				'neon-md': '0 0 5px theme("colors.primary.DEFAULT"), 0 0 10px theme("colors.primary.DEFAULT")',
				'neon-lg': '0 0 7px theme("colors.primary.DEFAULT"), 0 0 14px theme("colors.primary.DEFAULT"), 0 0 21px theme("colors.primary.DEFAULT")'
			},
			textShadow: {
				'neon-sm': '0 0 2px theme("colors.primary.DEFAULT"), 0 0 4px theme("colors.primary.DEFAULT")',
				'neon-md': '0 0 5px theme("colors.primary.DEFAULT"), 0 0 10px theme("colors.primary.DEFAULT")',
				'neon-lg': '0 0 7px theme("colors.primary.DEFAULT"), 0 0 14px theme("colors.primary.DEFAULT"), 0 0 21px theme("colors.primary.DEFAULT")'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities, theme }) {
			const textShadows = theme('textShadow')
			const newUtilities = {}
			Object.keys(textShadows).forEach(key => {
				newUtilities[`.text-shadow-${key}`] = {
					'text-shadow': textShadows[key]
				}
			})
			addUtilities(newUtilities)
		}
	],
} satisfies Config;
