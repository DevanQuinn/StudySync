import {
	Code,
	FormatBold,
	FormatItalic,
	FormatListBulleted,
	FormatListNumbered,
	Redo,
	StrikethroughS,
	Undo,
} from '@mui/icons-material';
import {
	Button,
	CssBaseline,
	IconButton,
	Select,
	MenuItem,
	Box,
	AppBar,
	Toolbar,
	TextField,
} from '@mui/material';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorProvider, NodePos, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useState } from 'react';

const MenuBar = ({ updateNote, authorized }) => {
	const { editor } = useCurrentEditor();
	const [fontSize, setFontSize] = useState(0);
	const [color, setColor] = useState('#000000');

	if (!editor) {
		return null;
	}

	useEffect(() => {
		console.log(authorized);
		editor.options.editable = authorized;
	}, [authorized]);

	useEffect(() => {
		if (!editor) return;

		const handleSelectionUpdate = ({ editor }) => {
			const { color } = editor.getAttributes('textStyle');
			if (color) setColor(color);
			else setColor('#000000');

			if (editor.isActive('paragraph')) {
				setFontSize(0);
				return;
			}
			for (let i = 1; i <= 6; i++) {
				if (editor.isActive('heading', { level: i })) {
					setFontSize(i);
					return;
				}
			}
		};

		editor.on('selectionUpdate', handleSelectionUpdate);

		return () => {
			editor.off('selectionUpdate', handleSelectionUpdate);
		};
	}, [editor]);

	const handleFontChange = value => {
		setFontSize(value);
		if (value === 0) {
			editor
				.chain()
				.focus()
				.setParagraph()
				.run();
			return;
		}
		editor
			.chain()
			.focus()
			.toggleHeading({ level: value })
			.run();
		setFontSize(value);
	};

	const handleColorChange = event => {
		const { value } = event.target;
		setColor(value);
		editor
			.chain()
			.focus()
			.setColor(value)
			.run();
	};

	return (
		<AppBar position='relative' color='default'>
			<Toolbar>
				<IconButton
					onClick={() =>
						editor
							.chain()
							.focus()
							.toggleBold()
							.run()
					}
					disabled={
						!editor
							.can()
							.chain()
							.focus()
							.toggleBold()
							.run()
					}
				>
					<FormatBold color={editor.isActive('bold') ? 'primary' : 'action'} />
				</IconButton>
				<IconButton
					onClick={() =>
						editor
							.chain()
							.focus()
							.toggleItalic()
							.run()
					}
					disabled={
						!editor
							.can()
							.chain()
							.focus()
							.toggleItalic()
							.run()
					}
				>
					<FormatItalic
						color={editor.isActive('italic') ? 'primary' : 'action'}
					/>
				</IconButton>
				<IconButton
					onClick={() =>
						editor
							.chain()
							.focus()
							.toggleStrike()
							.run()
					}
					disabled={
						!editor
							.can()
							.chain()
							.focus()
							.toggleStrike()
							.run()
					}
				>
					<StrikethroughS
						color={editor.isActive('strike') ? 'primary' : 'action'}
					/>
				</IconButton>
				<IconButton
					onClick={() =>
						editor
							.chain()
							.focus()
							.toggleCode()
							.run()
					}
					disabled={
						!editor
							.can()
							.chain()
							.focus()
							.toggleCode()
							.run()
					}
				>
					<Code color={editor.isActive('code') ? 'primary' : 'action'} />
				</IconButton>
				<Select
					labelId='demo-simple-select-label'
					id='demo-simple-select'
					label='Size'
					value={fontSize}
					onChange={e => handleFontChange(e.target.value)}
				>
					<MenuItem value={0}>P</MenuItem>
					<MenuItem value={1}>H1</MenuItem>
					<MenuItem value={2}>H2</MenuItem>
					<MenuItem value={3}>H3</MenuItem>
					<MenuItem value={4}>H4</MenuItem>
					<MenuItem value={5}>H5</MenuItem>
					<MenuItem value={6}>H6</MenuItem>
				</Select>
				<IconButton
					onClick={() =>
						editor
							.chain()
							.focus()
							.toggleBulletList()
							.run()
					}
				>
					<FormatListBulleted
						color={editor.isActive('bulletList') ? 'primary' : 'action'}
					/>
				</IconButton>
				<IconButton
					onClick={() =>
						editor
							.chain()
							.focus()
							.toggleOrderedList()
							.run()
					}
				>
					<FormatListNumbered
						color={editor.isActive('orderedList') ? 'primary' : 'action'}
					/>
				</IconButton>
				<IconButton
					onClick={() =>
						editor
							.chain()
							.focus()
							.undo()
							.run()
					}
					disabled={
						!editor
							.can()
							.chain()
							.focus()
							.undo()
							.run()
					}
				>
					<Undo color={editor.isActive('undo') ? 'primary' : 'action'} />
				</IconButton>
				<IconButton
					onClick={() =>
						editor
							.chain()
							.focus()
							.redo()
							.run()
					}
					disabled={
						!editor
							.can()
							.chain()
							.focus()
							.redo()
							.run()
					}
				>
					<Redo color={editor.isActive('redo') ? 'primary' : 'action'} />
				</IconButton>
				<TextField
					type='color'
					sx={{ width: 50 }}
					value={color}
					onInput={handleColorChange}
				/>
				<Button
					onClick={async () => {
						editor.options.editable = false;
						await updateNote(editor.getJSON());
						editor.options.editable = true;
					}}
					disabled={!editor.options.editable}
				>
					Save
				</Button>
			</Toolbar>
		</AppBar>
	);
};

const extensions = [
	Color.configure({ types: [TextStyle.name, ListItem.name] }),
	TextStyle.configure({ types: [ListItem.name] }),
	StarterKit.configure({
		bulletList: {
			keepMarks: true,
			keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
		},
		orderedList: {
			keepMarks: true,
			keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
		},
	}),
];

export default ({ content, updateNote, authorized }) => {
	return (
		<Box
			sx={{
				width: 1,
				heigh: 1,
			}}
			overflow={'scroll'}
		>
			<CssBaseline />
			<Box
				overflow='scroll'
				sx={{ height: 1, width: 1, p: 1, textAlign: 'left' }}
			>
				<EditorProvider
					slotBefore={
						authorized ? (
							<MenuBar updateNote={updateNote} authorized={authorized} />
						) : null
					}
					extensions={extensions}
					content={content}
					autofocus
				></EditorProvider>
			</Box>
		</Box>
	);
};
