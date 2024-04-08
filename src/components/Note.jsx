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
	Container,
} from '@mui/material';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

const MenuBar = () => {
	const { editor } = useCurrentEditor();

	if (!editor) {
		return null;
	}

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
				>
					<MenuItem value={'paragraph'}>P</MenuItem>
					<MenuItem value={'1'}>H1</MenuItem>
					<MenuItem value={'2'}>H2</MenuItem>
					<MenuItem value={'3'}>H3</MenuItem>
					<MenuItem value={'4'}>H4</MenuItem>
					<MenuItem value={'5'}>H5</MenuItem>
					<MenuItem value={'6'}>H6</MenuItem>
				</Select>
				<IconButton
					onClick={() =>
						editor
							.chain()
							.focus()
							.setParagraph()
							.run()
					}
					className={editor.isActive('paragraph') ? 'is-active' : ''}
				>
					paragraph
				</IconButton>
				<IconButton
					onClick={() =>
						editor
							.chain()
							.focus()
							.toggleHeading({ level: 1 })
							.run()
					}
					className={
						editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
					}
				>
					h1
				</IconButton>
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
				<Button
					onClick={() =>
						editor
							.chain()
							.focus()
							.setColor('#958DF1')
							.run()
					}
					className={
						editor.isActive('textStyle', { color: '#958DF1' })
							? 'is-active'
							: ''
					}
				>
					purple
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

const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

export default () => {
	return (
		<Box sx={{ width: 1, heigh: 1, outline: '1px solid black' }}>
			<CssBaseline />
			<Box overflow='scroll' sx={{ height: 1, width: 1, p: 1 }}>
				<EditorProvider
					slotBefore={<MenuBar />}
					extensions={extensions}
					content={content}
				></EditorProvider>
			</Box>
		</Box>
	);
};
