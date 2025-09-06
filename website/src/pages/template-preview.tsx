import React, { useState } from 'react';
import Layout from '@theme/Layout';

function renderParameters(parameters: any[]) {
	return parameters?.map((param, idx) => {
		switch (param.type) {
			case 'text':
				return (
					<span key={idx} style={{ marginRight: '0.25rem' }}>
						{param.text}
					</span>
				);
			case 'image':
				return (
					<img
						key={idx}
						src={param.image?.link}
						alt="header"
						style={{ maxWidth: '100%' }}
					/>
				);
			case 'video':
				return (
					<video
						key={idx}
						src={param.video?.link}
						controls
						style={{ maxWidth: '100%' }}
					/>
				);
			case 'document':
				return (
					<a
						key={idx}
						href={param.document?.link}
						target="_blank"
						rel="noopener noreferrer"
					>
						{param.document?.filename || 'Document'}
					</a>
				);
			default:
				return (
					<span key={idx} style={{ marginRight: '0.25rem' }}>
						{JSON.stringify(param)}
					</span>
				);
		}
	});
}

function renderComponent(component: any, index: number) {
	switch (component.type) {
		case 'header':
			return (
				<div key={index}>
					<strong>Header:</strong> {renderParameters(component.parameters)}
				</div>
			);
		case 'body':
			return (
				<div key={index}>
					<strong>Body:</strong> {renderParameters(component.parameters)}
				</div>
			);
		case 'footer':
			return (
				<div key={index}>
					<strong>Footer:</strong> {renderParameters(component.parameters)}
				</div>
			);
		case 'button':
			return (
				<div key={index}>
					<button>{component.parameters?.[0]?.text || 'Button'}</button>
				</div>
			);
		default:
			return null;
	}
}

export default function TemplatePreviewPage(): JSX.Element {
	const [input, setInput] = useState('');
	const [template, setTemplate] = useState<any | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setInput(value);
		try {
			const json = JSON.parse(value);
			setTemplate(json);
			setError(null);
		} catch (err) {
			setTemplate(null);
			setError('Invalid JSON');
		}
	};

	return (
		<Layout title="Template Preview">
			<div style={{ padding: '2rem' }}>
				<textarea
					style={{ width: '100%', height: '200px' }}
					placeholder="Paste template JSON here"
					value={input}
					onChange={handleChange}
				/>
				{error && <p style={{ color: 'red' }}>{error}</p>}
				{template && (
					<div
						style={{
							border: '1px solid #ccc',
							padding: '1rem',
							marginTop: '1rem',
						}}
					>
						<h2>{template.name}</h2>
						{template.components?.map((comp: any, idx: number) =>
							renderComponent(comp, idx),
						)}
					</div>
				)}
			</div>
		</Layout>
	);
}
