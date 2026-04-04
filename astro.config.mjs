import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
	site: 'https://aisecurityinpractice.com',
	output: 'server',
	adapter: vercel({
		webAnalytics: { enabled: true }
	}),
	integrations: [
		mermaid({
			autoTheme: true,
			mermaidConfig: {
				flowchart: { curve: 'basis' },
			},
		}),
		starlight({
			title: 'AI Security in Practice',
			description: 'Deep technical implementation guides for securing AI systems in production — covering threat modelling, prompt injection, guardrails, RAG security, compliance frameworks, and more.',
			tagline: 'Deep technical implementation guides for securing AI systems in production.',
			logo: {
				src: './src/assets/AISiP-logo.png',
				alt: 'AI Security in Practice',
				replacesTitle: true,
			},
			components: {
				PageFrame: './src/components/PageFrame.astro',
				Footer: './src/components/Footer.astro',
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/paullawlor-ai/aisecurityinpractice',
				},
			],
			editLink: {
				baseUrl: 'https://github.com/paullawlor-ai/aisecurityinpractice/edit/main/',
			},
			sidebar: [
				{ label: 'Home', link: '/' },
				{ label: 'Manifesto', link: '/manifesto/' },
				{
					label: 'Foundations',
					autogenerate: { directory: 'foundations' },
				},
				{
					label: 'Attack and Red Team',
					autogenerate: { directory: 'attack-and-red-team' },
				},
				{
					label: 'Defend and Harden',
					autogenerate: { directory: 'defend-and-harden' },
				},
				{
					label: 'Architecture and Platform',
					autogenerate: { directory: 'architecture-and-platform' },
				},
				{
					label: 'Governance, Risk and Compliance',
					autogenerate: { directory: 'governance-risk-compliance' },
				},
				{
					label: 'Emerging Threats and Research',
					autogenerate: { directory: 'emerging-threats-and-research' },
				},
			],
			lastUpdated: true,
			customCss: ['./src/styles/custom.css'],
		}),
	],
});
